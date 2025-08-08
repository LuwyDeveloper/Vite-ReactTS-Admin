import { Fragment, useState, useEffect } from 'react';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	Row,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '@/components/ui/Card';
import {
	TableCardFooterTemplate,
	TableIndeterminateCheckbox,
} from '@/templates/common/TableParts.template';
import Table, { TBody, Td, Th, THead, Tr } from '@/components/ui/Table';
import Icon from '@/components/icon/Icon';
import classNames from 'classnames';
import Input from '@/components/form/Input';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import priceFormat from '@/utils/priceFormat.util';
import Checkbox from '@/components/form/Checkbox';
import { useNavigate } from 'react-router';
import pages from '@/Routes/pages';
import mapFakeStoreToProduct, { IProduct, IFakeStoreProduct } from '@/mocks/products';
import { loadProductsFromStorage, saveProductsToStorage } from '@/context/ProductsApiContext';

const EditSubComponent = ({
	row,
	onUpdate,
}: {
	row: Row<IProduct>;
	onUpdate: (updatedProduct: IProduct) => void;
}) => {
	const [name, setName] = useState<string>(row.original.name);
	const [sku, setSku] = useState<string>(row.original.sku);
	const [stock, setStock] = useState<number>(row.original.stock);
	const [price, setPrice] = useState<number>(row.original.price);

	return (
		<pre>
			<div className='grid grid-cols-12 gap-4'>
				<div className='col-span-12 lg:col-span-3'>
					<Input
						name='name'
						label='Name'
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className='col-span-12 lg:col-span-3'>
					<Input
						name='sku'
						label='SKU'
						value={sku}
						onChange={(e) => setSku(e.target.value)}
					/>
				</div>
				<div className='col-span-12 lg:col-span-3'>
					<Input
						name='stock'
						type='number'
						label='Stock'
						value={stock}
						onChange={(e) => setStock(Number(e.target.value))}
					/>
				</div>
				<div className='col-span-12 lg:col-span-3'>
					<Input
						name='price'
						type='number'
						label='Price'
						value={price}
						step='0.01'
						min={0}
						onChange={(e) => setPrice(Number(e.target.value))}
					/>
				</div>
				<div className='col-span-12'></div>
				<div className='col-span-12 flex justify-end'>
					<Button
						aria-label='Save'
						variant='soft'
						onClick={() => {
							onUpdate({
								...row.original,
								name,
								sku,
								stock,
								price,
							});
							row.toggleExpanded();
						}}>
						Save
					</Button>
				</div>
			</div>
		</pre>
	);
};

