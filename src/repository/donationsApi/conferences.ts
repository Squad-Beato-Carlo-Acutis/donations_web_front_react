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

const tempToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpdiI6IjNlNWVjODIyMDZjZDQ5MTBmYzgzN2JlM2U5YzAxNDk3IiwiY29udGVudCI6ImZjNjVmNTEyYjEwODRkYTI1MGUzZWExZiIsImlhdCI6MTY1NTUwMDkwMSwiZXhwIjoxNjU1NTAxODAxfQ.JzoIRzXaCnjUVv07yY7zO2xs7iJJOLT_fjqotwEO-Kc'

export const getConferences = async (): Promise<CadConferenceFormData[]> => {
	const { data } = await axios.get(
		`${apiConfig.API_URL}/api/v1/users/1/conferences`,
		{
			headers: {
				'x-access-token': tempToken,
			},
		}
	)

	return data
}

export const createConference = async (
	userId: number,
	conference: CadConferenceFormData
) => {
	const { data } = await axios.post(
		`${apiConfig.API_URL}/api/v1/users/${userId}/conferences`,
		conference,
		{
			headers: {
				'x-access-token': tempToken,
			},
		}
	)

	return data
}

export const updateConference = async (
	userId: number,
	conference: CadConferenceFormData,
	conferenceId: number
) => {
	const { data } = await axios.patch(
		`${apiConfig.API_URL}/api/v1/users/${userId}/conferences/${conferenceId}`,
		conference,
		{
			headers: {
				'x-access-token': tempToken,
			},
		}
	)

	return data
}

export const deleteConference = async (
	userId: number,
	conferenceId: number
) => {
	const { data } = await axios.delete(
		`${apiConfig.API_URL}/api/v1/users/${userId}/conferences/${conferenceId}`,
		{
			headers: {
				'x-access-token': tempToken,
			},
		}
	)

	return data
}
