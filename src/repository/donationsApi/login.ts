import axios from 'axios'
import apiConfig from './apiConfig'

const LOCAL_STORAGE_CREDENTIALS_KEY = 'CREDENTIALS_DONATIONS_WEB'

type TypeDataCredentials = {
	token?: string
	userId?: number
	userName?: string
	typeUser?: string
	date?: any
}

export const controllerCustomStorage = {
	setCredentialsCustomStorage: (data: TypeDataCredentials) => {
		localStorage.setItem(
			LOCAL_STORAGE_CREDENTIALS_KEY,
			JSON.stringify({
				token: data.token,
				userId: data.userId,
				userName: data.userName,
				typeUser: data.typeUser,
				date: new Date(),
			})
		)
	},
	getCredentialsCustomStorage: (): TypeDataCredentials | null => {
		const credentials = localStorage.getItem(LOCAL_STORAGE_CREDENTIALS_KEY)

		if (credentials) return JSON.parse(credentials)

		return null
	},
	updateCredentialsCustomStorage: (data: TypeDataCredentials) => {
		const stringCredentials = localStorage.getItem(
			LOCAL_STORAGE_CREDENTIALS_KEY
		)

		if (stringCredentials) {
			const credentials = JSON.parse(stringCredentials)

			if (data?.token) credentials.token = data.token
			if (data?.userId) credentials.userId = data.userId
			if (data?.userName) credentials.userName = data.userName
			if (data?.typeUser) credentials.typeUser = data.typeUser

			credentials.date = new Date()

			localStorage.setItem(
				LOCAL_STORAGE_CREDENTIALS_KEY,
				JSON.stringify(credentials)
			)
		}
	},
	deleteCredentialsCustomStorage: () => {
		localStorage.removeItem(LOCAL_STORAGE_CREDENTIALS_KEY)
	},
}

const validDate = (date: any): boolean => {
	if (!date) return false
	const dateNow: any = new Date()
	return !(parseInt(Math.abs((date.date - dateNow) / 1000).toFixed(0)) >= 900)
}

export const getNewToken = async (token: string) => {
	const { data } = await axios.post(
		`${apiConfig.API_URL}/api/v1/login/tokenpersistence`,
		{
			headers: {
				'x-access-token': token,
			},
		}
	)

	return data
}

export const tokenPercistence = () => {
	axios.interceptors.response.use(
		(response) => {
			return response
		},
		(err) => {
			return new Promise((resolve, reject) => {
				const originalReq = err.config
				if (
					err.response.status == 401 &&
					err.config &&
					!err.config._retry &&
					!err.request.responseURL.includes('tokenpersistence')
				) {
					originalReq._retry = true
					const {
						getCredentialsCustomStorage,
						updateCredentialsCustomStorage,
					} = controllerCustomStorage

					const credentials = getCredentialsCustomStorage()

					if (!credentials) window.location.href = '/admin'

					let res = getNewToken(credentials?.token).then((data) => {
						updateCredentialsCustomStorage({
							token: data.token,
						})

						originalReq.headers['x-access-token'] = data.token
						return axios(originalReq)
					})
					resolve(res)
				} else {
					reject(err)
				}
			})
		}
	)
}

export const login = async (email: string, pws: string) => {
	const { data } = await axios.post(`${apiConfig.API_URL}/api/v1/login`, {
		email,
		pws,
	})

	if (!data?.auth) return false

	const { userId, userName, typeUser } = data.userData

	controllerCustomStorage.setCredentialsCustomStorage({
		token: data.token,
		userName,
		typeUser,
		userId,
	})

	window.location.href = '/conferences'

	return true
}

export const logout = () => {
	controllerCustomStorage.deleteCredentialsCustomStorage()
	window.location.href = '/admin'
}

export const checkSession = (): boolean => {
	const credentials = controllerCustomStorage.getCredentialsCustomStorage()

	if (!credentials) return false

	return true
}
