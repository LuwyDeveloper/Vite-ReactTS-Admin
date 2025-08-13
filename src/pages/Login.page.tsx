import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import useDarkMode from '@/hooks/useDarkMode';
import { LogoDark, LogoLight } from '@/assets/images';
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';
import Input from '@/components/form/Input';
import Button from '@/components/ui/Button';
import FieldWrap from '@/components/form/FieldWrap';
import USERS from '@/mocks/user';
import Card, { CardBody } from '@/components/ui/Card';
import Checkbox from '@/components/form/Checkbox';
import Label from '@/components/form/Label';

interface IFormValues {
	username: string;
	password: string;
	rememberMe: boolean;
}

const LoginPage = () => {
	const { isDarkTheme } = useDarkMode();
	const navigate = useNavigate();
	const { onLogin, onLogout } = useAuth();

	// useEffect(() => {
	// 	onLogout(false).then();
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	const handleLogin = (username: string, password: string, rememberMe: boolean) => {
		onLogin(username, password, rememberMe).then(
			() => {
				console.log('Login success.');
			},
			(error) => {
				console.log('Login error.', error);
			},
		);
	};
	const validationSchema = Yup.object({
		username: Yup.string()
			.email('Debe ser un correo electrónico válido')
			.required('Username o email requerido'),
		password: Yup.string().required('Contraseña requerida'),
		rememberMe: Yup.boolean(),
	});

	const formik = useFormik<IFormValues>({
		initialValues: {
			username: USERS.luwyDyro.username,
			password: USERS.luwyDyro.password,
			rememberMe: true,
		},
		validationSchema,
		onSubmit: (values) => {
			handleLogin(values.username, values.password, values.rememberMe);
		},
	});

	const [visibility, setVisibility] = useState<Record<string, boolean>>({});
	const toggleVisibility = (field: string) => {
		setVisibility((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	return (
		<div className='flex h-full items-center justify-center'>
			<div className='mx-auto w-full max-w-md p-6'>
				<Card className='dark:bg-zinc-900!'>
					<CardBody className='p-8!'>
						<button
							className='mb-8 flex w-full items-center justify-center'
							aria-label='Homepage'
							onClick={() => navigate('/')}>
							<img
								src={isDarkTheme ? LogoDark : LogoLight}
								className='h-16 cursor-pointer'
								alt='LuwyDyro'
							/>
						</button>

						<div className='text-center'>
							<h1 className='block text-2xl font-bold text-zinc-800 dark:text-white'>
								Sign in
							</h1>
						</div>

						<div className='mt-5'>
							<div>
								<div className='grid gap-y-4'>
									<div>
										<Label htmlFor='username' className='w-auto!'>
											Username or email
										</Label>
										<Input
											className='bg-transparent!'
											id='username'
											name='username'
											autoComplete='username'
											value={formik.values.username}
											onChange={formik.handleChange}
											placeholder='Enter username or email'
										/>
										{formik.touched.username && formik.errors.username && (
											<p className='mt-1 text-sm text-red-500'>
												{formik.errors.username}
											</p>
										)}
									</div>

									<div>
										<div className='mb-2 flex items-center justify-between [&>*]:mb-0'>
											<Label htmlFor='password' className='w-auto!'>
												Password
											</Label>
											{/* <Description id='forgot-password-desc'>
												<Link className='text-sm font-medium' to='/forgot'>
													Forgot password?
												</Link>
											</Description> */}
										</div>

										<FieldWrap
											lastSuffix={
												<Button
													aria-label='View/Hide'
													color='zinc'
													icon={
														visibility.password
															? 'View'
															: 'ViewOffSlash'
													}
													onClick={() => toggleVisibility('password')}
													tabIndex={-1}
												/>
											}>
											<Input
												type={visibility.password ? 'text' : 'password'}
												className='bg-transparent! font-mono placeholder-shown:font-sans'
												id='password'
												name='password'
												autoComplete='current-password'
												value={formik.values.password}
												onChange={formik.handleChange}
												placeholder='Enter password'
												onCopy={(e) => e.preventDefault()}
												onCut={(e) => e.preventDefault()}
												aria-describedby='forgot-password-desc'
											/>
										</FieldWrap>
										{formik.touched.password && formik.errors.password && (
											<p className='mt-1 text-sm text-red-500'>
												{formik.errors.password}
											</p>
										)}
									</div>

									<div className='flex items-center'>
										<Checkbox
											id='rememberMe'
											name='rememberMe'
											checked={formik.values.rememberMe}
											onChange={formik.handleChange}
											dimension='sm'
											label='Remember Me'
											color='emerald'
										/>
									</div>

									<Button
										aria-label='Sign in'
										variant='solid'
										className='py-2.5! font-bold'
										onClick={formik.submitForm}>
										Sign in
									</Button>
								</div>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default LoginPage;
