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
	Checkbox,
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
	GetBasicBasketFormData,
	createBasicBasket,
	deleteBasicBasket,
	getBasicBaskets,
	updateBasicBasket,
	TypeCurrentProduct,
	newCurrentProducts,
	haveProductsChanged,
	updateAllProductInBasicBasket,
} from '../../repository/donationsApi/basicbasket'
import { getImageLinkApi } from '../../helpers/utils'
import {
	CadProductFormData,
	getProducts,
} from '../../repository/donationsApi/products'
import { BiPackage } from 'react-icons/bi'

const schema = yup
	.object({
		description: yup.string().required(),
	})
	.required()

export default function BasicBaskets() {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const { register, handleSubmit, setValue, reset, getValues } = useForm({
		resolver: yupResolver(schema),
	})
	const [customData, setCustomData] = useState<GetBasicBasketFormData[]>()
	const [isLoading, setIsLoading] = useState(true)
	const [isNewBasicBasket, setIsNewBasicBasket] = useState(false)
	const [totalPages, setTotalPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [dataLimit, setDataLimit] = useState(10)

	const [products, setProducts] = useState<CadProductFormData[]>()
	const [currentProduct, setCurrentProduct] =
		useState<TypeCurrentProduct>(newCurrentProducts)

	const [currentProducts, setCurrentProducts] = useState<
		TypeCurrentProduct[]
	>([])

	const [isSaving, setIsSaving] = useState(false)

	const getAllBasicBaskets = async () => {
		try {
			setIsLoading(true)
			const { data, totalPages: pTotalPages } = await getBasicBaskets(
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
		} catch (err) {
			console.error(err)
		}
	}
	useEffect(() => {
		getData()
	}, [])

	useEffect(() => {
		getAllBasicBaskets()
	}, [currentPage, dataLimit])

	const hadlerSendForm = async (basicbasket: any) => {
		setIsSaving(true)

		const updateProducts = async (basicBasketId: number) => {
			if (haveProductsChanged(basicbasket.products, currentProducts)) {
				const newsProducts = currentProducts.map((product) => ({
					productId: product.productId,
					quantity: product.quantity,
					priority: product.priority,
					ind_essential: product.ind_essential,
				}))

				await updateAllProductInBasicBasket(basicBasketId, newsProducts)
			}
		}

		try {
			if (isNewBasicBasket) {
				const dataBasicBasket = await createBasicBasket({
					description: basicbasket.description,
				})

				updateProducts(dataBasicBasket.id)
			} else {
				const dataBasicBasket = await updateBasicBasket(
					{
						description: basicbasket.description,
					},
					basicbasket.id
				)

				updateProducts(dataBasicBasket.id)
			}
			Swal.fire(
				'Sucesso',
				`Produto ${
					isNewBasicBasket ? 'cadastrado' : 'atualizado'
				} com sucesso`,
				'success'
			).then(() => {
				customCloseModal()
			})
			setIsSaving(false)
		} catch (err) {
			setIsSaving(false)
			Swal.fire(
				'Erro',
				'Ocorreu um erro durante a solicitação de cadastro, tente novamente mais tarde ou contate um suporte.',
				'error'
			)
			console.error(err)
		}
	}

	const handlerDeleteBasicBasket = async (index: number) => {
		Swal.fire({
			title: 'Atenção!!!',
			text: 'Todos os dados dessa cesta básica, como produtos vinculados serão deletados sem a possibilidades de recuperação, deseja continuar?',
			showDenyButton: true,
			confirmButtonText: 'Cancelar',
			denyButtonText: `Continuar`,
		})
			.then(async (result) => {
				if (result.isDenied) {
					const { id } = customData[index]
					await deleteBasicBasket(id)
					getAllBasicBaskets()
					Swal.fire(
						'Cesta básica deletada com sucesso!',
						'',
						'success'
					)
				}
			})
			.catch((err) => {
				Swal.fire(
					'Erro',
					'Ocorreu um erro durante a solicitação de exclusão, tente novamente mais tarde ou contate um suporte.',
					'error'
				)
				console.error(err)
			})
	}

	const customCloseModal = () => {
		reset()
		setCurrentProduct(newCurrentProducts)
		onClose()
		getAllBasicBaskets()
	}

	const customOpenEditModal = (index: number) => {
		const data = customData[index]
		for (const field in data) {
			setValue(field, data[field])
		}
		setIsNewBasicBasket(false)
		loadCurrentProductModal(false)
		onOpen()
	}

	const customOpenNewModal = () => {
		setIsNewBasicBasket(true)
		loadCurrentProductModal(true)
		onOpen()
	}

	const loadCurrentProductModal = (isNew: boolean) => {
		if (isNew) {
			setCurrentProducts([])
			return
		}

		const arrayTemp = []
		getValues()?.products?.map(
			({
				product: {
					link_image,
					description,
					measure: { description: desMeasure },
				},
				tb_product_id: productId,
				quantity,
				priority,
				ind_essential,
			}) => {
				arrayTemp.push({
					link_image,
					productId,
					quantity,
					priority,
					ind_essential,
					title: description,
					description: desMeasure,
				})
			}
		)

		setCurrentProducts(arrayTemp)
	}

	const renderBoxControlProducts = () => {
		const addProduct = () => {
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
						quantity: currentProduct.quantity + product.quantity,
					},
				])

				return
			}

			setCurrentProducts([...currentProducts, currentProduct])
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
		}

		const renderOptionsProduct = () => {
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
					<Box w="100%">
						<Text>Produto</Text>
						<Select
							w="100%"
							h="56px"
							mt="4px"
							placeholder="Selecione um produto..."
							onChange={selectProduct}
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
								}}
								h="56px"
							/>
						</NumberInput>
					</Box>
					<Box>
						<Text>Prioridade</Text>
						<NumberInput
							h="56px"
							mt="4px"
							maxW={32}
							defaultValue={1}
							min={1}
						>
							<NumberInputField
								onChange={({ target: { value } }) => {
									setCurrentProduct({
										...currentProduct,
										priority: parseInt(value),
									})
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
						<Text>Essencial</Text>
						<Checkbox
							h="56px"
							mt="4px"
							size="lg"
							colorScheme="orange"
							defaultChecked
							onChange={({ target: { checked } }) => {
								setCurrentProduct({
									...currentProduct,
									ind_essential: checked,
								})
							}}
						/>
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
						callBackDelete={handlerDeleteBasicBasket}
						callBackNew={customOpenNewModal}
						isLoading={isLoading}
						colums={[1, 2, 4, 5]}
						data={customData?.map((item) => ({
							name: item.description,
							icon: <BiPackage fontSize="50px" />,
						}))}
						typeList="box-card"
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
							{isNewBasicBasket ? 'Adicionar' : 'Atualizar'}{' '}
							Produto
						</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							{!isNewBasicBasket && (
								<Box display="flex">
									<Box h="70px" margin="22px 20px" w="100%">
										<Text>ID:</Text>
										<Input
											type="text"
											readOnly={true}
											disabled={true}
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
									<Text>Nome do produto</Text>
									<Input
										type="text"
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
								disabled={isSaving}
								colorScheme="yellow"
								size="md"
								m="0 5px"
								type="submit"
							>
								{isNewBasicBasket ? 'Criar' : 'Salvar'}
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
