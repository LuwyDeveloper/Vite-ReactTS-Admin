import Container from '@/components/layout/Container';
import EXAMPLE from '@/examples/_index';

const ProductsDashboardPage = () => {
	return (
		<>
			<Container>
				<div className='grid grid-cols-12 gap-4'>
					<div className='col-span-12'>
						<EXAMPLE.DataVisualization.Stat.WithIcon />
					</div>

					<div className='col-span-12 xl:col-span-4'>
						<EXAMPLE.DataVisualization.DataCard.Browser />
					</div>
					<div className='col-span-12 xl:col-span-4'>
						<EXAMPLE.DataVisualization.InteractiveDataCards.Traffic />
					</div>
					<div className='col-span-12 xl:col-span-4'>
						<EXAMPLE.DataVisualization.InteractiveDataCards.LineChartWithDatepicker />
					</div>
					<div className='col-span-12'>
						<EXAMPLE.Table.Products.Expandable />
					</div>
				</div>
			</Container>
		</>
	);
};

export default ProductsDashboardPage;
