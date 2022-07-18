import {
	Flex,
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
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
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
	CadProductFormData,
	createProduct,
	deleteProduct,
	getProducts,
	updateProduct,
} from '../../repository/donationsApi/products'
import { getImageLinkApi } from '../../helpers/utils'

const schema = yup
	.object({
		description: yup.string().required(),
		link_avatar: yup.string().url().required(),
		about: yup.string().required(),
		title_address: yup.string().required(),
		address: yup.string().required(),
		opening_hours: yup.string().required(),
	})
	.required()

export default function Product() {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const { register, handleSubmit, setValue, reset } = useForm({
		resolver: yupResolver(schema),
	})
	const [customData, setCustomData] = useState<CadProductFormData[]>()
	const [isLoading, setIsLoading] = useState(true)
	const [isNewProduct, setIsNewProduct] = useState(false)
	const [totalPages, setTotalPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [dataLimit, setDataLimit] = useState(10)

	const getData = async () => {
		try {
			setIsLoading(true)
			const { data, totalPages: pTotalPages } = await getProducts(
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

	useEffect(() => {
		getData()
	}, [currentPage, dataLimit])

	const hadlerSendForm: SubmitHandler<CadProductFormData> = async (
		product: CadProductFormData
	) => {
		try {
			if (isNewProduct) {
				await createProduct(product)
			} else {
				await updateProduct(product, product.id)
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
								<Box
									h="70px"
									margin="0 20px"
									mt="22px"
									w="100%"
								>
									<Text>Nome da produto</Text>
									<Input
										type="text"
										placeholder="Nome"
										{...register('description')}
										w="100%"
										h="56px"
										mt="4px"
									></Input>
								</Box>
								<Box
									h="70px"
									margin="0 20px"
									mt="22px"
									w="100%"
								>
									<Text>Link do Avatar</Text>
									<Input
										placeholder="Ex: www.bancodeimagens.com"
										{...register('link_avatar')}
										w="100%"
										h="56px"
										mt="4px"
									></Input>
								</Box>
							</Box>

							<Box margin="0 20px" mt="40px">
								<Text>Sobre</Text>
								<Input
									placeholder="Ex: Descreva um pouco sobre a produto..."
									{...register('about')}
									textAlign="start"
									paddingBottom="98px"
									w="100%"
									h="150px"
								></Input>
							</Box>

							<Flex
								flexDirection={{ base: 'column', md: 'row' }}
								justifyContent="space-between"
								alignItems="center"
								margin={{ base: '0 20px' }}
							>
								<Box
									w={{ base: '100%', md: '49%' }}
									display="inline-block"
									marginTop="20px"
								>
									<Text>Titulo do endereço</Text>
									<Input
										placeholder="Ex: Paroquia Nossa Senhora"
										{...register('title_address')}
										w="100%"
										h="56px"
									></Input>
								</Box>
								<Box
									w={{ base: '100%', md: '49%' }}
									display="inline-block"
									marginTop="20px"
								>
									<Text>Endereço</Text>
									<Input
										placeholder="Ex: Av José e Maria"
										{...register('address')}
										w="100%"
										h="56px"
									></Input>
								</Box>
							</Flex>
							{/* TODO: Melhorar a forma que cadastra o horario */}
							<Box display="flex">
								<Box h="70px" margin="22px 20px" w="100%">
									<Text>Horarios de atendimento:</Text>
									<Input
										type="text"
										placeholder="Ex: 08:30;12:00;14:00;18:00"
										{...register('opening_hours')}
										w="100%"
										h="56px"
										mt="4px"
									></Input>
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
