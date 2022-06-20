import {
	TOKEN_COOKIE_NAME,
	TOKEN_CREATE_COOKIE_NAME,
	MAIN_ADMIN_LOGIN_ROUTE,
} from '../../helpers/varables'
import Router from 'next/router'
import { destroyCookie } from 'nookies'
import { ApiDonationsWeb } from './config'

type TypeDataCredentials = {
	token?: string
	userId?: number
	userName?: string
	typeUser?: string
	date?: any
	isAuthenticated?: boolean
}

type signInData = {
	email: string
	pws: string
}

export const getNewToken = async () => {
	const { data } = await ApiDonationsWeb.post(
		`/api/v1/login/tokenpersistence`
	)

	return data
}

export const signIn = async ({
	email,
	pws,
}: signInData): Promise<TypeDataCredentials> => {
	const { data } = await ApiDonationsWeb.post(`/api/v1/login`, {
		email,
		pws,
	})

	if (!data?.auth)
		return {
			isAuthenticated: data?.auth,
		}

	const { userId, userName, typeUser } = data?.userData

	return {
		isAuthenticated: data?.auth,
		token: data.token,
		userName,
		typeUser,
		userId,
	}
}

export const signOut = () => {
	destroyCookie(undefined, TOKEN_COOKIE_NAME)
	destroyCookie(undefined, TOKEN_CREATE_COOKIE_NAME)
	Router.push(MAIN_ADMIN_LOGIN_ROUTE)
}
