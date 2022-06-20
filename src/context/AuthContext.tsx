import { createContext, useEffect, useState } from 'react'
import { setCookie, parseCookies } from 'nookies'
import Router from 'next/router'
import Swal from 'sweetalert2'
import { signIn as signInApi, signOut as signOutApi } from '../repository/donationsApi/users'
import { ApiDonationsWeb } from '../repository/donationsApi/config'
import {
	ADMIN_HOME_MAIN_ROUTE,
	TOKEN_COOKIE_NAME,
	TOKEN_CREATE_COOKIE_NAME,
} from '../helpers/varables'

type User = {
	userId: number
	userName: string
	typeUser: string
}
type SignInData = {
	email: string
	pws: string
}
type AuthContextType = {
	isAuthenticated: boolean
	user: User
	signIn: (data: SignInData) => Promise<void>
	signOut: () => any
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }) {
	const [user, setUser] = useState<User | null>(null)
	const isAuthenticated = !!user

	// useEffect(() => {
	// const {[TOKEN_COOKIE_NAME] : token } = parseCookies()

	// // colocar para atualizar os dados do user
	// }, [])

	async function signIn({ email, pws }: SignInData) {
		const {
			token,
			userId,
			typeUser,
			userName,
			isAuthenticated: isAuthenticatedApi,
		} = await signInApi({
			email,
			pws,
		})

		if (!isAuthenticatedApi) {
			Swal.fire('Ops', 'Usuário ou senha estão inválidos.', 'warning')
			return
		}

		setCookie(undefined, TOKEN_COOKIE_NAME, token, {
			maxAge: 60 * 60 * 1, // 1 hour
		})

		setCookie(undefined, TOKEN_CREATE_COOKIE_NAME, new Date().toString(), {
			maxAge: 60 * 60 * 1, // 1 hour
		})

		ApiDonationsWeb.defaults.headers['x-access-token'] = token

		setUser({
			userId,
			typeUser,
			userName,
		})

		Router.push(ADMIN_HOME_MAIN_ROUTE)
	}

	function signOut() {
		signOutApi()
	}

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, signIn, user, signOut }}
		>
			{children}
		</AuthContext.Provider>
	)
}
