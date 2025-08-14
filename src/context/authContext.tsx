import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { IUserDataFromAPI } from '@/mocks/user';

export interface IAuthContextProps {
	isInitializing: boolean;
	isLoading: boolean;
	onLogin: (username: string, password: string, rememberMe: boolean) => Promise<void>;
	userData: IUserDataFromAPI | null;
	usernameStorage: string | null;
	tokenStorage: string | null;
	onLogout: (isRedirect: boolean) => Promise<void>;
	roles: string[];
}
const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	console.log('AuthProvider mounted');
	const [userData, setUserData] = useState<IUserDataFromAPI | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [tokenStorage, setTokenStorage] = useState<string | null>(null);
	const [usernameStorage, setUsernameStorage] = useState<string | null>(null);
	const [isInitializing, setIsInitializing] = useState(true);

	const navigate = useNavigate();

	const loginWithApi = async (username: string, password: string) => {
		try {
			const response = await fetch('https://nest-luwy-pack.onrender.com/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: username, password }),
			});

			const data = await response.json();
			if (!response.ok) {
				console.error('Error en login:', data);
				throw new Error(data.message || 'Login inválido');
			}

			return data;
		} catch (err) {
			console.error('Error inesperado:', err);
			throw err;
		}
	};

	useEffect(() => {
		const restoreSession = () => {
			const storedToken = localStorage.getItem('token') ?? sessionStorage.getItem('token');
			const storedUsername =
				localStorage.getItem('username') ?? sessionStorage.getItem('username');
			const storedUserData =
				localStorage.getItem('userData') ?? sessionStorage.getItem('userData');
			console.log('Restoring session from storage:');
			if (storedToken) setTokenStorage(storedToken);
			if (storedUsername) setUsernameStorage(storedUsername);

			if (storedUserData) {
				try {
					const parsedUser = JSON.parse(storedUserData);
					setUserData(parsedUser);
				} catch (err) {
					console.error('❌ Error al parsear userData', err);
				}
			}
			setIsInitializing(false);
		};

		restoreSession();
	}, []);

	// Autenticar al usuario
	const onLogin = async (username: string, password: string, rememberMe: boolean) => {
		setIsLoading(true);
		try {
			const { token, user } = await loginWithApi(username, password);
			const storage = rememberMe ? localStorage : sessionStorage;

			storage.setItem('username', username);
			storage.setItem('token', token);
			storage.setItem('userData', JSON.stringify(user));

			setUserData(user);
			setTokenStorage(token);
			setUsernameStorage(username);

			navigate('/products', { replace: true });
		} catch (error) {
			console.error('Login error:', error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// call this function to sign out logged-in user
	const onLogout = async (isNavigate = true) => {
		setIsLoading(true);
		localStorage.removeItem('username');
		localStorage.removeItem('token');
		localStorage.removeItem('userData');
		sessionStorage.removeItem('username');
		sessionStorage.removeItem('token');
		sessionStorage.removeItem('userData');
		// setUserData(null);
		console.log('Logging out...');

		setIsLoading(false);
		if (isNavigate) navigate(`./`, { replace: true });
	};

	const value: IAuthContextProps = useMemo(
		() => ({
			isInitializing,
			isLoading,
			onLogin,
			userData,
			usernameStorage,
			tokenStorage,
			roles: userData?.roles || [],
			onLogout,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[isInitializing, isLoading, userData, usernameStorage, tokenStorage],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	return useContext(AuthContext);
};
