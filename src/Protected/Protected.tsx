import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/context/authContext';

const Protected = ({ roles }: { roles: ('admin' | 'user' | 'moderator')[] }) => {
	const { tokenStorage, roles: userRoles } = useAuth();

	const hasAccess = roles.some((role) => userRoles.includes(role));

	if (!tokenStorage) {
		console.warn('⚠️ Protected: Sesión no encontrada después de carga.');
		return <Navigate to='/' replace />;
	}

	if (!hasAccess) {
		console.error('Acceso denegado. Usuario no autorizado.');
		return <Navigate to='/' replace />;
	}

	console.log('Acceso permitido. Usuario autorizado.');
	return <Outlet />;
};

export default Protected;
