import * as Yup from 'yup';
import Container from '@/components/layout/Container';
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
import Checkbox from '@/components/form/Checkbox';
import { useAuth } from '@/context/authContext';
import {
	IProduct,
	IGender,
	ISizes,
	fetchProductById,
	updateProductNest,
	deleteProductNest,
} from '@/api/productsNest';
import { useTranslation } from 'react-i18next';

const ProductsEditNestPage = () => {
	const [searchParams] = useSearchParams();
	const { tokenStorage } = useAuth();
	const productIdFromUrl = searchParams.get('productId');
	const [product, setProduct] = useState<IProduct | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const { t } = useTranslation(['menu']);

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			try {
				if (!productIdFromUrl) {
					throw new Error('No se proporcionó ID del producto');
				}
				const singleProduct = await fetchProductById(productIdFromUrl);
				setProduct(singleProduct);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error desconocido');
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, [productIdFromUrl]);

	const allGenderObjects = product ? product.gender : [];
	const allSizesObjects = product ? product.sizes : [];
	const allTagsObjects = product ? product.tags : [];

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
			name: product?.name || '',
			stock: product?.stock || 0,
			description: product?.description || '',
			price: product?.price || 0,
			gender: product?.gender[0]?.name || '',
			sizes: product?.sizes.map((size) => size.name) || [],
			tags: product?.tags || [],
			publish: product?.status || false,
			image: product?.images || [],
		},
		enableReinitialize: true,
		validationSchema,
		onSubmit: async (values) => {
			const updatedProduct: IProduct = {
				id: product?.id ?? Date.now().toString(),
				name: values.name,
				price: values.price,
				description: values.description,
				stock: values.stock,
				sold: product?.sold || 0,
				status: values.publish,
				gender: [allGenderObjects.find((g) => g.name === values.gender)].filter(
					Boolean,
				) as IGender[],
				sizes: values.sizes
					.map((name) => allSizesObjects.find((s) => s.name === name))
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
				await updateProductNest(updatedProduct, tokenStorage);
				alert('Producto actualizado con éxito');
				navigate(pages.apps.products.subPages.listnest.to);
			} catch (err) {
				console.error('Error al actualizar producto:', err);
				alert('Error al guardar el producto en el servidor');
			}
		},
	});

	const navigate = useNavigate();
	const handleDelete = async () => {
		if (!product || !tokenStorage) return;

		const confirmed = confirm(`¿Estás seguro de eliminar el producto "${product.name}"?`);
		if (!confirmed) return;

		try {
			await deleteProductNest(product, tokenStorage);
			alert('Producto eliminado con éxito');
			navigate(pages.apps.products.subPages.listnest.to);
		} catch (err) {
			console.error('Error al eliminar producto:', err);
			alert('Error al eliminar el producto');
		}
	};

	const { setHeaderLeft } = useOutletContext<OutletContextType>();
	useEffect(() => {
		setHeaderLeft(
			<Breadcrumb
				list={[
					{ ...pages.apps.products },
					{ ...pages.apps.products.subPages.listnest },
					...(productIdFromUrl
						? [
								{
									...pages.apps.products.subPages.editapinest,
									to: undefined,
									text: product ? product.name : 'Loading...',
								},
							]
						: []),
				]}
			/>,
		);
		return () => {
			setHeaderLeft(undefined);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productIdFromUrl, product]);

	const [quickActions, setQuickActions] = useState<boolean>(true);
	// capturar las categorías únicas de los productos
	if (loading && !product) {
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
							{t('Product')}
						</CardTitle>
					</CardHeaderChild>
				</CardHeader>
				<CardBody className='flex h-96 items-center justify-center'>
					<div className='flex flex-col items-center gap-4'>
						<Icon icon='Loading' className='animate-spin text-4xl' />
						<p>{t('loadingProducts')}</p>
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
							{t('Product')}
						</CardTitle>
					</CardHeaderChild>
				</CardHeader>
				<CardBody className='flex h-96 items-center justify-center'>
					<div className='flex flex-col items-center gap-4'>
						<Icon icon='AlertTriangle' className='text-4xl text-red-500' />
						<p className='text-red-500'>Error: {error}</p>
						<Button variant='outline' onClick={() => window.location.reload()}>
							{t('Retry')}
						</Button>
					</div>
				</CardBody>
			</Card>
		);
	}
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
											{t('Product')} - {formik.values.name}
										</CardTitle>
									</CardHeaderChild>
								</CardHeader>
								<CardBody>
									<div className='grid grid-cols-12 gap-4'>
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
											<Label htmlFor='stock'>{t('Stock')}</Label>
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
											<Label htmlFor='description'>{t('Description')}</Label>
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
											<Label htmlFor='gender'>{t('Gender')}</Label>
											<Select
												name='gender'
												id='gender'
												value={formik.values.gender}
												onChange={formik.handleChange}>
												{allGenderObjects.map((gender) => (
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
											<Label htmlFor='sizes'>{t('Sizes')}</Label>
											<Select
												multiple
												name='sizes'
												id='sizes'
												value={formik.values.sizes}
												onChange={formik.handleChange}>
												{allSizesObjects.map((size) => (
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
											<Label htmlFor='tags'>{t('Tag')}</Label>
											<Select
												multiple
												name='tags'
												id='tags'
												value={formik.values.tags}
												onChange={formik.handleChange}>
												{allTagsObjects.map((tags) => (
													<option key={tags} value={tags}>
														{tags}
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
							'sticky start-0 end-0 bottom-4 z-[999] mx-auto mt-4 flex min-h-12 items-center justify-between overflow-hidden rounded-full border border-zinc-500/25 bg-white p-2 font-bold shadow dark:bg-zinc-950',
							'transition-all duration-300 ease-in-out',
							{ 'max-w-96': quickActions, 'max-w-14': !quickActions },
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
								<div className='flex items-center ps-2'>
									{product && (
										<Button
											aria-label='Delete'
											color='red'
											className='p-0!'
											onClick={handleDelete}>
											{t('Delete')}
										</Button>
									)}
								</div>
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

export default ProductsEditNestPage;
