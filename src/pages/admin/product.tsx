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
	CadProductFormData,
	createProduct,
	deleteProduct,
	getCategories,
	getMeasures,
	getProducts,
	TypeCategory,
	TypeMeasure,
	updateProduct,
	uploadProductImage,
} from '../../repository/donationsApi/products'
import { getImageLinkApi } from '../../helpers/utils'

const schema = yup
	.object({
		description: yup.string().required(),
		tb_measure_id: yup.number().required(),
		tb_category_id: yup.number().required(),
	})
	.required()

export default function Product() {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const { register, handleSubmit, setValue, reset, getValues } = useForm({
		resolver: yupResolver(schema),
	})
	const [customData, setCustomData] = useState<CadProductFormData[]>()
	const [isLoading, setIsLoading] = useState(true)
	const [isNewProduct, setIsNewProduct] = useState(false)
	const [totalPages, setTotalPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [dataLimit, setDataLimit] = useState(10)

	const [measures, setMeasures] = useState<TypeMeasure[]>()
	const [categories, setCategories] = useState<TypeCategory[]>()

	const getData = async () => {
		try {
			setIsLoading(true)
			const { data, totalPages: pTotalPages } = await getProducts(
				dataLimit,
				currentPage
			)
			setTotalPages(pTotalPages)
			setCustomData(data)

			const dataMeasures = await getMeasures()
			setMeasures(dataMeasures)

			const dataCategories = await getCategories()
			setCategories(dataCategories)

			setIsLoading(false)
		} catch (err) {
			console.error(err)
			setIsLoading(false)
		}
	}

	useEffect(() => {
		getData()
	}, [currentPage, dataLimit])

	const hadlerSendForm: SubmitHandler<CadProductFormData> = async (
		product: any
	) => {
		try {
			let dataProduct: any = {}
			if (isNewProduct) {
				dataProduct = await createProduct({
					description: product.description,
					tb_category_id: product.tb_category_id,
					tb_measure_id: product.tb_measure_id,
				})
			} else {
				dataProduct = await updateProduct(
					{
						description: product.description,
						tb_category_id: product.tb_category_id,
						tb_measure_id: product.tb_measure_id,
					},
					product.id
				)
			}

			if (product.product_img && dataProduct.id) {
				await uploadProductImage(dataProduct.id, product.product_img[0])
			}

			Swal.fire(
				'Sucesso',
				`Produto ${
					isNewProduct ? 'cadastrado' : 'atualizado'
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

	const handlerDeleteProduct = async (index: number) => {
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
					deleteProduct(id)
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
		getData()
	}

	const customOpenEditModal = (index: number) => {
		const data = customData[index]
		for (var field in data) {
			setValue(field, data[field])
		}
		setIsNewProduct(false)
		onOpen()
	}

	const customOpenNewModal = () => {
		setIsNewProduct(true)
		onOpen()
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
						Produtos cadastrados
					</Heading>
					<CustomList
						callBackEdit={customOpenEditModal}
						callBackDelete={handlerDeleteProduct}
						callBackNew={customOpenNewModal}
						isLoading={isLoading}
						colums={[1, 2, 3, 4]}
						data={customData?.map((item) => ({
							name: item.description,
							description: `Unidade: ${item.measure?.description}`,
							avatarLink: getImageLinkApi(item.link_image),
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
							{isNewProduct ? 'Adicionar' : 'Atualizar'} Produto
						</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							{!isNewProduct && (
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
							<Box display="flex">
								<Box h="70px" margin="22px 20px" w="100%">
									<Text>Categoria</Text>
									<Select
										{...register('tb_category_id')}
										w="100%"
										h="56px"
										mt="4px"
									>
										{categories?.map((category) => {
											return (
												<option
													key={`${category.id}-${category.description}`}
													value={category.id}
												>
													{category.description}
												</option>
											)
										})}
									</Select>
								</Box>
								<Box
									h="70px"
									margin="0 20px"
									mt="22px"
									w="100%"
								>
									<Text>Unidade de Medida</Text>
									<Select
										{...register('tb_measure_id')}
										w="100%"
										h="56px"
										mt="4px"
									>
										{measures?.map((measure) => {
											return (
												<option
													key={`${measure.id}-${measure.description}`}
													value={measure.id}
												>
													{measure.description}
												</option>
											)
										})}
									</Select>
								</Box>
							</Box>
							<Box display="flex">
								<Box h="70px" margin="22px 20px" w="100%">
									<Text>Imagem</Text>
									<Box
										display="flex"
										gap="20px"
										alignItems="center"
										marginTop="5px"
									>
										<Input
											type="hidden"
											{...register('link_image')}
										></Input>
										{getValues()?.link_image && <Img
											w={'50px'}
											h={'50px'}
											objectFit="contain"
											src={getImageLinkApi(
												getValues()?.link_image
											)}
											alt={getValues()?.description}
											title={getValues()?.description}
										/> || <BiImage />}
										<Input
											type="file"
											accept="image/png,image/jpeg,image/jpg"
											padding={'12px'}
											{...register('product_img')}
											w="100%"
											h="56px"
											mt="4px"
										></Input>
									</Box>
								</Box>
							</Box>
						</ModalBody>

						<ModalFooter>
							<Button
								bg="#FFC632"
								colorScheme="yellow"
								size="md"
								m="0 5px"
								type="submit"
							>
								{isNewProduct ? 'Criar' : 'Salvar'}
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
