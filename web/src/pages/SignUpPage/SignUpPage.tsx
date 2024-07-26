import {
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Stack,
	useToast,
	Text,
} from '@chakra-ui/react'
import { FormEvent, useMemo, useState } from 'react'
import { useMutation } from 'react-query'
import useAuthStore from '../../stores/authStore'
import { Link, useNavigate } from '@tanstack/react-router'

export const SignUpPage: React.FC = () => {
	const navigate = useNavigate()
	const toast = useToast()

	const registerMutation = useMutation(
		(formData: { email: string; name: string; password: string }) => {
			return useAuthStore
				.getState()
				.register(formData.email, formData.name, formData.password)
		},
		{
			onSuccess: () => {
				toast({
					title: 'Регистрация прошла успешно!',
					status: 'success',
					duration: 1000,
					isClosable: true,
				})
				navigate({
					startTransition: true,
					to: '/',
				})
			},
			onError: () => {
				toast({
					title: 'Registration failed',
					description: 'Failed to register. Please try again later.',
					status: 'error',
					duration: 1000,
					isClosable: true,
				})
			},
		}
	)

	const [email, setEmail] = useState('')
	const [name, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const confirmationError = useMemo(() => {
		return password === confirmPassword ? '' : 'Пароли не совпадают'
	}, [password, confirmPassword])

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		registerMutation.mutate({ email, name, password })
	}

	return (
		<Box maxW='md' mx='auto' mt={8} p={6} borderWidth='1px' borderRadius='lg'>
			<form onSubmit={handleSubmit}>
				<Stack spacing={6}>
					<FormControl id='email' isRequired>
						<FormLabel>Email address</FormLabel>
						<Input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</FormControl>
					<FormControl id='name' isRequired>
						<FormLabel>Username</FormLabel>
						<Input
							value={name}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</FormControl>
					<FormControl id='password' isRequired>
						<FormLabel>Password</FormLabel>
						<Input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</FormControl>
					<FormControl
						id='confirmPassword'
						isRequired
						isInvalid={!!confirmationError}
					>
						<FormLabel>Confirm Password</FormLabel>
						<Input
							type='password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						<FormErrorMessage>{confirmationError}</FormErrorMessage>
					</FormControl>
					<Button
						type='submit'
						isLoading={registerMutation.isLoading}
						loadingText='Register'
						colorScheme='teal'
					>
						Зарегистрироваться
					</Button>
					<Flex justify='center' gap={2}>
						<Text>Уже есть аккаунт?</Text>
						<Link to='/login' style={{ color: 'teal' }}>
							Войти
						</Link>
					</Flex>
				</Stack>
			</form>
		</Box>
	)
}
