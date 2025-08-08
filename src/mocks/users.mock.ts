import { Avatar1, Avatar2, Avatar3, Avatar4, Avatar5 } from '@/assets/images';
import { TColors } from '@/types/colors.type';

export type TUser = {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	position: string;
	isVerified: boolean;
	image: { org: string };
	socialAuth: {
		google: boolean;
		facebook: boolean;
		apple: boolean;
	};
	role: 'admin' | 'user' | 'moderator';
	twoFactorAuth: boolean;
	phone: string;
	color: TColors;
};

type TUsers = {
	[key in 'johndoe' | 'aulisTiainen' | 'nicolasLefevre' | 'oliviaNovak' | 'luwyDyro']: TUser;
};

const USERS: TUsers = {
	luwyDyro: {
		id: '1',
		username: 'luwyDyro',
		firstName: 'Luis',
		lastName: 'Huaman',
		email: 'test1@google.com',
		password: 'Abc123',
		position: 'Web Developer',
		isVerified: true,
		image: { org: Avatar1 as string },
		socialAuth: {
			google: true,
			facebook: false,
			apple: true,
		},
		role: 'admin',
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
		isVerified: true,
		image: { org: Avatar4 as string },
		socialAuth: {
			google: true,
			facebook: false,
			apple: true,
		},
		role: 'admin',
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
		isVerified: true,
		image: { org: Avatar5 as string },
		socialAuth: {
			google: true,
			facebook: false,
			apple: true,
		},
		role: 'admin',
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
		isVerified: true,
		image: { org: Avatar2 as string },
		socialAuth: {
			google: true,
			facebook: false,
			apple: true,
		},
		role: 'admin',
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
		isVerified: true,
		image: { org: Avatar3 as string },
		socialAuth: {
			google: true,
			facebook: false,
			apple: true,
		},
		role: 'admin',
		twoFactorAuth: true,
		phone: '+1 (555) 555-1234',
		color: 'sky',
	},
};

export default USERS;
