import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const SignInSchema = z.object({
	username: z.string().min(3, 'Username must be at least 3 characters long'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
})

type SignInFormValues = z.infer<typeof SignInSchema>

export function SignInForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInFormValues>({
		resolver: zodResolver(SignInSchema),
	})

	const onSubmit = (data: SignInFormValues) => {
		console.log(data)
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
									Welcome Back!
								</h1>
								<p className='text-balance text-muted-foreground'>
									Sign in to continue to ChatChit.
								</p>
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

							{/* Sign In Button */}
							<Button
								type='submit'
								className='w-full'
								disabled={isSubmitting}
							>
								Sign In
							</Button>

							<div className='text-center text-sm'>
								New to ChatChit?{' '}
								<Link
									to='/signup'
									className='font-medium text-primary underline underline-offset-4 hover:text-primary-glow'
								>
									Sign Up
								</Link>
							</div>
						</div>
					</form>
					<div className='bg-muted relative hidden md:block'>
						<img
							src='/placeholder.png'
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
