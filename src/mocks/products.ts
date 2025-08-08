import { TIcons } from '@/types/icons.type';
import { TColors } from '@/types/colors.type';

// Interface para la API de FakeStore
export interface IBaseTags {
	id: number;
	name: string;
	icon?: TIcons;
	color?: TColors;
}
export interface ITags extends IBaseTags {
	description?: string;
}
export interface ICategory extends IBaseTags {
	description?: string;
}
export interface IFakeStoreProduct {
	id: number;
	title: string;
	price: number;
	description: string;
	category: string;
	image: string;
	rating: {
		rate: number;
		count: number;
	};
}

export interface IProduct {
	id: number;
	name: string;
	price: number;
	sku: string;
	stock: number;
	sold: number;
	category: ICategory[];
	tag: ITags[];
	store: string[];
	coupon?: string[];
	status: boolean;
	image: string;
	rating?: {
		rate: number;
		count: number;
	};
}

const mapFakeStoreToProduct = (fakeStoreProduct: IFakeStoreProduct): IProduct => {
	// Mapeo de categorías con colores
	const categoryColorMap: Record<string, TColors> = {
		"men's clothing": 'blue',
		"women's clothing": 'red',
		jewelery: 'amber',
		electronics: 'sky',
	};

	const generateSKU = (title: string, id: number): string => {
		const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').trim();
		const words = cleanTitle.split(' ').slice(0, 3);
		const acronym = words.map((word) => word.charAt(0).toUpperCase()).join('');
		return `${acronym}-${id.toString().padStart(3, '0')}`;
	};

	const generateStock = (): number => Math.floor(Math.random() * 500) + 50;

	// Mapear categoría a tu formato
	const mappedCategory = [
		{
			id: 1,
			name:
				fakeStoreProduct.category.charAt(0).toUpperCase() +
				fakeStoreProduct.category.slice(1),
			icon: getCategoryIcon(fakeStoreProduct.category),
			color: categoryColorMap[fakeStoreProduct.category] || 'zinc',
		},
	];

	// Generar tags basados en rating y precio
	const tags = [];
	if (fakeStoreProduct.rating.rate >= 4.0) {
		tags.push({
			id: 1,
			name: 'Top Rated',
			icon: 'Star',
			color: 'amber' as TColors,
			description: `${fakeStoreProduct.rating.rate}/5 stars`,
		});
	}
	if (fakeStoreProduct.price > 100) {
		tags.push({
			id: 2,
			name: 'Premium',
			icon: 'Crown',
			color: 'violet' as TColors,
		});
	}

	return {
		id: fakeStoreProduct.id,
		name: fakeStoreProduct.title,
		price: fakeStoreProduct.price,
		sku: generateSKU(fakeStoreProduct.title, fakeStoreProduct.id),
		stock: generateStock(),
		sold: fakeStoreProduct.rating.count,
		category: mappedCategory,
		tag: tags,
		store: ['FakeStore'],
		status: true,
		image: fakeStoreProduct.image,
		rating: fakeStoreProduct.rating,
	};
};

// Helper para obtener iconos según categoría
function getCategoryIcon(category: string): string {
	const iconMap: Record<string, string> = {
		"men's clothing": 'TShirt',
		"women's clothing": 'TShirt',
		jewelery: 'Gem',
		electronics: 'DeviceMobile',
	};
	return iconMap[category] || 'Package';
}
export default mapFakeStoreToProduct;
