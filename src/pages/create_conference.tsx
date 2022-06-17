import {
	Flex,
	Box,
	Text,
	Input,
	Button,
	Heading,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Header from '../components/Header'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import CustomList from '../components/CustomList'

const schema = yup
	.object({
		email: yup.string().email().required(),
		password: yup.string().required(),
	})
	.required()

type SignInFormData = {
	description: string
	link_avatar: string
	about: string
	title_address: string
	address: string
	opening_hours: string
}

export default function CreateConference() {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const customData = [
		{
			description: 'Teste de conferencia',
			link_avatar:
				'https://styles.redditmedia.com/t5_2sxwj/styles/communityIcon_4i2mjfjiqlb11.jpg',
			about: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
			title_address: 'Teste Title Address',
			address: 'Teste Address',
			opening_hours: '08:30;12:00;14:00;18:00',
		},
	]
	const handleSignIn: SubmitHandler<SignInFormData> = async (e) => {
		await new Promise((resolve) => setTimeout(resolve, 2000))
		console.log('TCL: handleSignIn -> e', e)
	}

	const { handleSubmit } = useForm({
		// resolver: yupResolver(schema),
	})

	const customOpenModal = (index: number) => {
		alert(`Teste com index: ${index}`)

		const item = customData[index]
		console.log("Item => ", item)
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
					<CustomList
						callBackEdit={customOpenModal}
						data={customData.map((item) => {
							return {
								name: item.description,
								avatarLink: item.link_avatar,
								description: item.about,
							}
						})}
						typeList="avatar-card"
					></CustomList>
				</Box>
			</Box>

			<Modal isOpen={isOpen} onClose={onClose} size="full">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Adicionar nova Conferência</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<form onSubmit={handleSubmit(handleSignIn)}>
							<Box display="flex">
								<Box
									h="70px"
									margin="0 20px"
									mt="22px"
									w="100%"
								>
									<Text>Nome da conferência</Text>
									<Input
										type="text"
										placeholder="Nome"
										name="description"
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
										name="link_avatar"
										w="100%"
										h="56px"
										mt="4px"
									></Input>
								</Box>
							</Box>

							<Box margin="0 20px" mt="40px">
								<Text>Sobre</Text>
								<Input
									placeholder="Ex: Descreva um pouco sobre a conferência..."
									name="about"
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
									w={{ base: '100%', md: '32%' }}
									display="inline-block"
									marginTop="20px"
								>
									<Text>Titulo do endereço</Text>
									<Input
										placeholder="Ex: Paroquia Nossa Senhora"
										name="title_address"
										w="100%"
										h="56px"
									></Input>
								</Box>
								<Box
									w={{ base: '100%', md: '32%' }}
									display="inline-block"
									marginTop="20px"
								>
									<Text>Endereço</Text>
									<Input
										placeholder="Ex: Av José e Maria"
										name="address"
										w="100%"
										h="56px"
									></Input>
								</Box>
								<Box
									w={{ base: '100%', md: '32%' }}
									display="inline-block"
									marginTop="20px"
								>
									<Text>Número</Text>
									<NumberInput>
										<NumberInputField
											name="number"
											w="100%"
											h="56px"
											placeholder="Ex: 252"
										/>
										<NumberInputStepper></NumberInputStepper>
									</NumberInput>
								</Box>
							</Flex>
						</form>
					</ModalBody>

					<ModalFooter>
						<Button
							bg="#FFC632"
							colorScheme="yellow"
							size="md"
							m="0 5px"
						>
							Salvar Configurações
						</Button>
						<Button
							onClick={onClose}
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
			</Modal>
		</>
	)
}
