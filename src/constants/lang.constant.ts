import { TLang } from '@/types/lang.type';

export type ILang = {
	[key in TLang]: {
		text: string;
		lng: TLang;
		icon: string;
	};
};

const LANG: ILang = {
	es: {
		text: 'Spanish',
		lng: 'es',
		icon: 'CustomSpain',
	},
	en: {
		text: 'English',
		lng: 'en',
		icon: 'CustomUsa',
	},
};

export default LANG;
