import { createBrowserRouter, RouterProvider, Outlet } from 'react-router';
import { lazy } from 'react';
import LoginPage from '@/pages/Login.page';
import Protected from '@/Protected/Protected';
import Root from '@/Root';
import DefaultLayout from '@/layouts/Default.layout';
import Providers from '@/Providers/Providers';
import pages from './pages';
import Page404Page from '@/pages/Page404.page';
import UnderConstructionPage from '@/pages/UnderConstruction.page';
import RegisterPage from '@/pages/Register.page';

// Lazily loaded components for routes
const SalesLayout = lazy(() => import('@/pages/apps/sales/_layouts/Sales.layout'));
const SalesDashboardPage = lazy(() => import('@/pages/apps/sales/SalesDashboard.page'));
const SalesListPage = lazy(() => import('@/pages/apps/sales/SalesList.page'));
const SalesViewPage = lazy(() => import('@/pages/apps/sales/SalesView.page'));

const ProductsLayout = lazy(() => import('@/pages/apps/products/_layouts/Products.layout'));
const ProductsDashboardPage = lazy(() => import('@/pages/apps/products/ProductsDashboard.page'));
const ProductsListMocksPage = lazy(() => import('@/pages/apps/products/ProductsListMocks.page'));
const ProductsListPage = lazy(() => import('@/pages/apps/products/ProductsListapi.page'));
const ProductsListNestPage = lazy(() => import('@/pages/apps/products/ProductsListNestjs.page'));
const ProductsEditPage = lazy(() => import('@/pages/apps/products/ProductsEdit.page'));
const ProductsEditApiPage = lazy(() => import('@/pages/apps/products/ProductsEditApi.page'));
const ProductsEditNestPage = lazy(() => import('@/pages/apps/products/ProductsEditApiNest.page'));

const ProductsCreatePage = lazy(() => import('@/pages/apps/products/ProductsCreate.page'));
const ProductsCreateNestPage = lazy(() => import('@/pages/apps/products/ProductsCreateNest.page'));

const ProjectLayout = lazy(() => import('@/pages/apps/projects/_layouts/Project.layout'));
const ProjectDashboardPage = lazy(() => import('@/pages/apps/projects/ProjectDashboard.page'));
const ProjectBoardPage = lazy(() => import('@/pages/apps/projects/ProjectBoard.page'));
const ProjectListPage = lazy(() => import('@/pages/apps/projects/ProjectList.page'));
const ProjectGridPage = lazy(() => import('@/pages/apps/projects/ProjectGrid.page'));

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<Providers>
				<Outlet />
			</Providers>
		),
		children: [
			{
				path: '/',
				element: <Root />,
				children: [
					{
						path: pages.pagesExamples.login.to,
						element: <LoginPage />,
					},
					{
						path: pages.pagesExamples.signup.to,
						element: <RegisterPage />,
					},
					{
						path: pages.pagesExamples.underConstruction.to,
						element: <UnderConstructionPage />,
					},
					{
						path: '*',
						element: <Page404Page />,
					},
					// Protected routes
					{
						element: <Protected roles={['admin']} />,
						children: [
							{
								element: <DefaultLayout />,
								children: [
									// Apps
									{
										// Sales
										path: pages.apps.sales.to,
										element: <SalesLayout />,
										children: [
											{
												path: pages.apps.sales.to,
												element: <SalesDashboardPage />,
											},
											{
												path: pages.apps.sales.subPages.list.to,
												element: <SalesListPage />,
											},
											{
												path: pages.apps.sales.subPages.view.to,
												element: <SalesViewPage />,
											},
										],
									},

									{
										// Products
										path: pages.apps.products.to,
										element: <ProductsLayout />,
										children: [
											{
												path: pages.apps.products.to,
												element: <ProductsDashboardPage />,
											},
											{
												path: pages.apps.products.subPages.listmock.to,
												element: <ProductsListMocksPage />,
											},
											{
												path: pages.apps.products.subPages.list.to,
												element: <ProductsListPage />,
											},
											{
												path: pages.apps.products.subPages.listnest.to,
												element: <ProductsListNestPage />,
											},
											{
												path: pages.apps.products.subPages.create.to,
												element: <ProductsCreatePage />,
											},
											{
												path: pages.apps.products.subPages.createnest.to,
												element: <ProductsCreateNestPage />,
											},
											{
												path: pages.apps.products.subPages.edit.to,
												element: <ProductsEditPage />,
											},
											{
												path: pages.apps.products.subPages.editapi.to,
												element: <ProductsEditApiPage />,
											},
											{
												path: pages.apps.products.subPages.editapinest.to,
												element: <ProductsEditNestPage />,
											},
										],
									},
									{
										// Projects
										path: pages.apps.projects.to,
										element: <ProjectLayout />,
										children: [
											{
												path: pages.apps.projects.to,
												element: <ProjectDashboardPage />,
											},
											{
												path: pages.apps.projects.subPages.board.to,
												element: <ProjectBoardPage />,
											},
											{
												path: pages.apps.projects.subPages.list.to,
												element: <ProjectListPage />,
											},
											{
												path: pages.apps.projects.subPages.grid.to,
												element: <ProjectGridPage />,
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
	},
]);

const Routes = () => {
	return <RouterProvider router={router} />;
};

export default Routes;
