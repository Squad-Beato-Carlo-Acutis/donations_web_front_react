import { ApiDonationsWeb } from './config'

export type CadBasicBasketFormData = {
	id?: number
	description: string
	products?: {
		id?: number
		quantity: number
		priority: number
		ind_essential: boolean
		product: {
			description: string
			link_image: string
		}[]
	}[]
}

type TypeGetAllBasicBaskets = {
	data: CadBasicBasketFormData[]
	totalPages: number
}

type CadInsertProductBasicBasket = {
	productId: number
	quantity: number
	priority: number
	ind_essential: boolean
}


export const getBasicBaskets = async (
	pLimit?: number,
	pPage?: number
): Promise<TypeGetAllBasicBaskets> => {
	const limit = pLimit ? `limit=${pLimit}` : ''
	const page = pPage ? `page=${pPage}` : ''

	let query = `${pLimit || pPage ? '?' : ''}`

	if (limit) {
		query += limit
		query += page ? `&${page}` : ''
	} else if (page) {
		query += page
	}

	const { data: basicBaskets } = await ApiDonationsWeb.get<TypeGetAllBasicBaskets>(
		`/api/v1/basicbasket${query}`
	)

	return basicBaskets
}

export const createBasicBasket = async (basicBasket: CadBasicBasketFormData) => {
	const { data } = await ApiDonationsWeb.post(`/api/v1/basicbasket`, basicBasket)

	return data
}

export const updateBasicBasket = async (
	basicBasket: CadBasicBasketFormData,
	basicBasketId: number
) => {
	const { data } = await ApiDonationsWeb.patch(
		`/api/v1/basicbasket/${basicBasketId}`,
		basicBasket
	)

	return data
}

export const deleteBasicBasket = async (basicBasketId: number) => {
	const { data } = await ApiDonationsWeb.delete(
		`/api/v1/basicbasket/${basicBasketId}`
	)

	return data
}

export const insertProductInBasicBasket = async (basicBasketId: number, productBasicBasket: CadInsertProductBasicBasket) => {
	const { data } = await ApiDonationsWeb.post(`/api/v1/basicbasket/${basicBasketId}/product`, productBasicBasket)

	return data
}

export const deleteProductInBasicBasket = async (basicBasketId: number, productId: number) => {
	const { data } = await ApiDonationsWeb.delete(`/api/v1/basicbasket/${basicBasketId}/product/${productId}`)

	return data
}
