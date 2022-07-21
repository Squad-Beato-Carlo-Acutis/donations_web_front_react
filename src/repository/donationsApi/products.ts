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

type TypeGetAllMeasures = {
	data: TypeMeasure[]
	totalPages: number
}

type TypeGetAllCategories = {
	data: TypeCategory[]
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

	const { data: products } = await ApiDonationsWeb.get<TypeGetAllProducts>(
		`/api/v1/products${query}`
	)

	return products
}

export const createProduct = async (product: CadProductFormData) => {
	const { data } = await ApiDonationsWeb.post(`/api/v1/products`, product)

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

export const getMeasures = async (
	pLimit?: number,
	pPage?: number
): Promise<TypeMeasure[]> => {
	const limit = pLimit ? `limit=${pLimit}` : ''
	const page = pPage ? `page=${pPage}` : ''

	let query = `${pLimit || pPage ? '?' : ''}`

	if (limit) {
		query += limit
		query += page ? `&${page}` : ''
	} else if (page) {
		query += page
	}

	const { data: measures } = await ApiDonationsWeb.get<TypeGetAllMeasures>(
		`/api/v1/measure${query}`
	)

	return measures.data
}

export const getCategories = async (
	pLimit?: number,
	pPage?: number
): Promise<TypeCategory[]> => {
	const limit = pLimit ? `limit=${pLimit}` : ''
	const page = pPage ? `page=${pPage}` : ''

	let query = `${pLimit || pPage ? '?' : ''}`

	if (limit) {
		query += limit
		query += page ? `&${page}` : ''
	} else if (page) {
		query += page
	}

	const { data: categories } =
		await ApiDonationsWeb.get<TypeGetAllCategories>(
			`/api/v1/category${query}`
		)

	return categories.data
}

export const uploadProductImage = async (productId: number, file: File) => {
  console.log("TCL: uploadProductImage -> file", file)
	if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type))
	throw new Error('Arquivo do tipo inválido')

	const { data } = await ApiDonationsWeb.post(
		`/api/v1/products/${productId}/uploadimg`,
		{
			product_img: file,
		},
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}
	)

	return data
}