const TableExpandableApi = () => {
	const navigate = useNavigate();

	const [data, setData] = useState<IProduct[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const local = loadProductsFromStorage();
		if (local.length > 0) {
			setData(local);
			setLoading(false);
			return;
		}

		const fetchProducts = async () => {
			try {
				setLoading(true);
				const response = await fetch('https://fakestoreapi.com/products');

				if (!response.ok) {
					throw new Error(`Error: ${response.status}`);
				}

				const fakeStoreProducts: IFakeStoreProduct[] = await response.json();
				const mappedProducts = fakeStoreProducts.map(mapFakeStoreToProduct);

				setData(mappedProducts);
				saveProductsToStorage(mappedProducts);
				setError(null);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al cargar productos');
				console.error('Error fetching products:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	const handleUpdate = (updatedProduct: IProduct) => {
		const updated = data.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
		setData(updated);
		saveProductsToStorage(updated);
	};

	const columns: ColumnDef<IProduct>[] = [
		{
			header: 'Product',
			// footer: (props) => props.column.id,
			columns: [
				{
					id: 'select',
					header: ({ table }) => (
						<TableIndeterminateCheckbox
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...{
								checked: table.getIsAllRowsSelected(),
								indeterminate: table.getIsSomeRowsSelected(),
								onChange: table.getToggleAllRowsSelectedHandler(),
							}}
						/>
					),
					cell: ({ row }) => (
						<TableIndeterminateCheckbox
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...{
								checked: row.getIsSelected(),
								disabled: !row.getCanSelect(),
								indeterminate: row.getIsSomeSelected(),
								onChange: row.getToggleSelectedHandler(),
							}}
						/>
					),
					meta: {
						className: 'px-0! w-8',
					},
				},
				{
					id: 'expander',
					header: () => null,
					cell: ({ row }) => {
						return row.getCanExpand() ? (
							<button
								{...{
									onClick: row.getToggleExpandedHandler(),
									style: { cursor: 'pointer' },
								}}>
								{row.getIsExpanded() ? (
									<Icon icon='ArrowDown01' />
								) : (
									<Icon icon='ArrowRight01' />
								)}
							</button>
						) : (
							<Icon icon='MinusSign' />
						);
					},
				},
				{
					accessorKey: 'image',
					header: 'Image',
					cell: ({ row, getValue }) => (
						<div className='flex gap-2'>
							<img
								src={getValue<string>()}
								alt={row.original.name}
								className='h-10 w-10 rounded-lg object-cover'
							/>
						</div>
					),
				},
				{
					accessorKey: 'name',
					header: 'Name',
					cell: ({ row, getValue }) => (
						<div
							className='truncate'
							style={{
								// Since rows are flattened by default,
								// we can use the row.depth property
								// and paddingLeft to visually indicate the depth
								// of the row
								paddingLeft: `${row.depth * 2}rem`,
							}}>
							{getValue<string>()}
						</div>
					),
				},

				{
					accessorKey: 'sku',
					id: 'sku',
					// accessorFn: (row) => row.name,
					cell: (info) => (
						<div className='truncate font-mono font-bold'>{info.getValue()}</div>
					),
					header: () => 'SKU',
				},
			],
		},
		{
			header: 'More Info',
			columns: [
				{
					accessorKey: 'category',
					header: () => 'Category',
					cell: ({ row }) => (
						<div className='flex gap-2'>
							{row.original.category.map((item) => (
								<Badge key={item.id} variant='soft' color='zinc'>
									<div
										className={`h-4 w-1 rounded-2xl bg-${item.color}-500`}></div>
									<span>{item.name}</span>
								</Badge>
							))}
						</div>
					),
				},
				{
					accessorKey: 'tag',
					header: () => 'Tag',
					cell: ({ row }) => (
						<div className='flex gap-2'>
							{row.original.tag.map((item) => (
								<Badge
									key={item.id}
									variant='soft'
									color={item.color}
									className='truncate'>
									{item.name}
								</Badge>
							))}
						</div>
					),
				},
				{
					accessorKey: 'store',
					header: () => 'Store',
					cell: ({ row }) => (
						<div className='flex gap-2'>
							{row.original.store.map((item) => (
								<Badge
									key={item}
									variant='outline'
									color='zinc'
									className='truncate'>
									{item}
								</Badge>
							))}
						</div>
					),
				},
				{
					accessorKey: 'stock',
					header: () => 'Stock',
					cell: (info) => <div>{info.getValue()}</div>,
				},
				{
					accessorKey: 'price',
					header: () => 'Price',
					cell: (info) => <div>{priceFormat(info.getValue())}</div>,
				},
				{
					accessorKey: 'status',
					header: () => 'Status',
					cell: ({ row, getValue }) => {
						const isChecked = getValue();
						const product = row.original;

						const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
							const updatedProduct: IProduct = {
								...product,
								status: e.target.checked,
							};
							handleUpdate(updatedProduct);
						};

						return (
							<Checkbox
								variant='switch'
								checked={isChecked}
								onChange={handleChange}
							/>
						);
					},
				},
			],
		},
		{
			header: 'Actions',
			cell: ({ row }) => (
				<div className='flex gap-2'>
					<Button
						aria-label='Edit'
						icon='Edit02'
						variant='link'
						onClick={() =>
							navigate(
								`${pages.apps.products.subPages.editapi.to}?productId=${
									row.original.id
								}`,
							)
						}
					/>
					<Button
						aria-label='Delete'
						icon='Trash01'
						variant='link'
						onClick={() => {
							const confirmDelete = window.confirm(
								`¿Estás seguro de eliminar "${row.original.name}"?`,
							);
							if (!confirmDelete) return;

							const updated = data.filter((p) => p.id !== row.original.id);
							setData(updated);
							saveProductsToStorage(updated);
						}}
					/>
				</div>
			),
		},
	];

	const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }]);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [rowSelection, setRowSelection] = useState({});

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			globalFilter,
			rowSelection,
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		enableGlobalFilter: true,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getRowCanExpand: () => true,
		getExpandedRowModel: getExpandedRowModel(),
		initialState: {
			pagination: { pageSize: 10 },
		},
	});

	if (loading) {
		return (
			<Card className='h-full'>
				<CardHeader>
					<CardHeaderChild>
						<CardTitle
							iconProps={{
								icon: 'PropertyNew',
								color: 'blue',
								size: 'text-3xl',
							}}>
							Products
						</CardTitle>
					</CardHeaderChild>
				</CardHeader>
				<CardBody className='flex h-96 items-center justify-center'>
					<div className='flex flex-col items-center gap-4'>
						<Icon icon='Loading' className='animate-spin text-4xl' />
						<p>Cargando productos...</p>
					</div>
				</CardBody>
			</Card>
		);
	}

	if (error) {
		return (
			<Card className='h-full'>
				<CardHeader>
					<CardHeaderChild>
						<CardTitle
							iconProps={{
								icon: 'PropertyNew',
								color: 'red',
								size: 'text-3xl',
							}}>
							Products
						</CardTitle>
					</CardHeaderChild>
					<CardHeaderChild>
						<Button aria-label='Crear' variant='soft' color='zinc'>
							Crear
						</Button>
					</CardHeaderChild>
				</CardHeader>
				<CardBody className='flex h-96 items-center justify-center'>
					<div className='flex flex-col items-center gap-4'>
						<Icon icon='AlertTriangle' className='text-4xl text-red-500' />
						<p className='text-red-500'>Error: {error}</p>
						<Button variant='outline' onClick={() => window.location.reload()}>
							Reintentar
						</Button>
					</div>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card className='h-full'>
			<CardHeader>
				<CardHeaderChild>
					<CardTitle
						iconProps={{
							icon: 'PropertyNew',
							color: 'blue',
							size: 'text-3xl',
						}}>
						Products
					</CardTitle>
				</CardHeaderChild>
			</CardHeader>
			<CardBody className='overflow-y-auto'>
				<Table>
					<THead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<Th
											key={header.id}
											colSpan={header.colSpan}
											// eslint-disable-next-line react/jsx-props-no-spreading
											{...header.column.columnDef.meta}>
											{header.isPlaceholder ? null : (
												<div
													key={header.id}
													aria-hidden='true'
													{...{
														className: classNames(
															'flex gap-2 items-center justify-center',
															{
																'cursor-pointer select-none':
																	header.column.getCanSort(),
															},
														),

														onClick:
															header.column.getToggleSortingHandler(),
													}}>
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													{{
														asc: (
															<Icon
																icon='Sorting02'
																color='blue'
																className='ltr:ml-1.5 rtl:mr-1.5'
															/>
														),
														desc: (
															<Icon
																icon='Sorting01'
																color='blue'
																className='ltr:ml-1.5 rtl:mr-1.5'
															/>
														),
													}[header.column.getIsSorted() as string] ??
														null}
													{header.column.getCanSort() &&
														!(header.column.getIsSorted() as string) && (
															<Icon
																icon='Sorting05'
																className='ltr:ml-1.5 rtl:mr-1.5'
															/>
														)}
												</div>
											)}
										</Th>
									);
								})}
							</Tr>
						))}
					</THead>
					<TBody>
						{table.getRowModel().rows.map((row) => {
							return (
								<Fragment key={row.id}>
									<Tr>
										{/* the first row is a normal row */}
										{row.getVisibleCells().map((cell) => {
											return (
												<Td key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</Td>
											);
										})}
									</Tr>
									{row.getIsExpanded() && (
										<Tr>
											{/* 2nd row is a custom 1 cell row */}
											<Td colSpan={row.getVisibleCells().length}>
												<EditSubComponent
													row={row}
													onUpdate={handleUpdate}
												/>
											</Td>
										</Tr>
									)}
								</Fragment>
							);
						})}
					</TBody>
				</Table>
			</CardBody>
			<TableCardFooterTemplate table={table} />
		</Card>
	);
};
export default TableExpandableApi;
