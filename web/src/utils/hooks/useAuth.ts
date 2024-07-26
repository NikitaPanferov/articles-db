import useAuthStore from "../../stores/authStore"

export const useAuth = () => {
	return useAuthStore(store => store)
}

export type AuthContext = ReturnType<typeof useAuth>