import { Avatar1, Avatar2, Avatar3, Avatar4, Avatar5 } from '@/assets/images';
import { TColors } from '@/types/colors.type';

export interface IUserDataFromAPI {
	id: string;
	fullName: string;
	email: string;
	isActive: boolean;
	roles: string[];
}

export type TUser = {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	position: string;
	isActive: boolean;
	image: { org: string };
	socialAuth: {
		google: boolean;
		facebook: boolean;
		apple: boolean;
	};
	roles: string[];
	twoFactorAuth: boolean;
	phone: string;
	color: TColors;
};

type TUsers = {
	[key in 'johndoe' | 'aulisTiainen' | 'nicolasLefevre' | 'oliviaNovak' | 'luwyDyro']: TUser;
};

const USERS: TUsers = {
	luwyDyro: {
		id: 'b457f990-dc3a-4418-9d9f-279d7a2c063e',
		email: 'test1@google.com',
		username: 'test1@google.com',
		firstName: 'Luis',
		lastName: 'Huaman',
		password: 'Abc123',
		position: 'Web Developer',
		isActive: true,
		image: { org: Avatar1 as string },
		socialAuth: {
			google: true,
			facebook: false,
			apple: true,
		},
		roles: ['admin'],
		twoFactorAuth: true,
		phone: '+51 999 999 999',
		color: 'blue',
	},

	johndoe: {
		id: '5',
		username: 'johndoe',
		firstName: 'John',
		lastName: 'Doe',
		email: 'johndoe@site.com',
		password: '!123Asd',
		position: 'Web Developer',
		isActive: true,
		image: { org: Avatar4 as string },
		socialAuth: {
			google: true,
			facebook: false,
			apple: true,
		},
		roles: ['admin'],
		twoFactorAuth: true,
		phone: '+1 (555) 555-1234',
		color: 'blue',
	},
	aulisTiainen: {
		id: '2',
		username: 'aulisTiainen',
		firstName: 'Aulis',
		lastName: 'Tiainen',
		email: 'aulistiainen@site.com',
		password: '!123Asd',
		position: 'Web Developer',
		isActive: true,
		image: { org: Avatar5 as string },
		socialAuth: {
			google: true,
			facebook: false,
			apple: true,
		},
		roles: ['admin'],
		twoFactorAuth: true,
		phone: '+1 (555) 555-1234',
		color: 'amber',
	},
	nicolasLefevre: {
		id: '3',
		username: 'nicolaslefevre',
		firstName: 'Nicolas',
		lastName: 'Lefèvre',
		email: 'nicolaslefevre@site.com',
		password: '!123Asd',
		position: 'Web Developer',
		isActive: true,
		image: { org: Avatar2 as string },
		socialAuth: {
			google: true,
			facebook: false,
			apple: true,
		},
		roles: ['admin'],
		twoFactorAuth: true,
		phone: '+1 (555) 555-1234',
		color: 'emerald',
	},
	oliviaNovak: {
		id: '4',
		username: 'oliviaNovak',
		firstName: 'Olivia',
		lastName: 'Novak',
		email: 'nicolaslefevre@site.com',
		password: '!123Asd',
		position: 'Web Developer',
		isActive: true,
		image: { org: Avatar3 as string },
		socialAuth: {
			google: true,
			facebook: false,
			apple: true,
		},
		roles: ['admin'],
		twoFactorAuth: true,
		phone: '+1 (555) 555-1234',
		color: 'sky',
	},
};

export default USERS;
