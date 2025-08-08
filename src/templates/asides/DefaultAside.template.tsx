import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Aside, { AsideBody, AsideQuickContainer, AsideQuickNav } from '@/components/layout/Aside';
import { useNavigate } from 'react-router';
import useAsideStatus from '@/hooks/useAsideStatus';
import Icon from '@/components/icon/Icon';
import Nav, {
	NavButton,
	NavCollapse,
	NavItem,
	NavSeparator,
	NavTitle,
} from '@/components/layout/Navigation/Nav';
import pages, { TPage, TPages } from '@/Routes/pages';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/form/Input';
import FieldWrap from '@/components/form/FieldWrap';
import Modal, { ModalFooter, ModalFooterChild, ModalHeader } from '@/components/ui/Modal';
import classNames from 'classnames';
import AsideHeaderPart from '@/templates/asides/_parts/AsideHeader.part';
import AsideFooterPart from '@/templates/asides/_parts/AsideFooter.part';
import EXAMPLE from '@/examples/_index';

const getFlattenPages = (pages: TPages, parentId?: string): TPage[] => {
	return Object.values(pages).flatMap((page) => {
		const { subPages, ...pageData } = page;
		const currentPage: TPage = { ...pageData, parentId };
		const subPagesArray = subPages ? getFlattenPages(subPages, page.id) : [];
		return [currentPage, ...subPagesArray];
	});
};

const Search = () => {
	const { asideStatus } = useAsideStatus();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	/**
	 * CMD + K open modal
	 */
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.metaKey && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				setIsModalOpen(true);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	/**
	 * Auto focus input
	 */
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (isModalOpen) {
			inputRef.current?.focus();
		}
	}, [isModalOpen]);

	/**
	 * Search input
	 */
	const [inputValue, setInputValue] = useState<string>('');
	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	return (
		<>
			{!asideStatus && (
				<Button
					icon='Search01'
					variant='outline'
					color='zinc'
					className='mb-4 !h-[44px] w-full !text-zinc-500'
					onClick={() => setIsModalOpen(true)}
					aria-label=''
				/>
			)}
			<FieldWrap
				className={classNames({ hidden: !asideStatus })}
				firstSuffix={<Icon icon='Search01' className='text-zinc-500' />}
				lastSuffix={<span className='text-zinc-500'>⌘K</span>}>
				<Input
					name='search'
					placeholder='Search'
					type='search'
					className='mb-4 !border-zinc-500/25 transition-all duration-300 ease-in-out hover:!border-zinc-500/50'
					value={inputValue}
					onClick={() => setIsModalOpen(true)}
					onChange={() => {}}
				/>
			</FieldWrap>
			<Modal
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
				rounded='rounded-2xl'
				isScrollable>
				<ModalHeader hasCloseButton={false}>
					<FieldWrap
						firstSuffix={<Icon icon='Search01' className='text-zinc-500' />}
						lastSuffix={
							<Badge color='zinc' variant='outline' className='font-mono text-sm'>
								ESC
							</Badge>
						}>
						<Input
							ref={inputRef}
							name='search'
							placeholder='Search'
							type='search'
							value={inputValue}
							onChange={handleInputChange}
							className='w-full'
						/>
					</FieldWrap>
				</ModalHeader>

				<ModalFooter>
					<ModalFooterChild>
						<div className='flex items-center gap-1 text-sm'>
							<div className='rounded-lg border border-zinc-500/50 p-1 font-mono text-sm'>
								<Icon icon='ArrowMoveDownLeft' />
							</div>
							<span className='text-zinc-500'>to select</span>
						</div>
						<div className='flex items-center gap-1 text-sm'>
							<div className='rounded-lg border border-zinc-500/50 p-1 font-mono text-sm'>
								<Icon icon='ArrowDown02' />
							</div>
							<div className='rounded-lg border border-zinc-500/50 p-1 font-mono text-sm'>
								<Icon icon='ArrowUp02' />
							</div>
							<span className='text-zinc-500'>to navigate</span>
						</div>
						<div className='flex items-center gap-1 text-sm'>
							<div className='rounded-lg border border-zinc-500/50 p-1 font-mono text-xs'>
								ESC
							</div>
							<span className='text-zinc-500'>to close</span>
						</div>
					</ModalFooterChild>
				</ModalFooter>
			</Modal>
		</>
	);
};

