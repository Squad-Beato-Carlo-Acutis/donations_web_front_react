import { ApiDonationsWeb } from './config'

type TypeMeasure = {
	id: number
	description: string
	abbreviation: string
}

type TypeCategory = {
	id: number
	description: string
	posit_level: number
}

export type CadProductFormData = {
	id?: number
	description: string
	tb_measure_id: number
	tb_category_id: number
	link_image?: string
	measure?: TypeMeasure
	category?: TypeCategory
}



type TypeGetAllProducts = {
	data: CadProductFormData[]
	totalPages: number
}

export const getProducts = async (
	pLimit?: number,
	pPage?: number
): Promise<TypeGetAllProducts> => {
	const limit = pLimit ? `limit=${pLimit}` : ''
	const page = pPage ? `page=${pPage}` : ''

	let query = `${pLimit || pPage ? '?' : ''}`

	if (limit) {
		query += limit
		query += page ? `&${page}` : ''
	} else if (page) {
		query += page
	}

	const { data: products } =
		await ApiDonationsWeb.get<TypeGetAllProducts>(
			`/api/v1/products${query}`
		)

	return products
}

export const createProduct = async (product: CadProductFormData) => {
	const { data } = await ApiDonationsWeb.post(
		`/api/v1/products`,
		product
	)

	return data
}

export const updateProduct = async (
	product: CadProductFormData,
	productId: number
) => {
	const { data } = await ApiDonationsWeb.patch(
		`/api/v1/products/${productId}`,
		product
	)

	return data
}

export const deleteProduct = async (productId: number) => {
	const { data } = await ApiDonationsWeb.delete(
		`/api/v1/products/${productId}`
	)

	return data
}
