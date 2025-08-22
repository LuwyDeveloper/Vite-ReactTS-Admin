import { Avatar1 } from '@/assets/images';
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
	[key in 'luwyDyro']: TUser;
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
};

export default USERS;
