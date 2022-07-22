import { TypeCurrentProduct } from '../../types/global'
import { ApiDonationsWeb } from './config'

export type TypeMeasure = {
	id: number
	description: string
	abbreviation: string
}

export type TypeCategory = {
	id: number
	description: string
	posit_level: number
}

export type GetProductNeededFormData = {
	productId: number
	productDescription: string
	productMeasurement: string
	productFullMeasurement: string
	productLinkImage: string
	quantity: number
}

type TypeGetAllProducts = {
	data: GetProductNeededFormData[]
	totalPages: number
}

type TypeGetAllMeasures = {
	data: TypeMeasure[]
	totalPages: number
}

type TypeGetAllCategories = {
	data: TypeCategory[]
	totalPages: number
}

type TypeParamGetProductsNeeded = {
	conferenceId: number
	pLimit?: number
	pPage?: number
}
export const getProductsNeeded = async ({
	conferenceId,
	pLimit,
	pPage,
}: TypeParamGetProductsNeeded): Promise<GetProductNeededFormData[]> => {
	const limit = pLimit ? `limit=${pLimit}` : ''
	const page = pPage ? `page=${pPage}` : ''

	let query = `${pLimit || pPage ? '?' : ''}`

	if (limit) {
		query += limit
		query += page ? `&${page}` : ''
	} else if (page) {
		query += page
	}

	const { data: products } = await ApiDonationsWeb.get<
		GetProductNeededFormData[]
	>(`/api/v1/conference/${conferenceId}/productsneeded${query}`)

	return products
}

type TypeParamCreateOrUpdateProductNeeded = {
	conferenceId: number
	product: {
		productId: number
		quantity: number
	}[]
}
export const createOrUpdateProductNeeded = async ({
	product,
	conferenceId,
}: TypeParamCreateOrUpdateProductNeeded) => {
	const { data } = await ApiDonationsWeb.post(
		`/api/v1/conference/${conferenceId}/productsneeded`,
		product
	)

	return data
}

type TypeParamDeleteProduct = {
	conferenceId: number
	products: {
		productId: number
	}[]
}
export const deleteProductNeeded = async ({
	conferenceId,
	products,
}: TypeParamDeleteProduct) => {
	const { data } = await ApiDonationsWeb.delete(
		`/api/v1/conference/${conferenceId}/productsneeded`,
		{
			data: products,
		}
	)

	return data
}

export const haveProductsChanged = (
	currentProducts: Array<GetProductNeededFormData>,
	newsProducts: Array<TypeCurrentProduct>
): boolean => {
	if (!newsProducts?.length) return false

	if (!currentProducts?.length) return true

	const haveChangedOrNew = newsProducts.find((product) => {
		return (
			currentProducts.filter((currentProduct) => {
				if (
					product.productId === currentProduct.productId &&
					product.quantity !== currentProduct.quantity
				) {
					return true
				}
			})?.length > 0 ||
			currentProducts.filter((currentProduct) => {
				return product.productId === currentProduct.productId
			})?.length === 0
		)
	})

	const haveDeleted = currentProducts.find((currentProduct) => {
		return (
			newsProducts.filter((product) => {
				return product.productId === currentProduct.productId
			})?.length === 0
		)
	})

	return haveChangedOrNew !== undefined || haveDeleted !== undefined
}

export const mergeTwoArrays = (
	currentProducts: Array<TypeCurrentProduct>,
	newsProducts: Array<TypeCurrentProduct>
): Array<TypeCurrentProduct> => {
	if (!newsProducts?.length) return currentProducts

	if (!currentProducts?.length) return newsProducts

	const newArray: TypeCurrentProduct[] = []
	const addNewProduct = (product: TypeCurrentProduct) => {
		const isExist =
			newArray?.find((productNewArray) => {
				return productNewArray.productId === product.productId
			}) !== undefined

		if (isExist) return

		newArray.push(product)
	}

	newsProducts.forEach((product) => {
		let isExist = false
		currentProducts.forEach((currentProduct) => {
			if (product.productId === currentProduct.productId) {
				addNewProduct({
					...product,
					quantity: product.quantity + currentProduct.quantity,
				})
				isExist = true
			}
		})

		if (!isExist) {
			addNewProduct({
				...product,
			})
		}
	})

	return newArray || []
}
