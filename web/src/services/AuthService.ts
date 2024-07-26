import $api from '../api'
import { AxiosResponse } from 'axios'
import { AuthResponse } from '../models/response/AuthResponse'
import { User } from '../models/User'

export default class AuthService {
	static async login(
		email: string,
		password: string
	): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>('auth/login', { email, password })
	}

	static async registration(
		email: string,
		name: string,
		password: string
	): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>('auth/signup', { email, name, password })
	}

	static async logout(): Promise<void> {
		return $api.get('auth/logout')
	}

	static async checkAuth(): Promise<AxiosResponse<User>> {
		return $api.get<User>('auth/me', { withCredentials: true })
	}
}
