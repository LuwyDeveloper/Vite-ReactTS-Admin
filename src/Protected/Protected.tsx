import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/context/authContext';
import { useEffect, useState } from 'react';
import { LogoDark, LogoLight } from '@/assets/images';
import useDarkMode from '@/hooks/useDarkMode';

const Protected = ({ roles }: { roles: ('admin' | 'user' | 'moderator')[] }) => {
	const { isInitializing, tokenStorage, roles: userRoles } = useAuth();

	const hasAccess = roles.some((role) => userRoles.includes(role));
	const [dots, setDots] = useState('');
	const { isDarkTheme } = useDarkMode();

	useEffect(() => {
		if (isInitializing) {
			const interval = setInterval(() => {
				setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
			}, 500);
			return () => clearInterval(interval);
		}
	}, [isInitializing]);

	if (isInitializing) {
		console.log('Cargando sesión de usuario...');
		<div className='flex h-full flex-col items-center justify-center gap-4'>
			<img src={isDarkTheme ? LogoDark : LogoLight} alt='' className='h-24' />
			<p className='text-lg font-medium text-gray-600 dark:text-gray-300'>Cargando{dots}</p>
			<div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500'></div>
		</div>;
	}
	if (!tokenStorage && !isInitializing) {
		console.warn('⚠️ Protected: Sesión no encontrada después de carga.');
		return <Navigate to='/' replace />;
	}

	if (!hasAccess && !isInitializing) {
		console.error('Acceso denegado. Usuario no autorizado.');
		return <Navigate to='/' replace />;
	}
	if (tokenStorage && hasAccess) {
		console.log('Acceso permitido. Usuario autorizado.');
		return <Outlet />;
	}
};

export default Protected;
