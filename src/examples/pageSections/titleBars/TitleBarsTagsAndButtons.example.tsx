// @start-snippet:: titleBarsTagsAndButtonsExampleSource
import Subheader, {
	SubheaderLeft,
	SubheaderSeparator,
} from '@/components/layout/Subheader';
import EXAMPLE from '@/examples/_index';

const TitleBarsTagsAndButtonsExample = () => {
	return (
		<Subheader>
			<SubheaderLeft>
				<EXAMPLE.Ui.Dropdown.EditTag />
				<SubheaderSeparator />
				<EXAMPLE.Ui.Dropdown.ChangeStatus />
			</SubheaderLeft>
		</Subheader>
	);
};

export default TitleBarsTagsAndButtonsExample;
// @end-snippet:: titleBarsTagsAndButtonsExampleSource