const DefaultAsideTemplate = () => {
	const navigate = useNavigate();

	const tabs = {
		dashboard: {
			id: 'dashboard',
			title: 'Dashboard',
			icon: 'Home09',
		},
		apps: {
			id: 'apps',
			title: 'Apps',
			icon: 'GridView',
		},
	};
	const [activeTab, setActiveTab] = useState<string>(
		localStorage.getItem('bolt_activeTab') || tabs.dashboard.id,
	);
	const handleActiveTab = (id: string) => {
		setActiveTab(id);
		localStorage.setItem('bolt_activeTab', id);

		if (id === tabs.dashboard.id) navigate(pages.apps.sales.to);
	};
	return (
		<Aside>
			<AsideHeaderPart />
			<AsideBody>
				<Search />
				<AsideQuickContainer>
					{Object.values(tabs).map((tab) => (
						<AsideQuickNav
							key={tab.id}
							icon={tab.icon}
							isActive={activeTab === tab.id}
							onClick={() => handleActiveTab(tab.id)}>
							{tab.title}
						</AsideQuickNav>
					))}
				</AsideQuickContainer>
				<Nav>
					{[tabs.dashboard.id].includes(activeTab as string) && (
						<>
							<NavTitle>Dashboards</NavTitle>
							<NavItem {...pages.apps.sales} />
							<NavItem {...pages.apps.customer} />
							<NavItem {...pages.apps.products}>
								<NavButton
									icon='PlusSignCircle'
									title='New'
									onClick={() => navigate(pages.apps.products.subPages.edit.to)}
								/>
							</NavItem>
							<NavItem {...pages.apps.projects} isChildrenNavButtonOverwrite>
								<div className='-mx-2 -my-2'>
									<EXAMPLE.Ui.Dropdown.Snooze />
								</div>
							</NavItem>
							<NavItem {...pages.apps.invoices} />
						</>
					)}
					{[tabs.dashboard.id, tabs.apps.id].includes(activeTab as string) && (
						<>
							<NavTitle>Apps</NavTitle>
							<NavCollapse {...pages.apps.sales}>
								<NavItem {...pages.apps.sales} />
								<NavItem {...pages.apps.sales.subPages?.list} />
								<NavItem {...pages.apps.sales.subPages?.view} />
							</NavCollapse>
							<NavCollapse {...pages.apps.customer}>
								<NavItem {...pages.apps.customer} />
								<NavItem {...pages.apps.customer.subPages?.list} />
								<NavItem
									{...pages.apps.customer.subPages?.edit}
									to={`${pages.apps.customer.subPages.edit.to}?customerId=17`}
								/>
								<NavItem
									{...pages.apps.customer.subPages?.view}
									to={`${pages.apps.customer.subPages.view.to}?customerId=17`}
								/>
							</NavCollapse>
							<NavCollapse {...pages.apps.products}>
								<NavItem {...pages.apps.products} />
								<NavItem {...pages.apps.products.subPages?.listmock} />
								<NavItem {...pages.apps.products.subPages?.list} />
								<NavItem {...pages.apps.products.subPages?.listnest} />
								<NavItem {...pages.apps.products.subPages?.create} />
							</NavCollapse>
							<NavCollapse {...pages.apps.projects}>
								<NavItem {...pages.apps.projects} />
								<NavItem {...pages.apps.projects.subPages?.board} />
								<NavItem {...pages.apps.projects.subPages?.list} />
								<NavItem {...pages.apps.projects.subPages?.grid} />
							</NavCollapse>
							<NavCollapse {...pages.apps.invoices}>
								<NavItem {...pages.apps.invoices} />
								<NavItem {...pages.apps.invoices.subPages?.list} />
								<NavItem
									{...pages.apps.invoices.subPages?.view}
									to={`${pages.apps.invoices.subPages.view.to}?invoiceId=100023`}
								/>
							</NavCollapse>
							<NavSeparator />
						</>
					)}
					{[tabs.dashboard.id].includes(activeTab as string) && (
						<>
							<NavTitle>Pages Examples</NavTitle>
							<NavCollapse {...pages.pagesExamples.list}>
								<NavItem {...pages.pagesExamples.list.subPages?.example1} />
								<NavItem {...pages.pagesExamples.list.subPages?.example2} />
							</NavCollapse>
							<NavCollapse {...pages.pagesExamples.grid}>
								<NavItem {...pages.pagesExamples.grid.subPages?.example1} />
							</NavCollapse>
							<NavCollapse {...pages.pagesExamples.edit}>
								<NavItem {...pages.pagesExamples.edit.subPages?.example1} />
								<NavItem {...pages.pagesExamples.edit.subPages?.example2} />
							</NavCollapse>
							<NavItem {...pages.pagesExamples.login} />
							<NavItem {...pages.pagesExamples.signup} />
							<NavItem {...pages.pagesExamples.notFound} />
							<NavItem {...pages.pagesExamples.underConstruction} />
						</>
					)}
				</Nav>
			</AsideBody>
			<AsideFooterPart />
		</Aside>
	);
};

export default DefaultAsideTemplate;
