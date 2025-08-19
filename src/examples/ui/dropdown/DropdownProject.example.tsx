import Dropdown, {
	DropdownDivider,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '@/components/ui/Dropdown';
import Button from '@/components/ui/Button';
import { Logo } from '@/assets/images';
import Icon from '@/components/icon/Icon';
import { useTranslation } from 'react-i18next';

const DropdownProjectExample = () => {
	const { t } = useTranslation(['menu']);
	return (
		<Dropdown>
			<DropdownToggle>
				<Button aria-label={t('Project')} variant='link' className='!px-0'>
					{t('Project')}
				</Button>
			</DropdownToggle>
			<DropdownMenu>
				<DropdownItem className='gap-2'>
					<img src={Logo} alt='' className='size-10' />
					<div className='flex flex-col'>
						<div className='font-bold'>LuwyDyro</div>
						<div className='text-sm text-zinc-500'>LuwyDyro</div>
					</div>
					<Icon icon='Tick02' size='text-xl' className='ms-auto' />
				</DropdownItem>
				<DropdownDivider />
				<DropdownItem>
					<div>{t('Logout')}</div>
					<div className='ms-auto text-sm text-zinc-500'>LuwyDyro</div>
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};

export default DropdownProjectExample;
