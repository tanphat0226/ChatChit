import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router'

import { Input } from '@/components/ui/input'

export function SignupForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card className='overflow-hidden p-0 border-border '>
				<CardContent className='grid p-0 md:grid-cols-2'>
					<form className='p-6 md:p-8'>
						<div className='flex flex-col gap-6 '>
							{/* Header */}
							<div className='flex flex-col items-center text-center gap-2 mb-2'>
								<Link
									to='/'
									className='mx-auto block w-fit text-center'
								>
									<img
										src='./logo.svg'
										alt='ChatChit Logo'
										className='scale-50 -mt-8'
									/>
								</Link>
								<h1 className='text-2xl font-bold -mt-8'>
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
									/>

									{/* TODO: Handle error message */}
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
									/>
									{/* TODO: Handle error message */}
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
									/>

									{/* TODO: Handle error message */}
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
									/>

									{/* TODO: Handle error message */}
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
									/>

									{/* TODO: Handle error message */}
								</div>
							</div>

							{/* Sign Up Button */}
							<Button type='submit' className='w-full'>
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
