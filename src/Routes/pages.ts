import { TIcons } from '@/types/icons.type';

export type TPage = {
	id: string;
	to: string;
	text: string;
	icon: TIcons;
	subPages?: Record<string, TPage>;
	parentId?: string;
};
export type TPages = Record<string, TPage>;

const apps = {
	products: {
		id: 'products',
		to: '/products',
		text: 'Products - Mocks',
		icon: 'PackageOpen',
		subPages: {
			listmock: {
				id: 'listmock',
				to: '/products/listmock',
				text: 'List - Mocks',
				icon: 'PackageSearch',
			},
			list: {
				id: 'list',
				to: '/products/list',
				text: 'List - API FakeStore',
				icon: 'PackageSearch',
			},
			listnest: {
				id: 'listnest',
				to: '/products/listnest',
				text: 'List - NestJS',
				icon: 'PackageSearch',
			},
			create: {
				id: 'create',
				to: '/products/create',
				text: 'Create - FakeStore',
				icon: 'PlusSignCircle',
			},
			createnest: {
				id: 'createnest',
				to: '/products/createnest',
				text: 'Create - NestJS',
				icon: 'PlusSignCircle',
			},
			edit: {
				id: 'edit',
				to: '/products/edit',
				text: 'Edit - Mocks',
				icon: 'Edit02',
			},
			editapi: {
				id: 'editapi',
				to: '/products/editapi',
				text: 'Edit - API',
				icon: 'Edit02',
			},
			editapinest: {
				id: 'editapinest',
				to: '/products/editapinest',
				text: 'Edit - NESTJS',
				icon: 'Edit02',
			},
		},
	},
};
const search = {
	products: {
		id: 'products',
		to: '/products',
		text: 'Products',
		icon: 'PackageOpen',
		subPages: {
			listmock: {
				id: 'listmock',
				to: '/products/listmock',
				text: 'List - Mocks',
				icon: 'PackageSearch',
			},
			list: {
				id: 'list',
				to: '/products/list',
				text: 'List - API FakeStore',
				icon: 'PackageSearch',
			},
			listnest: {
				id: 'listnest',
				to: '/products/listnest',
				text: 'List - NestJS',
				icon: 'PackageSearch',
			},
			createnest: {
				id: 'createnest',
				to: '/products/createnest',
				text: 'Create - NestJS',
				icon: 'PlusSignCircle',
			},
			editapinest: {
				id: 'editapinest',
				to: '/products/editapinest',
				text: 'Edit - NESTJS',
				icon: 'Edit02',
			},
		},
	},
};
const pagesExamples: TPages = {
	login: {
		id: 'login',
		to: '/',
		text: 'Login',
		icon: 'Login03',
	},
	products: {
		id: 'products',
		to: '/products',
		text: 'Products',
		icon: 'PackageOpen',
	},
	notFound: {
		id: 'notFound',
		to: '/notFound',
		text: '404 Not Found',
		icon: 'HelpSquare',
	},
};

const pages = { apps, pagesExamples, search };
export default pages;
