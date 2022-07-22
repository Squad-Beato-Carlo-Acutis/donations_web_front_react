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

export type GetMovementsFormData = {
	productId: number
	productDescription: string
	productMeasurement: string
	productFullMeasurement: string
	productLinkImage: string
	quantity: number
}

type TypeGetAllProducts = {
	data: GetMovementsFormData[]
	totalPages: number
}

type TypeParamGetProductsNeeded = {
	conferenceId: number
	pLimit?: number
	pPage?: number
}
export const getAllMovements = async ({
	conferenceId,
	pLimit,
	pPage,
}: TypeParamGetProductsNeeded): Promise<TypeGetAllProducts> => {
	const limit = pLimit ? `limit=${pLimit}` : ''
	const page = pPage ? `page=${pPage}` : ''

	let query = `${pLimit || pPage ? '?' : ''}`

	if (limit) {
		query += limit
		query += page ? `&${page}` : ''
	} else if (page) {
		query += page
	}

	const { data: movements } = await ApiDonationsWeb.get<TypeGetAllProducts>(
		`/api/v1/conference/${conferenceId}/stockmovement${query}`
	)

	return movements
}

type TypeParamGenerateStockMovements = {
	conferenceId: number
	movement: {
		movementDescription: string
		products: {
			productId: number
			movement_value: number
		}[]
	}
}
export const generateStockMovements = async ({
	conferenceId,
	movement,
}: TypeParamGenerateStockMovements) => {
	if (!movement?.products?.length) return

	const { data } = await ApiDonationsWeb.post(
		`/api/v1/conference/${conferenceId}/stockmovement`,
		movement
	)

	return data
}

type TypeParamDeleteProduct = {
	conferenceId: number
	stockmovementId: number
}

export const inactivateStockMovement = async ({
	conferenceId,
	stockmovementId,
}: TypeParamDeleteProduct) => {
	const { data } = await ApiDonationsWeb.delete(
		`/api/v1/conference/${conferenceId}/stockmovement/${stockmovementId}`
	)

	return data
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
