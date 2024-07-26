import { create } from 'zustand'
import { User } from '../models/User'
import AuthService from '../services/AuthService'

interface AuthState {
	user: User | null
	isAuth: boolean
	login: (email: string, password: string) => Promise<void>
	register: (email: string, name: string, password: string) => Promise<void>
	logout: () => Promise<void>
	checkAuth: () => Promise<boolean>
}

const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuth: false,
	login: async (email: string, password: string) => {
		const response = await AuthService.login(email, password)
		localStorage.setItem('access_token', response.data.access_token)
		const { user } = response.data
		set({ user, isAuth: true })
	},
	register: async (email: string, name: string, password: string) => {
		const response = await AuthService.registration(email, name, password)
		localStorage.setItem('access_token', response.data.access_token)
		const { user } = response.data
		set({ user, isAuth: true })
	},
	logout: async () => {
		await AuthService.logout()
		localStorage.removeItem('access_token')
		set({ user: null, isAuth: false })
	},
	checkAuth: async () => {
		try {
			const response = await AuthService.checkAuth()
			set({ isAuth: true, user: response.data })
			return true
		} catch (error) {
			set({ isAuth: false, user: null })
			return false
		}
	},
}))

export default useAuthStore
