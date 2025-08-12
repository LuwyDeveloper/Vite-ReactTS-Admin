// @start-snippet:: dataCardBrowserExampleSource
import Card, {
	CardBody,
	// CardFooter,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Icon from '@/components/icon/Icon';
import ProgressCircular from '@/components/ui/ProgressCircular';
// import Checkbox from '@/components/form/Checkbox';
// import { useState } from 'react';

const DataCardBrowserExample = () => {
	// const [checked, setChecked] = useState<boolean>(true);
	return (
		<Card className='h-full'>
			<CardHeader>
				<CardHeaderChild>
					<CardTitle
						iconProps={{
							icon: 'DashboardBrowsing',
							color: 'emerald',
							size: 'text-3xl',
						}}>
						Browsers
					</CardTitle>
				</CardHeaderChild>
				<CardHeaderChild>
					<Badge variant='outline' color='emerald' rounded='rounded-full'>
						<Icon icon='Tick02' /> Good
					</Badge>
				</CardHeaderChild>
			</CardHeader>
			<CardBody>
				<div className='grid grid-cols-12 gap-4'>
					<div className='col-span-12'>
						<ProgressCircular
							type='quarter'
							color='emerald'
							value={85}
							bgStrokeWidth={4}
							circleStrokeWidth={2}
							className='!size-48'>
							<div>
								<div>85%</div>
								<div className='text-xs'>Progress</div>
							</div>
						</ProgressCircular>
						<div className='text-zinc-500'>
							Visitors are viewing website from the desktop device. 57% of all users
							are using MacOS
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default DataCardBrowserExample;
// @end-snippet:: dataCardBrowserExampleSource
