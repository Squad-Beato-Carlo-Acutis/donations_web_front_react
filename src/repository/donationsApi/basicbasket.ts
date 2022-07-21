import { ApiDonationsWeb } from './config'

export type TypeProductBasicBasket = {
	id?: number
	quantity: number
	priority: number
	ind_essential: boolean
	product: {
		description: string
		link_image: string
	}[]
}

export type GetBasicBasketFormData = {
	id?: number
	description: string
	products?: TypeProductBasicBasket[]
}

export type CadBasicBasketFormData = {
	description: string
}

type TypeGetAllBasicBaskets = {
	data: GetBasicBasketFormData[]
	totalPages: number
}

type CadInsertProductBasicBasket = {
	productId: number
	quantity: number
	priority: number
	ind_essential: boolean
}

export type TypeCurrentProduct = {
	productId: number | null
	quantity: number
	priority: number
	ind_essential: boolean
	link_image: string
	title: string
	description: string
}

export const newCurrentProducts = {
	productId: null,
	quantity: 1,
	priority: 1,
	ind_essential: false,
	link_image: '',
	title: '',
	description: '',
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

	const { data: basicBaskets } =
		await ApiDonationsWeb.get<TypeGetAllBasicBaskets>(
			`/api/v1/basicbasket${query}`
		)

	return basicBaskets
}

export const createBasicBasket = async (
	basicBasket: CadBasicBasketFormData
) => {
	const { data } = await ApiDonationsWeb.post(
		`/api/v1/basicbasket`,
		basicBasket
	)

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

export const insertProductInBasicBasket = async (
	basicBasketId: number,
	productBasicBasket: CadInsertProductBasicBasket
) => {
	const { data } = await ApiDonationsWeb.post(
		`/api/v1/basicbasket/${basicBasketId}/product`,
		productBasicBasket
	)

	return data
}

export const updateAllProductInBasicBasket = async (
	basicBasketId: number,
	productBasicBasket: CadInsertProductBasicBasket[]
) => {
	const { data } = await ApiDonationsWeb.put(
		`/api/v1/basicbasket/${basicBasketId}/product`,
		productBasicBasket
	)

	return data
}

export const deleteProductInBasicBasket = async (
	basicBasketId: number,
	productId: number
) => {
	const { data } = await ApiDonationsWeb.delete(
		`/api/v1/basicbasket/${basicBasketId}/product/${productId}`
	)

	return data
}

export const haveProductsChanged = (
	currentProducts: Array<TypeProductBasicBasket>,
	newsProducts: Array<TypeCurrentProduct>
): boolean => {

	if(!newsProducts?.length) return false

	if (!currentProducts?.length) return true

	const haveChangedOrNew = newsProducts.find((product) => {
		return (
			currentProducts.filter((currentProduct) => {
				if (
					product.productId === currentProduct.id &&
					(product.quantity !== currentProduct.quantity ||
						product.priority !== currentProduct.priority ||
						product.ind_essential !== currentProduct.ind_essential)
				) {
					return true
				}
			})?.length > 0 ||
			currentProducts.filter((currentProduct) => {
				return product.productId === currentProduct.id
			})?.length === 0
		)
	})

	const haveDeleted = currentProducts.find((currentProduct) => {
		return (
			newsProducts.filter((product) => {
				return product.productId === currentProduct.id
			})?.length === 0
		)
	})

	return (haveChangedOrNew !== undefined) || haveDeleted !== undefined
}
