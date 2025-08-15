import * as Yup from 'yup';
import Container from '@/components/layout/Container';
import { useOutletContext, useNavigate } from 'react-router';
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
import Checkbox from '@/components/form/Checkbox';
import { useAuth } from '@/context/authContext';
import { IProduct, IGender, ISizes, createProductNest } from '@/api/productsNest';

const ProductsCreateNestPage = () => {
	const { tokenStorage } = useAuth();
	const allGenderOptions: IGender[] = [
		{ id: '1', name: 'men' },
		{ id: '2', name: 'women' },
		{ id: '3', name: 'kid' },
		{ id: '4', name: 'unisex' },
	];
	const allSizesOptions: IGender[] = [
		{ id: '1', name: 'XS' },
		{ id: '2', name: 'S' },
		{ id: '3', name: 'M' },
		{ id: '4', name: 'L' },
		{ id: '5', name: 'XL' },
		{ id: '6', name: 'XXL' },
	];
	const allTagsOptions = ['shirt', 'pants', 'shoes', 'accessories', 'jacket'];

	const validationSchema = Yup.object({
		name: Yup.string()
			.min(3, 'El nombre debe tener al menos 3 caracteres')
			.required('El nombre es obligatorio'),
		price: Yup.number()
			.typeError('El precio debe ser un número')
			.positive('El precio debe ser mayor a 0')
			.required('El precio es obligatorio'),
		stock: Yup.number()
			.typeError('Stock debe ser un número')
			.integer('Stock debe ser un número entero')
			.min(0, 'Stock no puede ser negativo')
			.required('El stock es obligatorio'),
		gender: Yup.string().required('Debe seleccionar una categoría'),
		sizes: Yup.array().min(1, 'Debe seleccionar al menos un tamaño'),
		tags: Yup.array().min(1, 'Debe seleccionar al menos una etiqueta'),
	});
	const formik = useFormik({
		initialValues: {
			name: '',
			stock: 0,
			description: '',
			price: 0,
			gender: '',
			sizes: [],
			tags: [],
			publish: false,
			image: [],
		},
		enableReinitialize: true,
		validationSchema,
		onSubmit: async (values) => {
			const createdProduct: IProduct = {
				id: Date.now().toString(),
				name: values.name,
				price: values.price,
				description: values.description,
				stock: values.stock,
				sold: 0,
				status: values.publish,
				gender: [allGenderOptions.find((g) => g.name === values.gender)].filter(
					Boolean,
				) as IGender[],
				sizes: values.sizes
					.map((name) => allSizesOptions.find((s) => s.name === name))
					.filter(Boolean) as ISizes[],
				tags: values.tags,
				store: ['NestAPI'],
				images: values.image || [],
			};

			try {
				if (!tokenStorage) {
					alert('No hay token disponible');
					return;
				}

				// console.log(mapCreateProductToApi(createdProduct));
				await createProductNest(createdProduct, tokenStorage);
				alert('Producto Creado con éxito');
				navigate(pages.apps.products.subPages.listnest.to);
			} catch (err) {
				console.error('Error al crear producto:', err);
				alert('Error al guardar el producto en el servidor');
			}
		},
	});

	const navigate = useNavigate();

	const { setHeaderLeft } = useOutletContext<OutletContextType>();
	useEffect(() => {
		setHeaderLeft(
			<Breadcrumb
				list={[
					{ ...pages.apps.products },
					{ ...pages.apps.products.subPages.listnest },
					{
						text: 'Crear nuevo producto',
					},
				]}
			/>,
		);
		return () => {
			setHeaderLeft(undefined);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [quickActions, setQuickActions] = useState<boolean>(true);

	return (
		<>
			<Subheader>
				<SubheaderLeft>
					Product
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
						Save
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
											Producto Nuevo
										</CardTitle>
									</CardHeaderChild>
								</CardHeader>
								<CardBody>
									<div className='grid grid-cols-12 gap-4'>
										<div className='col-span-12'>
											<div className='mb-2 flex items-center justify-between [&>*]:mb-0'>
												<Label htmlFor='name'>Name</Label>
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
											<Label htmlFor='stock'>Stock</Label>
											<Input
												name='stock'
												id='stock'
												value={formik.values.stock}
												onChange={formik.handleChange}
												step='1'
												type='number'
												placeholder='0'
											/>
											{formik.touched.stock && formik.errors.stock && (
												<p className='text-sm text-red-500'>
													{formik.errors.stock}
												</p>
											)}
										</div>

										<div className='col-span-12'>
											<Label htmlFor='description'>Description</Label>
											<Textarea
												name='description'
												id='description'
												placeholder='Product description'
												value={formik.values.description}
												onChange={formik.handleChange}
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
										{formik.values.image?.map((img, i) => (
											<div className='relative w-48 shrink-0' key={i}>
												<img
													src={img}
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
													onClick={() => {
														formik.setFieldValue(
															'image',
															formik.values.image.filter(
																(_, idx) => idx !== i,
															),
														);
													}}
												/>
											</div>
										))}
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
													<Input
														id='file-upload'
														name='file-upload'
														type='file'
														className='sr-only'
														accept='image/*'
														multiple
														onChange={(e) => {
															const files = e.target.files;
															if (!files || files.length === 0)
																return;

															// Crear URLs temporales de las imágenes subidas
															const urls = Array.from(files).map(
																(file) => URL.createObjectURL(file),
															);

															// Actualizar el estado de Formik con las nuevas imágenes
															formik.setFieldValue('image', [
																...formik.values.image,
																...urls,
															]);
														}}
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
											Precio
										</CardTitle>
									</CardHeaderChild>
								</CardHeader>
								<CardBody>
									<div className='grid grid-cols-1 gap-4'>
										<div className='col-span-1'>
											<Label htmlFor='price'>Price</Label>
											<FieldWrap lastSuffix='USD'>
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
											<Label htmlFor='publish'>Publish</Label>
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
											Categorías
										</CardTitle>
									</CardHeaderChild>
								</CardHeader>
								<CardBody>
									<div className='grid grid-cols-1 gap-4'>
										<div className='col-span-1'>
											<Label htmlFor='gender'>Gender</Label>
											<Select
												name='gender'
												value={formik.values.gender}
												onChange={formik.handleChange}>
												{allGenderOptions.map((gender) => (
													<option key={gender.name} value={gender.name}>
														{gender.name}
													</option>
												))}
											</Select>
											{formik.touched.gender && formik.errors.gender && (
												<p className='text-sm text-red-500'>
													{formik.errors.gender}
												</p>
											)}
										</div>
										<div className='col-span-1'>
											<Label htmlFor='sizes'>Sizes</Label>
											<Select
												multiple
												name='sizes'
												value={formik.values.sizes}
												onChange={formik.handleChange}>
												{allSizesOptions.map((size) => (
													<option key={size.name} value={size.name}>
														{size.name}
													</option>
												))}
											</Select>
											{formik.touched.sizes && formik.errors.sizes && (
												<p className='text-sm text-red-500'>
													{formik.errors.sizes}
												</p>
											)}
										</div>
										<div className='col-span-1'>
											<Label htmlFor='tags'>Tag</Label>
											<Select
												multiple
												name='tags'
												value={formik.values.tags}
												onChange={formik.handleChange}>
												{allTagsOptions.map((tag) => (
													<option key={tag} value={tag}>
														{tag}
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
							{ 'max-w-45': quickActions, 'max-w-14': !quickActions },
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
										onClick={() =>
											navigate(pages.apps.products.subPages.listnest.to)
										}>
										Cancel
									</Button>
									<div className='h-8 rounded-full border-s border-zinc-500/25'></div>
									<Button
										aria-label='Save'
										className='p-0!'
										type='submit'
										form='edit-product-form'>
										Save
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

export default ProductsCreateNestPage;
