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
	Img,
	NumberInput,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInputField,
	NumberInputStepper,
	Checkbox,
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Header from '../../components/Header'

import { BiImage } from 'react-icons/bi'

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
	CadBasicBasketFormData,
	createBasicBasket,
	deleteBasicBasket,
	deleteProductInBasicBasket,
	getBasicBaskets,
	insertProductInBasicBasket,
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
		tb_measure_id: yup.number().required(),
		tb_category_id: yup.number().required(),
	})
	.required()

export default function BasicBaskets() {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const { register, handleSubmit, setValue, reset, getValues } = useForm({
		resolver: yupResolver(schema),
	})
	const [customData, setCustomData] = useState<CadBasicBasketFormData[]>()
	const [isLoading, setIsLoading] = useState(true)
	const [isNewBasicBasket, setIsNewBasicBasket] = useState(false)
	const [totalPages, setTotalPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [dataLimit, setDataLimit] = useState(10)

	const [products, setProducts] = useState<CadProductFormData[]>()
	const [currentProduct, setCurrentProduct] = useState<any>({
		productId: 1,
		quantity: 1,
		priority: 1,
		ind_essential: false,
	})

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

	const hadlerSendForm: SubmitHandler<CadBasicBasketFormData> = async (
		product: any
	) => {
		try {
			// if (isNewBasicBasket) {
			// 	await createBasicBasket({
			// 		description: product.description,
			// 		tb_category_id: product.tb_category_id,
			// 		tb_measure_id: product.tb_measure_id,
			// 	})
			// } else {
			// 	await updateBasicBasket(
			// 		{
			// 			description: product.description,
			// 			tb_category_id: product.tb_category_id,
			// 			tb_measure_id: product.tb_measure_id,
			// 		},
			// 		product.id
			// 	)
			// }

			Swal.fire(
				'Sucesso',
				`Produto ${
					isNewBasicBasket ? 'cadastrado' : 'atualizado'
				} com sucesso`,
				'success'
			)
			customCloseModal()
		} catch (err) {
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
			text: 'Todos os dados desse produto, como movimentações de estoque e informações serão deletados sem a possibilidades de recuperação, deseja continuar?',
			showDenyButton: true,
			confirmButtonText: 'Cancelar',
			denyButtonText: `Continuar`,
		})
			.then((result) => {
				if (result.isDenied) {
					const { id } = customData[index]
					deleteBasicBasket(id)
					getData()
					Swal.fire('Produto deletado com sucesso!', '', 'success')
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
		onClose()
		getAllBasicBaskets()
	}

	const customOpenEditModal = (index: number) => {
		const data = customData[index]
		for (var field in data) {
			setValue(field, data[field])
		}
		setIsNewBasicBasket(false)
		onOpen()
	}

	const customOpenNewModal = () => {
		setIsNewBasicBasket(true)
		onOpen()
	}

	const renderBoxControlProducts = () => {
		return (
			<Box
				display="flex"
				padding="20px"
				border="1px solid #b3b5c6"
				margin="22px 20px"
				flexDirection="column"
			>
				<Box
					w="100%"
					display="flex"
					gap={'10px'}
					justifyContent="center"
					alignItems="center"
				>
					<Box w="100%">
						<Text>Produto</Text>
						<Select
							w="100%"
							h="56px"
							mt="4px"
							onChange={({ target: { value } }) => {
								setCurrentProduct({
									...currentProduct,
									productId: parseInt(value),
								})
							}}
						>
							{products?.map((product) => {
								return (
									<option
										key={`${product.id}-${product.description}`}
										value={product.id}
									>
										{product.description}
									</option>
								)
							})}
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
							onClick={async () => {
								await insertProductInBasicBasket(
									getValues().id,
									currentProduct
								)
								await getAllBasicBaskets()
							}}
						>
							Adicionar
						</Button>
					</Box>
				</Box>
				<Box>
					<CustomList
						callBackDelete={ async (e) => {
							await deleteProductInBasicBasket(
								getValues().id,
								getValues()?.products[e]?.tb_product_id
							)
						}}
						isLoading={isLoading}
						colums={[1, 2, 4, 5]}
						data={getValues().products?.map(
							({ product, quantity }) => ({
								avatarLink: getImageLinkApi(
									product?.link_image
								),
								name: product?.description,
								description: `${quantity} ${product?.measure?.description}`,
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
							icon: <BiPackage fontSize="30px" />,
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
