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

type TypeGetAllConferences = {
	data: CadConferenceFormData[]
	totalPages: number
}

export const getConferences = async (
	pLimit?: number,
	pPage?: number
): Promise<TypeGetAllConferences> => {
	const limit = pLimit ? `limit=${pLimit}` : ''
	const page = pPage ? `page=${pPage}` : ''

	let query = `${pLimit || pPage ? '?' : ''}`

	if (limit) {
		query += limit
		query += page ? `&${page}` : ''
	} else if (page) {
		query += page
	}

	const { data: conferences } =
		await ApiDonationsWeb.get<TypeGetAllConferences>(
			`/api/v1/conferences${query}`
		)

	return conferences
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
