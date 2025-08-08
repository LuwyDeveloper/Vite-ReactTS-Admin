import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/context/authContext';
import { LogoDark } from '@/assets/images';

const Protected = ({ roles }: { roles: ('admin' | 'user' | 'moderator')[] }) => {
	const { isLoading, tokenStorage, roles: userRoles } = useAuth();
	if (isLoading) {
		return (
			<div className='flex h-full items-center justify-center'>
				<img src={LogoDark} alt='Logo cargando' className='h-24' />
			</div>
		);
	}

	if (!tokenStorage) {
		console.warn('⚠️ Protected: Sesión no encontrada después de carga.');
		return <Navigate to='/' replace />;
	}

	const hasAccess = roles.some((role) => userRoles.includes(role));
	if (!hasAccess) {
		console.error('Acceso denegado. Usuario no autorizado.');
		return <Navigate to='/' replace />;
	}

	console.log('Acceso permitido. Usuario autorizado.');
	return <Outlet />;
};

export default Protected;
