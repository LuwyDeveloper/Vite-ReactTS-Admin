// @start-snippet:: titleBarsProjectAndUsersExampleSource
import Subheader, { SubheaderLeft } from '@/components/layout/Subheader';
import EXAMPLE from '@/examples/_index';

const TitleBarsProjectAndUsersExample = () => {
	return (
		<Subheader>
			<SubheaderLeft>
				<EXAMPLE.Ui.Dropdown.Project />
			</SubheaderLeft>
		</Subheader>
	);
};

export default TitleBarsProjectAndUsersExample;
// @end-snippet:: titleBarsProjectAndUsersExampleSource
