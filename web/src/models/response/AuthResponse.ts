import { User } from '../User'

export type AuthResponse = {
	access_token: string
	refresh_token: string
	user: User
}
