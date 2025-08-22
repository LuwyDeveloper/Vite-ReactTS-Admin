import { Avatar1 } from '@/assets/images';
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
	[key in 'luwyDyro']: TUser;
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
};

export default USERS;
