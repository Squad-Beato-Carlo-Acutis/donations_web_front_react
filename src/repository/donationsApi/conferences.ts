import { ApiDonationsWeb } from './config'

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
	const { data } = await ApiDonationsWeb.get(`/api/v1/conferences`)

	return data
}

export const createConference = async (conference: CadConferenceFormData) => {
	const { data } = await ApiDonationsWeb.post(
		`/api/v1/conferences`,
		conference
	)

	return data
}

export const updateConference = async (
	conference: CadConferenceFormData,
	conferenceId: number
) => {
	const { data } = await ApiDonationsWeb.patch(
		`/api/v1/conferences/${conferenceId}`,
		conference
	)

	return data
}

export const deleteConference = async (conferenceId: number) => {
	const { data } = await ApiDonationsWeb.delete(
		`/api/v1/conferences/${conferenceId}`
	)

	return data
}
