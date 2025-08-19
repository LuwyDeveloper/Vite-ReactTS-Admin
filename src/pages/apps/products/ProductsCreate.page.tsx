import Container from '@/components/layout/Container';
import * as Yup from 'yup';
import { useOutletContext, useSearchParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Breadcrumb from '@/components/layout/Breadcrumb';
import pages from '@/Routes/pages';
import { OutletContextType } from '@/pages/apps/products/_layouts/Products.layout';
import Subheader, { SubheaderLeft, SubheaderRight } from '@/components/layout/Subheader';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '@/components/ui/Card';
import Label from '@/components/form/Label';
import Icon from '@/components/icon/Icon';
import Input from '@/components/form/Input';
import Description from '@/components/form/Description';
import Button from '@/components/ui/Button';
import classNames from 'classnames';
import FieldWrap from '@/components/form/FieldWrap';
import Select from '@/components/form/Select';
import Tooltip from '@/components/ui/Tooltip';
import Textarea from '@/components/form/Textarea';
import { Airpods1, Airpods2, Airpods3, Airpods4, Airpods5 } from '@/assets/images';
import Checkbox from '@/components/form/Checkbox';
import { IProduct, ICategory, ITags } from '@/mocks/products';
import { loadProductsFromStorage, saveProductsToStorage } from '@/context/ProductsApiContext';
import { useTranslation } from 'react-i18next';

const ProductsCreateApiPage = () => {
	const [searchParams] = useSearchParams();
	const productIdFromUrl = Number(searchParams.get('productId'));
	const [products, setProducts] = useState<IProduct[]>([]);
	const { t } = useTranslation(['menu']);

	useEffect(() => {
		const storedProducts = loadProductsFromStorage();
		setProducts(storedProducts || []);
	}, []);

	const allCategoryObjects = Array.from(
		new Map(products.flatMap((p) => p.category).map((cat) => [cat.name, cat])).values(),
	);
	const allTagObjects = Array.from(
		new Map(products.flatMap((p) => p.tag).map((tag) => [tag.name, tag])).values(),
	);
	const validationSchema = Yup.object({
		name: Yup.string()
			.min(3, 'El nombre debe tener al menos 3 caracteres')
			.required('El nombre es obligatorio'),
		sku: Yup.string().required('El SKU es obligatorio'),
		stock: Yup.number()
			.typeError('Stock debe ser un número')
			.integer('Stock debe ser un número entero')
			.min(0, 'Stock no puede ser negativo')
			.required('El stock es obligatorio'),
		price: Yup.number()
			.typeError('El precio debe ser un número')
			.positive('El precio debe ser mayor a 0')
			.required('El precio es obligatorio'),
		categories: Yup.array().min(1, 'Debe seleccionar al menos una categoría'),
		tags: Yup.array().min(1, 'Debe seleccionar al menos una etiqueta'),
	});
	const formik = useFormik({
		initialValues: {
			avatar: '',
			name: '',
			sku: '',
			stock: '',
			description: '',
			variants: [{ attribute: '', value: '', price: '', quantity: '' }],
			price: '',
			currency: 'USD',
			publish: true,
			categories: [],
			tags: [],
		},
		validationSchema,
		onSubmit: (values) => {
			const newProduct: IProduct = {
				id: Date.now(),
				name: values.name,
				price: parseFloat(values.price),
				sku: values.sku,
				stock:
					typeof values.stock === 'string' ? parseInt(values.stock) || 0 : values.stock,
				sold: Math.floor(Math.random() * 1000),
				category: values.categories
					.map((name) => allCategoryObjects.find((c) => c.name === name))
					.filter(Boolean) as ICategory[],
				tag: values.tags
					.map((name) => allTagObjects.find((t) => t.name === name))
					.filter(Boolean) as ITags[],
				store: [],
				coupon: [],
				status: values.publish,
				image: values.avatar || '',
			};

			console.log('✅ Nuevo producto creado:', newProduct);
			const updatedProducts = [...products, newProduct];
			setProducts(updatedProducts);
			saveProductsToStorage(updatedProducts);
			alert('✅ Producto creado exitosamente');
			navigate(pages.apps.products.subPages.list.to);
		},
	});

	const navigate = useNavigate();

	const { setHeaderLeft } = useOutletContext<OutletContextType>();
	useEffect(() => {
		setHeaderLeft(
			<Breadcrumb
				list={[
					{ ...pages.apps.products },
					{
						...pages.apps.products.subPages.editapi,
						text: 'Nuevo producto',
						to: undefined,
					},
				]}
			/>,
		);
		return () => {
			setHeaderLeft(undefined);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productIdFromUrl]);

	const [quickActions, setQuickActions] = useState<boolean>(true);
	// capturar las categorías únicas de los productos

	return (
		<>
			<Subheader>
				<SubheaderLeft>
					{t('Product')}
					<Button
						aria-label='Prev'
						className='p-0! font-bold'
						icon='ArrowLeft01'
						color='zinc'
						onClick={() => navigate(-1)}>
						Prev
					</Button>
				</SubheaderLeft>
				<SubheaderRight>
					<Button
						aria-label='Save'
						className='p-0! font-bold'
						type='submit'
						form='edit-product-form'>
						{t('Save')}
					</Button>
				</SubheaderRight>
			</Subheader>
			<Container className='relative'>
				<form id='edit-product-form' onSubmit={formik.handleSubmit}>
					<div className='grid grid-cols-12 gap-4'>
						<div className='col-span-12 flex flex-col gap-4 lg:col-span-8'>
							<Card>
								<CardHeader>
									<CardHeaderChild>
										<CardTitle
											iconProps={{
												icon: 'FileView',
												color: 'blue',
												size: 'text-3xl',
											}}>
											{t('New Product')}
										</CardTitle>
									</CardHeaderChild>
								</CardHeader>
								<CardBody>
									<div className='grid grid-cols-12 gap-4'>
										<div className='col-span-12'>
											<Label htmlFor='avatar'>Avatar</Label>
											<div className='flex items-center gap-4'>
												<div className='flex size-24 items-center justify-center rounded-full border border-dashed border-zinc-500/50'>
													<Icon
														icon='Image01'
														size='text-2xl'
														color='zinc'
													/>
												</div>
												<div>
													<Input
														name='avatar'
														type='file'
														onChange={formik.handleChange}
													/>
													<Description
														id='input-helper-text'
														className='mt-2'>
														Pick a photo up to 1MB.
													</Description>
												</div>
											</div>
										</div>
										<div className='col-span-12'>
											<div className='mb-2 flex items-center justify-between [&>*]:mb-0'>
												<Label htmlFor='name'>{t('Name')}</Label>
												<Description id='name'>
													<Tooltip text='Give your product a short and clear' />
												</Description>
											</div>
											<Input
												name='name'
												id='name'
												aria-describedby='name'
												placeholder='Name'
												value={formik.values.name}
												onChange={formik.handleChange}
											/>
											{formik.touched.name && formik.errors.name && (
												<p className='text-sm text-red-500'>
													{formik.errors.name}
												</p>
											)}
										</div>
										<div className='col-span-12 md:col-span-6'>
											<Label htmlFor='sku'>SKU</Label>
											<Input
												name='sku'
												id='sku'
												value={formik.values.sku}
												onChange={formik.handleChange}
											/>
											{formik.touched.sku && formik.errors.sku && (
												<p className='text-sm text-red-500'>
													{formik.errors.sku}
												</p>
											)}
										</div>
										<div className='col-span-12 md:col-span-6'>
											<Label htmlFor='stock'>{t('Stock')}</Label>
											<Input
												name='stock'
												id='stock'
												value={formik.values.stock}
												onChange={formik.handleChange}
											/>
											{formik.touched.stock && formik.errors.stock && (
												<p className='text-sm text-red-500'>
													{formik.errors.stock}
												</p>
											)}
										</div>

										<div className='col-span-12'>
											<Label htmlFor='description'>{t('Description')}</Label>
											<Textarea
												name='description'
												id='description'
												placeholder='Product description'
											/>
										</div>
									</div>
								</CardBody>
							</Card>
							<Card>
								<CardHeader>
									<CardHeaderChild>
										<CardTitle
											iconProps={{
												icon: 'ImageAdd02',
												color: 'amber',
												size: 'text-3xl',
											}}>
											Media
										</CardTitle>
									</CardHeaderChild>
									<CardHeaderChild>
										<Button
											aria-label='Upload from URL'
											icon='CloudServer'
											variant='outline'
											color='zinc'>
											Upload from URL
										</Button>
									</CardHeaderChild>
								</CardHeader>
								<CardBody>
									<div className='mb-4 flex gap-4 overflow-x-auto whitespace-nowrap'>
										<div className='relative w-48 shrink-0'>
											<img
												src={Airpods1}
												alt=''
												className='aspect-square w-full rounded-xl object-cover'
											/>
											<Button
												aria-label='Cancel'
												icon='Cancel01'
												variant='soft'
												color='zinc'
												rounded='rounded-full'
												className='absolute end-4 top-4 z-10'
											/>
										</div>
										<div className='relative w-48 shrink-0'>
											<img
												src={Airpods2}
												alt=''
												className='aspect-square w-full rounded-xl object-cover'
											/>
											<Button
												aria-label='Cancel'
												icon='Cancel01'
												variant='soft'
												color='zinc'
												rounded='rounded-full'
												className='absolute end-4 top-4 z-10'
											/>
										</div>
										<div className='relative w-48 shrink-0'>
											<img
												src={Airpods3}
												alt=''
												className='aspect-square w-full rounded-xl object-cover'
											/>
											<Button
												aria-label='Cancel'
												icon='Cancel01'
												variant='soft'
												color='zinc'
												rounded='rounded-full'
												className='absolute end-4 top-4 z-10'
											/>
										</div>
										<div className='relative w-48 shrink-0'>
											<img
												src={Airpods4}
												alt=''
												className='aspect-square w-full rounded-xl object-cover'
											/>
											<Button
												aria-label='Cancel'
												icon='Cancel01'
												variant='soft'
												color='zinc'
												rounded='rounded-full'
												className='absolute end-4 top-4 z-10'
											/>
										</div>
										<div className='relative w-48 shrink-0'>
											<img
												src={Airpods5}
												alt=''
												className='aspect-square w-full rounded-xl object-cover'
											/>
											<Button
												aria-label='Cancel'
												icon='Cancel01'
												variant='soft'
												color='zinc'
												rounded='rounded-full'
												className='absolute end-4 top-4 z-10'
											/>
										</div>
									</div>
									<div
										className={classNames(
											'flex justify-center',
											'rounded-lg',
											'border-2 border-dashed border-zinc-500/25',
											'px-6 py-10',
											'dark:border-zinc-500/50',
										)}>
										<div className='text-center'>
											<Icon
												icon='Album02'
												color='zinc'
												className='mx-auto h-12 w-12'
											/>
											<div className='mt-4 flex text-sm leading-6 text-zinc-500'>
												<label
													htmlFor='file-upload'
													className={classNames(
														'relative',
														'cursor-pointer',
														'rounded-md',
														'font-semibold',
														'text-blue-500',
														'focus-within:outline-hidden',
														'focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-transparent',
														'hover:text-blue-600',
													)}>
													<span>Upload a file</span>
													<input
														aria-label='File upload'
														id='file-upload'
														name='file-upload'
														type='file'
														className='sr-only'
													/>
												</label>
												<span className='pl-1'>or drag and drop</span>
											</div>
											<p className='text-xs leading-5 text-zinc-500'>
												PNG, JPG, GIF up to 10MB
											</p>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
						<div className='col-span-12 flex flex-col gap-4 lg:col-span-4'>
							<Card>
								<CardHeader>
									<CardHeaderChild>
										<CardTitle
											iconProps={{
												icon: 'Money04',
												color: 'emerald',
												size: 'text-3xl',
											}}>
											{t('Price')}
										</CardTitle>
									</CardHeaderChild>
								</CardHeader>
								<CardBody>
									<div className='grid grid-cols-1 gap-4'>
										<div className='col-span-1'>
											<Label htmlFor='price'>{t('Price')}</Label>
											<FieldWrap
												lastSuffix={
													<Select
														id='currency'
														name='currency'
														variant='underline'
														className='relative -end-3 w-full border-none pe-8'
														value={formik.values.currency}
														onChange={formik.handleChange}>
														<option value='USD'>USD</option>
														<option value='EUR'>EUR</option>
													</Select>
												}>
												<Input
													name='price'
													id='price'
													step='0.01'
													type='number'
													placeholder='0.00'
													value={formik.values.price}
													onChange={formik.handleChange}
												/>
											</FieldWrap>
											{formik.touched.price && formik.errors.price && (
												<p className='text-sm text-red-500'>
													{formik.errors.price}
												</p>
											)}
										</div>
										<div className='col-span-1'>
											<Label htmlFor='publish'>{t('Status')}</Label>
											<Checkbox
												name='publish'
												id='publish'
												variant='switch'
												onChange={formik.handleChange}
												checked={formik.values.publish}
											/>
										</div>
									</div>
								</CardBody>
							</Card>
							<Card>
								<CardHeader>
									<CardHeaderChild>
										<CardTitle
											iconProps={{
												icon: 'Database',
												color: 'red',
												size: 'text-3xl',
											}}>
											{t('Category')}
										</CardTitle>
									</CardHeaderChild>
								</CardHeader>
								<CardBody>
									<div className='grid grid-cols-1 gap-4'>
										<div className='col-span-1'>
											<Label htmlFor='categories'>{t('Categories')}</Label>
											<Select
												multiple
												name='categories'
												id='categories'
												value={formik.values.categories}
												onChange={formik.handleChange}>
												{allCategoryObjects.map((category) => (
													<option key={category.id} value={category.name}>
														{category.name}
													</option>
												))}
											</Select>
											{formik.touched.categories &&
												formik.errors.categories && (
													<p className='text-sm text-red-500'>
														{formik.errors.categories}
													</p>
												)}
										</div>
										<div className='col-span-1'>
											<Label htmlFor='categories'>{t('Tags')}</Label>
											<Select
												multiple
												name='tags'
												id='tags'
												value={formik.values.tags}
												onChange={formik.handleChange}>
												{allTagObjects.map((tag) => (
													<option key={tag.id} value={tag.name}>
														{tag.name}
													</option>
												))}
											</Select>
											{formik.touched.tags && formik.errors.tags && (
												<p className='text-sm text-red-500'>
													{formik.errors.tags}
												</p>
											)}
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
					</div>
					<div
						className={classNames(
							'sticky start-0 end-0 bottom-4 z-[999] mx-auto mt-4 flex min-h-12 items-center justify-center overflow-hidden rounded-full border border-zinc-500/25 bg-white px-3 py-2 font-bold shadow dark:bg-zinc-950',
							'transition-all duration-300 ease-in-out',
							{ 'max-w-60': quickActions, 'max-w-14': !quickActions },
						)}>
						{!quickActions && (
							<Button
								aria-label='Quick Actions'
								icon='Zap'
								variant='soft'
								color='emerald'
								rounded='rounded-full'
								onClick={() => setQuickActions(true)}
							/>
						)}
						{quickActions && (
							<>
								<div className='flex items-center gap-2'>
									<Button
										aria-label='Cancel'
										color='zinc'
										className='p-0!'
										onClick={() => navigate(-1)}>
										{t('Cancel')}
									</Button>
									<div className='h-8 rounded-full border-s border-zinc-500/25'></div>
									<Button
										aria-label='Save'
										className='p-0!'
										type='submit'
										form='edit-product-form'>
										{t('Save')}
									</Button>
									<Button
										aria-label='Cancel'
										icon='Cancel01'
										variant='soft'
										color='zinc'
										rounded='rounded-full'
										onClick={() => setQuickActions(false)}
									/>
								</div>
							</>
						)}
					</div>
				</form>
			</Container>
		</>
	);
};

export default ProductsCreateApiPage;
