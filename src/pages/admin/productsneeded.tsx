import {
	Box,
	Text,
	Input,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	useDisclosure,
	Heading,
	Select,
	NumberInput,
	NumberInputField,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import Header from '../../components/Header'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import CustomList from '../../components/CustomList'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import {
	MAIN_ADMIN_LOGIN_ROUTE,
	TOKEN_COOKIE_NAME,
} from '../../helpers/varables'
import { Pagination } from '../../components/Pagination'
import {
	createOrUpdateProductNeeded,
	getProductsNeeded,
	mergeTwoArrays,
} from '../../repository/donationsApi/productsNeeded'
import { getImageLinkApi } from '../../helpers/utils'
import {
	CadProductFormData,
	getProducts,
} from '../../repository/donationsApi/products'
import {
	GetBasicBasketFormData,
	getBasicBaskets,
} from '../../repository/donationsApi/basicbasket'
import { getConferences } from '../../repository/donationsApi/conferences'
import { TypeCurrentProduct } from '../../types/global'
import { newCurrentProducts } from '../../helpers/emptyObjects'
import PageLoading from '../../components/PageLoading/PageLoading'

const schema = yup
	.object({
		description: yup.string().required(),
	})
	.required()

export default function ProductsNeeded() {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const { register, handleSubmit, setValue, reset } = useForm({
		resolver: yupResolver(schema),
	})
	const [customData, setCustomData] = useState<any[]>()
	const [isLoading, setIsLoading] = useState(true)
	const [isFullLoading, setIsFullLoading] = useState(false)
	const [isNewProductsNeeded, setIsNewProductsNeeded] = useState(false)
	const [totalPages, setTotalPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [dataLimit, setDataLimit] = useState(10)

	const [products, setProducts] = useState<CadProductFormData[]>()
	const [basicBasket, setBasicBasket] = useState<GetBasicBasketFormData[]>()
	const [currentProduct, setCurrentProduct] =
		useState<TypeCurrentProduct>(newCurrentProducts)
	const [currentBasicBasket, setCurrentBasicBasket] = useState<
		TypeCurrentProduct[]
	>([])
	const [currentProducts, setCurrentProducts] = useState<
		TypeCurrentProduct[]
	>([])
	const [currentQuantity, setCurrentQuantity] = useState<number>(1)

	const [additionType, setAdditionType] = useState<string>('products')

	const getAllConfereces = async () => {
		try {
			setIsLoading(true)
			const { data, totalPages: pTotalPages } = await getConferences(
				dataLimit,
				currentPage
			)
			setTotalPages(pTotalPages)
			setCustomData(data)

			setIsLoading(false)
		} catch (err) {
			console.error(err)
			setIsLoading(false)
		}
	}

	const getData = async () => {
		try {
			const dataProducts = await getProducts()
			setProducts(dataProducts.data)

			const dataProductsNeeded = await getBasicBaskets()
			setBasicBasket(dataProductsNeeded.data)
		} catch (err) {
			console.error(err)
		}
	}
	useEffect(() => {
		getData()
	}, [])

	useEffect(() => {
		getAllConfereces()
	}, [currentPage, dataLimit])

	const hadlerSendForm = async (conferece: any) => {
		setIsFullLoading(true)

		try {
			const newsProducts = currentProducts.map((product) => ({
				productId: product.productId,
				quantity: product.quantity,
			}))

			await createOrUpdateProductNeeded({
				conferenceId: conferece.id,
				product: newsProducts,
			})

			Swal.fire(
				'Sucesso',
				`Produtos ${
					isNewProductsNeeded ? 'cadastrados' : 'atualizados'
				} com sucesso`,
				'success'
			).then(() => {
				customCloseModal()
			})
		} catch (err) {
			Swal.fire(
				'Erro',
				'Ocorreu um erro durante a solicitação de cadastro, tente novamente mais tarde ou contate um suporte.',
				'error'
			)
			console.error(err)
		}
		setIsFullLoading(false)
	}

	const customCloseModal = () => {
		reset()
		setCurrentProduct(newCurrentProducts)
		setCurrentBasicBasket([])
		setAdditionType('products')
		onClose()
		getAllConfereces()
	}

	const customOpenEditModal = async (index: number) => {
		setIsFullLoading(true)
		const data = customData[index]
		for (const field in data) {
			setValue(field, data[field])
		}

		const productsNeededConference = await getProductsNeeded({
			conferenceId: data.id,
		})

		setIsNewProductsNeeded(false)
		loadCurrentProductModal(false, productsNeededConference)
		setIsFullLoading(false)
		onOpen()
	}

	const customOpenNewModal = () => {
		setIsNewProductsNeeded(true)
		loadCurrentProductModal(true)
		onOpen()
	}

	const loadCurrentProductModal = (isNew: boolean, data = null) => {
		if (isNew) {
			setCurrentProducts([])
			return
		}

		const arrayTemp = []
		data?.map(
			({
				productDescription,
				productId,
				productLinkImage,
				productFullMeasurement,
				quantity,
			}) => {
				arrayTemp.push({
					link_image: productLinkImage,
					productId,
					quantity,
					title: productDescription,
					description: productFullMeasurement,
				})
			}
		)

		setCurrentProducts(arrayTemp)
	}

	const renderBoxControlProducts = () => {
		const addProduct = () => {
			if (additionType === 'products') {
				if (!currentProduct?.productId) return

				const product = currentProducts?.find((item) => {
					return item.productId === currentProduct?.productId
				})

				if (product !== undefined) {
					const newListProducts = currentProducts.filter(
						(item) => item.productId !== currentProduct?.productId
					)

					setCurrentProducts([
						...newListProducts,
						{
							...currentProduct,
							quantity:
								currentProduct.quantity + product.quantity,
						},
					])

					return
				}

				setCurrentProducts([...currentProducts, currentProduct])

				return
			}

			if (!currentBasicBasket?.length) return

			setCurrentProducts(
				mergeTwoArrays(currentProducts, currentBasicBasket)
			)
		}

		const removeProduct = (index: number) => {
			setCurrentProducts(
				currentProducts.filter((product) => {
					return (
						product.productId !== currentProducts[index]?.productId
					)
				})
			)
		}

		const selectProduct = ({ target: { value } }) => {
			if (!value) return
			const product = JSON.parse(value)
			setCurrentProduct({
				...currentProduct,
				productId: parseInt(product?.id),
				link_image: product?.link_image,
				title: product?.description,
				description: product?.measure?.description,
			})


      console.log("TCL: selectProduct -> ", {
				...currentProduct,
				productId: parseInt(product?.id),
				link_image: product?.link_image,
				title: product?.description,
				description: product?.measure?.description,
			})
		}

		const selectBasicBasket = ({ target: { value } }) => {
			if (!value) return
			const product = JSON.parse(value)

			if (!product?.length) return

			const arrayTemp = []
			product?.map(
				({
					product: {
						description,
						link_image,
						id,
						measure: { description: productMeasurement },
					},
					quantity,
				}) => {
					arrayTemp.push({
						link_image,
						productId: id,
						quantity: quantity * currentQuantity,
						title: description,
						description: productMeasurement,
					})
				}
			)

      console.log("TCL: selectBasicBasket -> arrayTemp", arrayTemp)
			setCurrentBasicBasket(arrayTemp)
		}

		const renderOptionsProduct = () => {
			if (additionType === 'products') {
				return products?.map((product) => {
					return (
						<option
							key={`${product.id}-${product.description}`}
							value={JSON.stringify(product)}
						>
							{product.description}
						</option>
					)
				})
			}

			return basicBasket?.map((basket) => {
				return (
					<option
						key={`${basket.id}-${basket.description}`}
						value={JSON.stringify(basket.products)}
					>
						{basket.description}
					</option>
				)
			})
		}

		return (
			<Box
				display="flex"
				padding="20px"
				border="1px solid #b3b5c6"
				margin="22px 20px"
				flexDirection="column"
				borderRadius="5px"
			>
				<Box
					w="100%"
					display="flex"
					gap={'10px'}
					justifyContent="center"
					alignItems="center"
					mb="9px"
				>
					<Box minW="150px">
						<Text>Adicionar por</Text>
						<Select
							w="100%"
							h="56px"
							mt="4px"
							onChange={({ target: { value } }) => {
								setAdditionType(value)
							}}
						>
							<option value="products">Produtos</option>
							<option value="basicbasket">Cesta Básica</option>
						</Select>
					</Box>
					<Box w="100%">
						<Text>
							{additionType === 'products'
								? 'Produto'
								: 'Cesta básica'}
						</Text>
						<Select
							w="100%"
							h="56px"
							mt="4px"
							placeholder={`Selecione ${
								additionType === 'products'
									? 'um produto'
									: 'uma cesta básica'
							}...`}
							onChange={
								additionType === 'products'
									? selectProduct
									: selectBasicBasket
							}
						>
							{renderOptionsProduct()}
						</Select>
					</Box>
					<Box>
						<Text>Quantidade</Text>
						<NumberInput
							h="56px"
							minW="150px"
							mt="4px"
							maxW={32}
							defaultValue={1}
							min={1}
						>
							<NumberInputField
								onChange={({ target: { value } }) => {
									setCurrentProduct({
										...currentProduct,
										quantity: parseInt(value),
									})

									setCurrentQuantity(parseInt(value))
								}}
								h="56px"
							/>
						</NumberInput>
					</Box>
					<Box
						display="flex"
						flexDirection="column"
						alignItems="center"
					>
						<Button
							bg="#FFC632"
							colorScheme="yellow"
							size="md"
							m="0 5px"
							onClick={addProduct}
						>
							Adicionar
						</Button>
					</Box>
				</Box>
				<Box>
					<CustomList
						callBackDelete={removeProduct}
						isLoading={isLoading}
						colums={[1, 2, 4, 5]}
						data={currentProducts?.map(
							({ link_image, title, description, quantity }) => ({
								avatarLink: getImageLinkApi(link_image),
								name: title,
								description: `${quantity} ${description}`,
							})
						)}
						typeList="box-card"
					/>
				</Box>
			</Box>
		)
	}

	return (
		<>
			<PageLoading isLoading={isFullLoading}/>
			<Box w="100%" minHeight="100vh" bg="#E5E5E5">
				<Header />
				<Box
					w="100%"
					maxW={{ base: '100%', md: '1150px' }}
					bg="#FFFFFF"
					margin="0 auto"
					mt="-50px"
					borderRadius="8px"
					padding="10px"
				>
					<Heading fontSize="32px" m="20px" paddingTop="20px">
						Cestas Básicas
					</Heading>
					<CustomList
						callBackEdit={customOpenEditModal}
						callBackNew={customOpenNewModal}
						isLoading={isLoading}
						data={customData?.map((item) => ({
							name: item.description,
							avatarLink: item.link_avatar,
						}))}
						typeList="avatar-card"
					/>
					<Pagination
						pCurrentPage={1}
						totalPages={totalPages}
						dataLimit={dataLimit}
						callBackDataLimit={setDataLimit}
						callBackPage={setCurrentPage}
					/>
				</Box>
			</Box>

			<Modal isOpen={isOpen} onClose={customCloseModal} size="full">
				<ModalOverlay />
				<form onSubmit={handleSubmit(hadlerSendForm)}>
					<ModalContent>
						<ModalHeader>
							{isNewProductsNeeded ? 'Adicionar' : 'Atualizar'}{' '}
							Produto
						</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							{!isNewProductsNeeded && (
								<Box display="flex">
									<Box h="70px" margin="22px 20px" w="100%">
										<Text>ID:</Text>
										<Input
											type="text"
											readOnly={true}
											background="#f5f5f5"
											placeholder="ID"
											{...register('id')}
											w="100%"
											h="56px"
											mt="4px"
										></Input>
									</Box>
								</Box>
							)}
							<Box display="flex">
								<Box h="70px" margin="22px 20px" w="100%">
									<Text>Descrição</Text>
									<Input
										type="text"
										readOnly={true}
										background="#f5f5f5"
										placeholder="Ex: Arroz, Feijão..."
										{...register('description')}
										w="100%"
										h="56px"
										mt="4px"
									></Input>
								</Box>
							</Box>
							<>{renderBoxControlProducts()}</>
						</ModalBody>

						<ModalFooter>
							<Button
								bg="#FFC632"
								disabled={isFullLoading}
								colorScheme="yellow"
								size="md"
								m="0 5px"
								type="submit"
							>
								{isNewProductsNeeded ? 'Criar' : 'Salvar'}
							</Button>
							<Button
								onClick={customCloseModal}
								bg="#f5222d"
								color="#fff"
								colorScheme="red"
								size="md"
								m="0 5px"
							>
								Cancelar
							</Button>
						</ModalFooter>
					</ModalContent>
				</form>
			</Modal>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const cookie = parseCookies(ctx)
	const token = cookie[TOKEN_COOKIE_NAME]

	if (!token) {
		return {
			redirect: {
				destination: MAIN_ADMIN_LOGIN_ROUTE,
				permanent: false,
			},
		}
	}

	return {
		props: {},
	}
}
