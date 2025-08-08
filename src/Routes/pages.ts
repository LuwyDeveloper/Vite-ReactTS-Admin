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
	sales: {
		id: 'sales',
		to: '/sales',
		text: 'Sales',
		icon: 'Store04',
		subPages: {
			list: {
				id: 'list',
				to: '/sales/list',
				text: 'List',
				icon: 'ProductLoading',
			},
			view: {
				id: 'view',
				to: '/sales/view',
				text: 'View',
				icon: 'DeliveryView01',
			},
		},
	},
	customer: {
		id: 'customer',
		to: '/customer',
		text: 'Customer',
		icon: 'UserMultiple',
		subPages: {
			list: {
				id: 'list',
				to: '/customer/list',
				text: 'List',
				icon: 'UserList',
			},
			edit: {
				id: 'edit',
				to: '/customer/edit',
				text: 'Edit',
				icon: 'EditUser02',
			},
			view: {
				id: 'view',
				to: '/customer/view',
				text: 'View',
				icon: 'UserAccount',
			},
		},
	},
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
				text: 'List - API',
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
				text: 'Create',
				icon: 'PlusSignCircle',
			},
			edit: {
				id: 'edit',
				to: '/products/edit',
				text: 'Edit',
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
	projects: {
		id: 'projects',
		to: '/projects',
		text: 'Projects',
		icon: 'DashboardSquare03',
		subPages: {
			board: {
				id: 'board',
				to: '/projects/board',
				text: 'Board',
				icon: 'DashboardSquareSetting',
			},
			list: {
				id: 'list',
				to: '/projects/list',
				text: 'List',
				icon: 'ListView',
			},
			grid: {
				id: 'grid',
				to: '/projects/grid',
				text: 'Grid',
				icon: 'GridView',
			},
		},
	},
	invoices: {
		id: 'invoices',
		to: '/invoices',
		text: 'Invoices',
		icon: 'Invoice03',
		subPages: {
			list: {
				id: 'list',
				to: '/invoices/list',
				text: 'List',
				icon: 'Invoice02',
			},
			view: {
				id: 'view',
				to: '/invoices/view',
				text: 'View',
				icon: 'Invoice04',
			},
		},
	},
	mail: {
		id: 'mail',
		to: '/mail',
		text: 'Mail',
		icon: 'Mail01',
		subPages: {
			inbox: {
				id: 'inbox',
				to: '/mail/inbox',
				text: 'Inbox',
				icon: 'MailOpen01',
			},
			new: {
				id: 'new',
				to: '/mail/new',
				text: 'New',
				icon: 'MailEdit02',
			},
		},
	},
	chat: {
		id: 'chat',
		to: '/chat',
		text: 'Chat',
		icon: 'Message02',
	},
};
const pagesExamples: TPages = {
	list: {
		id: 'list',
		to: '/list',
		text: 'Lists',
		icon: 'LeftToRightListBullet',
		subPages: {
			example1: {
				id: 'example1',
				to: apps.products.subPages.list.to,
				text: 'Example 1',
				icon: 'LeftToRightListBullet',
			},
			example2: {
				id: 'example1',
				to: apps.sales.subPages.view.to,
				text: 'Example 2',
				icon: 'LeftToRightListBullet',
			},
		},
	},
	grid: {
		id: 'grid',
		to: '/grid',
		text: 'Grids',
		icon: 'GridView',
		subPages: {
			example1: {
				id: 'example1',
				to: apps.projects.subPages.grid.to,
				text: 'Example 1',
				icon: 'GridView',
			},
		},
	},
	edit: {
		id: 'edit',
		to: '/edit',
		text: 'Edit',
		icon: 'PencilEdit02',
		subPages: {
			example1: {
				id: 'example1',
				to: apps.customer.subPages.edit.to,
				text: 'Example 1',
				icon: 'PencilEdit02',
			},
			example2: {
				id: 'example1',
				to: apps.products.subPages.edit.to,
				text: 'Example 2',
				icon: 'PencilEdit02',
			},
		},
	},
	login: {
		id: 'login',
		to: '/login',
		text: 'Login',
		icon: 'Login03',
	},
	signup: {
		id: 'signup',
		to: '/signup',
		text: 'Signup',
		icon: 'AddTeam',
	},
	notFound: {
		id: 'notFound',
		to: '/notFound',
		text: '404 Not Found',
		icon: 'HelpSquare',
	},
	underConstruction: {
		id: 'underConstruction',
		to: '/under-construction',
		text: 'Under Construction',
		icon: 'DashboardBrowsing',
	},
};

const pages = { apps, pagesExamples };
export default pages;
