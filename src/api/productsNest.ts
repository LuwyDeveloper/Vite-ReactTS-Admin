import { TIcons } from '@/types/icons.type';
import { TColors } from '@/types/colors.type';

// Interface para la API de NestJS
export interface IBaseTags {
	id: string;
	name: string;
	icon: TIcons;
	color: TColors;
}
export interface ISizes extends IBaseTags {
	description?: string;
}
export interface IGender extends IBaseTags {
	description?: string;
}
export interface IApiProduct {
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
}

export interface IProduct {
	id: string;
	name: string;
	price: number;
	description: string;
	stock: number;
	sold: number;
	sizes: ISizes[];
	gender: IGender[];
	store: string[];
	status: boolean;
	images?: string[];
}
function getGenderIcon(gender: string): string {
	const iconMap: Record<string, string> = {
		men: 'TShirt',
		women: 'Gem',
		kid: 'DeviceMobile',
	};
	return iconMap[gender] || 'Package';
}

const mapApiProductToProduct = (apiProduct: IApiProduct, index: number): IProduct => {
	const genderColorMap: Record<string, TColors> = {
		men: 'blue',
		women: 'amber',
		kid: 'lime',
	};

	const mappedGender: IGender[] = [
		{
			id: index.toString(),
			name: apiProduct.gender.charAt(0).toUpperCase() + apiProduct.gender.slice(1),
			icon: getGenderIcon(apiProduct.gender),
			color: genderColorMap[apiProduct.gender] || 'zinc',
		},
	];

	const mappedSizes: ISizes[] = apiProduct.sizes.map((size: string, idx: number) => ({
		id: idx.toString(),
		name: size,
		icon: 'Tag',
		color: 'sky',
		description: `Size option: ${size}`,
	}));

	const baseImageUrl = 'https://nest-luwy-pack.onrender.com/api/files/product/';

	return {
		id: apiProduct.id,
		name: apiProduct.title,
		price: apiProduct.price,
		description: apiProduct.description,
		stock: apiProduct.stock,
		sold: Math.floor(Math.random() * 100),
		sizes: mappedSizes,
		gender: mappedGender,
		store: ['NestAPI'],
		status: apiProduct.stock > 0,
		images: apiProduct.images.map((img) => `${baseImageUrl}${img}`),
	};
};

export default mapApiProductToProduct;
