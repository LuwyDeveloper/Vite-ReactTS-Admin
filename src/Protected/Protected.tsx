import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/context/authContext';
import { LogoDark } from '@/assets/images';
import { useEffect } from 'react';

const Protected = ({ roles }: { roles: ('admin' | 'user' | 'moderator')[] }) => {
	const { isLoading, tokenStorage, roles: userRoles } = useAuth();

	useEffect(() => {
		console.log('🔁 Protected state changed →', {
			isLoading,
			tokenStorage,
			userRoles,
		});
	}, [isLoading, tokenStorage, userRoles]);

	// ⏳ Mostrar loading mientras se carga la sesión
	if (isLoading) {
		return (
			<div className='flex h-full items-center justify-center'>
				<img src={LogoDark} alt='Logo cargando' className='h-24' />
			</div>
		);
	}

	// ❌ No hay token, redirigir al login
	if (!tokenStorage) {
		console.warn('⚠️ Protected: Sesión no encontrada después de carga.');
		return <Navigate to='/login' replace />;
	}

	// ❌ El usuario no tiene ninguno de los roles requeridos
	const hasAccess = roles.some((role) => userRoles.includes(role));
	if (!hasAccess) {
		console.error('⛔ Acceso denegado. Usuario no autorizado.');
		return <Navigate to='/login' replace />;
	}

	// ✅ Usuario autorizado
	console.log('✅ Acceso permitido. Usuario autorizado.');
	return <Outlet />;
};

export default Protected;
