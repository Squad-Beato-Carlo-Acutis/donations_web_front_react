import { controllerCustomStorage } from '../../repository/donationsApi/login'
import axios from 'axios'
import apiConfig from './apiConfig'

export type CadConferenceFormData = {
	id?: number
	description: string
	link_avatar: string
	about: string
	title_address: string
	address: string
	opening_hours: string
}

export const getConferences = async (): Promise<CadConferenceFormData[]> => {
	const credentials = controllerCustomStorage.getCredentialsCustomStorage()

	const { data } = await axios.get(
		`${apiConfig.API_URL}/api/v1/conferences`,
		{
			headers: {
				'x-access-token': credentials?.token,
			},
		}
	)

	return data
}

export const createConference = async (conference: CadConferenceFormData) => {
	const credentials = controllerCustomStorage.getCredentialsCustomStorage()

	const { data } = await axios.post(
		`${apiConfig.API_URL}/api/v1/conferences`,
		conference,
		{
			headers: {
				'x-access-token': credentials?.token,
			},
		}
	)

	return data
}

export const updateConference = async (
	conference: CadConferenceFormData,
	conferenceId: number
) => {
	const credentials = controllerCustomStorage.getCredentialsCustomStorage()

	const { data } = await axios.patch(
		`${apiConfig.API_URL}/api/v1/conferences/${conferenceId}`,
		conference,
		{
			headers: {
				'x-access-token': credentials?.token,
			},
		}
	)

	return data
}

export const deleteConference = async (conferenceId: number) => {
	const credentials = controllerCustomStorage.getCredentialsCustomStorage()

	const { data } = await axios.delete(
		`${apiConfig.API_URL}/api/v1/conferences/${conferenceId}`,
		{
			headers: {
				'x-access-token': credentials?.token,
			},
		}
	)

	return data
}
