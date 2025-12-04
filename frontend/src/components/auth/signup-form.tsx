import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/stores/useAuthStore'

const SignUpSchema = z
	.object({
		firstName: z.string().min(1, 'First name is required'),
		lastName: z.string().min(1, 'Last name is required'),
		username: z
			.string()
			.min(3, 'Username must be at least 3 characters long'),
		email: z.email('Invalid email address'),
		password: z
			.string()
			.min(6, 'Password must be at least 6 characters long'),
		confirmPassword: z.string().min(6, 'Please confirm your password'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

type SignUpFormValues = z.infer<typeof SignUpSchema>

export function SignupForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const { signUp } = useAuthStore()
	const navigate = useNavigate()
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignUpFormValues>({
		resolver: zodResolver(SignUpSchema),
	})

	const onSubmit = async (data: SignUpFormValues) => {
		const { firstName, lastName, username, email, password } = data

		// Call signUp from the auth store
		await signUp({ firstName, lastName, username, email, password })

		// Navigate to sign-in page after successful sign-up
		navigate('/signin')
	}

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card className='overflow-auto p-0 border-border'>
				<CardContent className='grid p-0 md:grid-cols-2'>
					<form
						className='p-6 md:p-8'
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className='flex flex-col gap-6 '>
							{/* Header */}
							<div className='flex flex-col items-center text-center gap-2'>
								<Link
									to='/'
									className='mx-auto block w-fit text-center'
								>
									<img
										src='./logo.svg'
										alt='ChatChit Logo'
										className='w-16 h-16'
									/>
								</Link>
								<h1 className='text-2xl font-bold'>
									Create your ChatChit Account
								</h1>
								<p className='text-balance text-muted-foreground'>
									Join us and start chatting today!
								</p>
							</div>

							{/* First Name & Last Name */}
							<div className='grid grid-cols-2 gap-3 '>
								<div className='space-y-2'>
									<label
										htmlFor='firstname'
										className='block text-sm'
									>
										First Name
									</label>
									<Input
										id='firstname'
										type='text'
										placeholder='Ryan'
										className='w-full'
										{...register('firstName')}
									/>

									{errors.firstName && (
										<p className='text-destructive text-sm'>
											{errors.firstName.message}
										</p>
									)}
								</div>
								<div className='space-y-2'>
									<label
										htmlFor='lastname'
										className='block text-sm'
									>
										Last Name
									</label>
									<Input
										id='lastname'
										type='text'
										placeholder='Pham'
										className='w-full'
										{...register('lastName')}
									/>

									{errors.lastName && (
										<p className='text-destructive text-sm'>
											{errors.lastName.message}
										</p>
									)}
								</div>
							</div>

							{/* Username */}
							<div className='flex flex-col gap-3'>
								<div className='space-y-2'>
									<label
										htmlFor='username'
										className='block text-sm'
									>
										Username
									</label>
									<Input
										id='username'
										type='text'
										placeholder='Enter your username'
										className='w-full'
										{...register('username')}
									/>

									{errors.username && (
										<p className='text-destructive text-sm'>
											{errors.username.message}
										</p>
									)}
								</div>
							</div>

							{/* Email */}
							<div className='flex flex-col gap-3'>
								<div className='space-y-2'>
									<label
										htmlFor='email'
										className='block text-sm'
									>
										Email
									</label>
									<Input
										id='email'
										type='text'
										placeholder='Enter your email'
										className='w-full'
										{...register('email')}
									/>

									{errors.email && (
										<p className='text-destructive text-sm'>
											{errors.email.message}
										</p>
									)}
								</div>
							</div>

							{/* Password */}
							<div className='flex flex-col gap-3'>
								<div className='space-y-2'>
									<label
										htmlFor='password'
										className='block text-sm'
									>
										Password
									</label>
									<Input
										id='password'
										type='password'
										placeholder='Enter your password'
										className='w-full'
										{...register('password')}
									/>

									{errors.password && (
										<p className='text-destructive text-sm'>
											{errors.password.message}
										</p>
									)}
								</div>
							</div>

							{/* Confirm Password */}
							<div className='flex flex-col gap-3'>
								<div className='space-y-2'>
									<label
										htmlFor='confirmPassword'
										className='block text-sm'
									>
										Confirm Password
									</label>
									<Input
										id='confirmPassword'
										type='password'
										placeholder='Confirm your password'
										className='w-full'
										{...register('confirmPassword')}
									/>

									{errors.confirmPassword && (
										<p className='text-destructive text-sm'>
											{errors.confirmPassword.message}
										</p>
									)}
								</div>
							</div>

							{/* Sign Up Button */}
							<Button
								type='submit'
								className='w-full'
								disabled={isSubmitting}
							>
								Sign Up
							</Button>

							<div className='text-center text-sm'>
								Already have an account?{' '}
								<Link
									to='/signin'
									className='font-medium text-primary underline underline-offset-4 hover:text-primary-glow'
								>
									Sign In
								</Link>
							</div>
						</div>
					</form>
					<div className='bg-muted relative hidden md:block'>
						<img
							src='/placeholderSignUp.png'
							alt='Image'
							className='absolute top-1/2 -translate-y-1/2 object-cover'
						/>
					</div>
				</CardContent>
			</Card>
			<div className='px-6 text-center text-xs text-balance *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4'>
				By clicking continue, you agree to our{' '}
				<a href='#'>Terms of Service</a> and{' '}
				<a href='#'>Privacy Policy</a>.
			</div>
		</div>
	)
}
