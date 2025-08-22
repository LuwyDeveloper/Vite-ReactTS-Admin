// @start-snippet:: DataCategoriesSource
import { useEffect, useState } from 'react';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '@/components/ui/Card';
import Progress, { ProgressBar } from '@/components/ui/Progress';
import { TColors } from '@/types/colors.type';
import { useTranslation } from 'react-i18next';

type CategoryCount = {
	category: string;
	count: number;
};
type GenderCategory = 'men' | 'women' | 'kid';

type Product = {
	id: string;
	title: string;
	price: number;
	description: string;
	slug: string;
	stock: number;
	sizes: string[];
	gender: string;
	tags: string[];
	images: string[];
};
const CATEGORY_COLOR_MAP: Record<GenderCategory, TColors> = {
	men: 'blue',
	women: 'amber',
	kid: 'lime',
};

const DataCategories = () => {
	const [categoryData, setCategoryData] = useState<CategoryCount[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState<boolean>(true);
	const { t } = useTranslation('menu');

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const res = await fetch('https://nest-luwy-pack.onrender.com/api/products');
				const json = await res.json();
				const products: Product[] = json.products;

				const grouped = products.reduce((acc: Record<string, number>, product: Product) => {
					const gender = product.gender.toLowerCase();
					if (!gender) return acc;

					if (!acc[gender]) acc[gender] = 0;
					acc[gender]++;
					return acc;
				}, {});

				const entries: CategoryCount[] = Object.entries(grouped).map(([gender, count]) => ({
					category: gender,
					count: Number(count), // Por si acaso el count viene como string
				}));

				const total = entries.reduce((acc, item) => acc + item.count, 0);

				setCategoryData(entries);
				setTotalCount(total);
			} catch (error) {
				console.error('Error fetching product data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);
	if (loading) {
		return (
			<Card className='h-full'>
				<CardBody className='flex h-96 items-center justify-center'>
					<div className='flex flex-col items-center gap-4'>
						<p>{t('loading')}</p>
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
							icon: 'TrafficLight',
							color: 'amber',
							size: 'text-3xl',
						}}>
						{t('Product categories')} - NestJS
					</CardTitle>
				</CardHeaderChild>
			</CardHeader>
			<CardBody>
				<div className='grid grid-cols-12 gap-4'>
					<div className='col-span-12'>
						<Progress className='gap-1'>
							{categoryData.map((item) => {
								const percent =
									totalCount > 0 ? (item.count / totalCount) * 100 : 0;
								const color =
									CATEGORY_COLOR_MAP[item.category as GenderCategory] || 'gray';
								return (
									<ProgressBar
										key={item.category}
										value={percent}
										color={color as TColors}
									/>
								);
							})}
						</Progress>
					</div>
					{categoryData.map((item) => {
						const color = CATEGORY_COLOR_MAP[item.category as GenderCategory] || 'gray';
						const formattedCount = Intl.NumberFormat().format(item.count);
						const categoryLabel =
							item.category.charAt(0).toUpperCase() + item.category.slice(1);

						return (
							<div
								key={item.category}
								className='col-span-12 flex items-center gap-4'>
								<div className='flex grow items-center gap-2'>
									<div className={`size-4 rounded-full bg-${color}-500`}></div>
									<div>{categoryLabel}</div>
								</div>
								<div className='font-mono text-zinc-500'>{formattedCount}</div>
							</div>
						);
					})}
				</div>
			</CardBody>
		</Card>
	);
};

export default DataCategories;
// @end-snippet:: DataCategoriesSource
