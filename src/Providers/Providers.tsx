import { ThemeContextProvider } from '@/context/themeContext';
import { AuthProvider } from '@/context/authContext';

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeContextProvider>
			<AuthProvider>{children}</AuthProvider>
		</ThemeContextProvider>
	);
};

export default Providers;
