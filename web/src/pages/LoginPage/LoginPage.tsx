import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Stack,
	useToast,
	Text,
} from '@chakra-ui/react'
import { FormEvent, useState } from 'react'
import { useMutation } from 'react-query'
import useAuthStore from '../../stores/authStore'
import { Link, useNavigate } from '@tanstack/react-router'

export const LoginPage = () => {
	const navigate = useNavigate()
	const toast = useToast()	

	const loginMutation = useMutation(
		(formData: { email: string; password: string }) => {
			return useAuthStore.getState().login(formData.email, formData.password)
		},
		{
			onSuccess: () => {
				toast({
					title: 'Вы успешно авторизированны!',
					status: 'success',
					duration: 1000,
					isClosable: true,
				})
				navigate({
					startTransition: true,
					to: '/',
				})
			},
			onError: (_) => {
				toast({
					title: 'Ошибка авторизации',
					description: 'Failed to register. Please try again later.',
					status: 'error',
					duration: 1000,
					isClosable: true,
				})
			},
		}
	)

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		loginMutation.mutate({ email, password })
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
					<FormControl id='password' isRequired>
						<FormLabel>Password</FormLabel>
						<Input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</FormControl>
					<Button
						type='submit'
						isLoading={loginMutation.isLoading}
						loadingText='Register'
						colorScheme='teal'
					>
						Войти
					</Button>
					<Flex justify='center' gap={2}>
						<Text>Еще нет аккаунта?</Text>
						<Link to='/signup' style={{ color: 'teal' }}>
							Зарегистрироваться
						</Link>
					</Flex>
				</Stack>
			</form>
		</Box>
	)
}
