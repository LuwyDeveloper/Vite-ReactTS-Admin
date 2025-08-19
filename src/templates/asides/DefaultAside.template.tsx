import { useState } from 'react';
import Aside, { AsideBody, AsideQuickContainer, AsideQuickNav } from '@/components/layout/Aside';
import { useNavigate } from 'react-router';

import Nav, {
	NavButton,
	NavCollapse,
	NavItem,
	NavSeparator,
	NavTitle,
} from '@/components/layout/Navigation/Nav';
// import pages, { TPage, TPages } from '@/Routes/pages';
import pages from '@/Routes/pages';

import AsideHeaderPart from '@/templates/asides/_parts/AsideHeader.part';
import AsideFooterPart from '@/templates/asides/_parts/AsideFooter.part';
import Search from '@/components/layout/Navigation/Search';

// const getFlattenPages = (pages: TPages, parentId?: string): TPage[] => {
// 	return Object.values(pages).flatMap((page) => {
// 		const { subPages, ...pageData } = page;
// 		const currentPage: TPage = { ...pageData, parentId };
// 		const subPagesArray = subPages ? getFlattenPages(subPages, page.id) : [];
// 		return [currentPage, ...subPagesArray];
// 	});
// };

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

		if (id === tabs.dashboard.id) navigate(pages.apps.products.to);
	};
	return (
		<Aside>
			<AsideHeaderPart />
			<AsideBody>
				<Search />
				<AsideQuickContainer>
					{Object.values(tabs).map((tab) => (
						<AsideQuickNav
							labelkey={tab.title}
							key={tab.id}
							icon={tab.icon}
							isActive={activeTab === tab.id}
							onClick={() => handleActiveTab(tab.id)}
						/>
					))}
				</AsideQuickContainer>
				<Nav>
					{[tabs.dashboard.id].includes(activeTab as string) && (
						<>
							<NavTitle>Dashboards</NavTitle>
							<NavItem {...pages.apps.products}>
								<NavButton
									icon='PlusSignCircle'
									title='Crear'
									onClick={() =>
										navigate(pages.apps.products.subPages.createnest.to)
									}
								/>
							</NavItem>
						</>
					)}
					{[tabs.dashboard.id, tabs.apps.id].includes(activeTab as string) && (
						<>
							<NavTitle>Apps</NavTitle>

							<NavCollapse {...pages.pagesExamples.products}>
								<NavItem {...pages.apps.products.subPages?.listmock} />
								<NavItem {...pages.apps.products.subPages?.list} />
								<NavItem {...pages.apps.products.subPages?.listnest} />
								<NavItem {...pages.apps.products.subPages?.createnest} />
							</NavCollapse>

							<NavSeparator />
						</>
					)}
				</Nav>
			</AsideBody>
			<AsideFooterPart />
		</Aside>
	);
};

export default DefaultAsideTemplate;
