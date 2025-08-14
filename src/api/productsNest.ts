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
	tags: string[];
	store: string[];
	status: boolean;
	images?: string[];
}
function getGenderIcon(gender: string): TIcons {
	const iconMap: Record<string, string> = {
		men: 'TShirt',
		women: 'Gem',
		kid: 'DeviceMobile',
	};
	return iconMap[gender] || 'Package';
}
const BASE_API_URL = 'https://nest-luwy-pack.onrender.com/api';
const BASE_PRODUCT_URL = `${BASE_API_URL}/products`;
const BASE_IMAGE_URL = `${BASE_API_URL}/files/product`;

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

	return {
		id: apiProduct.id,
		name: apiProduct.title,
		price: apiProduct.price,
		description: apiProduct.description,
		stock: apiProduct.stock,
		sold: Math.floor(Math.random() * 100),
		sizes: mappedSizes,
		tags: apiProduct.tags,
		gender: mappedGender,
		store: ['NestAPI'],
		status: apiProduct.stock > 0,
		images: apiProduct.images.map((img) => `${BASE_IMAGE_URL}/${img}`),
	};
};
const mapProductToApiTable = (product: IProduct): Partial<IApiProduct> => ({
	title: product.name,
	price: product.price,
	stock: product.stock,
});

const fetchProducts = async (): Promise<IProduct[]> => {
	try {
		const response = await fetch(`${BASE_PRODUCT_URL}`);
		if (!response.ok) throw new Error(`Error: ${response.status}`);

		const json = await response.json();
		const apiProducts: IApiProduct[] = json.products;

		return apiProducts.map((p, i) => mapApiProductToProduct(p, i));
	} catch (err) {
		console.error('Error fetching products:', err);
		throw err;
	}
};
const generateSlug = (name: string): string => name.trim().toLowerCase().replace(/\s+/g, '-');

// NESTJS EDIT PAGE
const mapProductToApiPayload = (product: IProduct): Partial<IApiProduct> => ({
	title: product.name,
	price: product.price,
	description: product.description,
	slug: generateSlug(product.name),
	stock: product.stock,
	sizes: product.sizes.map((s) => s.name),
	gender: product.gender[0]?.name.toLowerCase() ?? '',
	tags: product.tags,
	images: product.images ?? [],
});

const updateProductNest = async (product: IProduct, token: string) => {
	const body = mapProductToApiPayload(product);

	const response = await fetch(`${BASE_PRODUCT_URL}/${product.id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		throw new Error(`Error al actualizar el producto: ${response.status}`);
	}

	return await response.json(); // puedes retornar el producto actualizado si quieres
};
//eliminar producto
const deleteProductNest = async (product: IProduct, token: string) => {
	const response = await fetch(`${BASE_PRODUCT_URL}/${product.id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Error al eliminar el producto: ${response.status}`);
	}

	return await response.json(); // puedes retornar el producto actualizado si quieres
};

export {
	mapApiProductToProduct,
	mapProductToApiPayload,
	mapProductToApiTable,
	fetchProducts,
	updateProductNest,
	deleteProductNest,
	generateSlug,
};
