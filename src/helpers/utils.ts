import { API_WEB_DONATIONS_URL, TOKEN_UPDATE_TIME } from './varables'

export const tokenIsExpired = (date: any): boolean => {
	if (!date) return false
	const dateNow: any = new Date()
	return (
		parseInt(Math.abs((date - dateNow) / 1000).toFixed(0)) >=
		TOKEN_UPDATE_TIME
	)
}


export const getImageLinkApi = (imageName: string) => {
	return `${API_WEB_DONATIONS_URL}/api/v1/images/${imageName}`
}
