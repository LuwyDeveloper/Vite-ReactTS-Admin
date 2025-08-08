import { IProduct } from '@/mocks/products.mock';

const LOCAL_STORAGE_KEY = 'app_products';

export const loadProductsFromStorage = (): IProduct[] => {
	const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
	if (!raw) return [];
	try {
		return JSON.parse(raw) as IProduct[];
	} catch {
		return [];
	}
};

export const saveProductsToStorage = (products: IProduct[]) => {
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
};
