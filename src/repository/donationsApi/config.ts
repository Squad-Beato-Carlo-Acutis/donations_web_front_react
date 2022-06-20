import {
	API_WEB_DONATIONS_URL,
	TOKEN_COOKIE_NAME,
	TOKEN_CREATE_COOKIE_NAME,
} from '../../helpers/varables'
import axios from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { tokenIsExpired } from '../../helpers/utils'
import { getNewToken, signOut } from './users'

export function getAPIDonationsWebClient(ctx?: any) {
	const { [TOKEN_COOKIE_NAME]: token } = parseCookies(ctx)


	const api = axios.create({
		baseURL: API_WEB_DONATIONS_URL,
	})

	api.interceptors.request.use(async (config) => {
		const { [TOKEN_CREATE_COOKIE_NAME]: createDateToken } =
			parseCookies(ctx)

		if (!createDateToken) return config

		const tokenExpired = tokenIsExpired(new Date(createDateToken))
		if (
			tokenExpired &&
			!config.url.includes('api/v1/login/tokenpersistence')
		) {
			const dataPercistence = await getNewToken()

			if (!dataPercistence?.auth || !dataPercistence?.token) return config

			setCookie(undefined, TOKEN_COOKIE_NAME, dataPercistence.token, {
				maxAge: 60 * 60 * 1, // 1 hour
			})

			setCookie(
				undefined,
				TOKEN_CREATE_COOKIE_NAME,
				new Date().toString(),
				{
					maxAge: 60 * 60 * 1, // 1 hour
				}
			)
		}
		return config
	})

	api.interceptors.response.use(
		(response) => response,
		function (error) {
			if (
				error.response.status === 401 &&
				error.config &&
				!error.config.url.includes('api/v1/login')
			)
				signOut()
			return Promise.reject(error)
		}
	)

	if (token) {
		api.defaults.headers['x-access-token'] = token
	}

	return api
}

export const ApiDonationsWeb = getAPIDonationsWebClient()
