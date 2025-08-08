import { IProduct } from '@/mocks/products';

const PRODUCTS_STORAGE_KEY = 'api-products';

export const loadProductsFromStorage = (): IProduct[] => {
	const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
	if (!stored) return [];
	try {
		return JSON.parse(stored);
	} catch {
		return [];
	}
};

export const saveProductsToStorage = (products: IProduct[]) => {
	localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
};
