import {
	Box,
	Heading,
	Text,
	SimpleGrid,
	Button,
	Flex,
	WrapItem,
} from '@chakra-ui/react'
import Image from 'next/image'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Input from '../components/Form/Input'

import VolunteersImage from '../../public/assets/images/team-of-volunteers-stacking-hands.jpg'
import Logo from '../../public/assets/images/logo/Donating.png'
import { checkSession, login } from '../repository/donationsApi/login'
import Swal from 'sweetalert2'
import { useEffect } from 'react'

type SignInFormData = {
	email: string
	password: string
	resolve?: number
}

const schema = yup
	.object({
		email: yup.string().email().required(),
		password: yup.string().required(),
	})
	.required()

export default function Admin() {
	useEffect(() => {
		if (checkSession()) window.location.href = '/conferences'
	}, [])

	const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
		try {
			const isLogged = await login(values.email, values.password)

			if (!isLogged) {
				Swal.fire('Ops', 'Usuário ou senha estão inválidos.', 'warning')
			}
		} catch (err) {
			Swal.fire(
				'Erro',
				'Ocorreu um erro na solicitação e login, tente novamente mais tarde.',
				'error'
			)
			console.error(err)
		}
	}

	const { register, handleSubmit, formState } = useForm({
		resolver: yupResolver(schema),
	})

	return (
		<SimpleGrid h="100vh" w="100vw" columns={{ base: 1, lg: 2 }}>
			<Box
				justifyContent="center"
				alignItems="center"
				display="flex"
				height="full"
				bg="#263734"
				w="100%"
			>
				<Box
					borderRadius={8}
					w="100%"
					m="15px"
					maxW="490px"
					p="29px"
					bg="#00715D"
				>
					<form onSubmit={handleSubmit(handleSignIn)}>
						<Flex gap="2" direction="column" mb="10">
							<WrapItem mb="2">
								<Image
									layout="fixed"
									width={184.35}
									src={Logo}
									alt="Logomarca"
								/>
							</WrapItem>
							<Heading color="#FFF">Faça seu login</Heading>
							<Text color="#FFF">
								Entre com suas informações de cadastro.
							</Text>
						</Flex>
						<Flex direction="column" gap="4">
							<Input
								type="email"
								name="email"
								label="E-mail"
								placeholder="ex: joaquim.barbosa@gmail.com"
								validation={register('email', {
									required: 'Email é obrigatório',
									minLength: {
										value: 4,
										message:
											'O comprimento mínimo deve ser 4',
									},
								})}
							/>
							<Input
								type="password"
								name="password"
								label="Senha"
								placeholder="Digite sua senha"
								validation={register('password', {
									required: 'Senha é obrigatório',
									minLength: {
										value: 4,
										message:
											'O comprimento mínimo deve ser 4',
									},
								})}
							/>

							<Button
								bg="#FFC632"
								type="submit"
								colorScheme="yellow"
								size="lg"
								isLoading={formState.isSubmitting}
							>
								Entrar
							</Button>
						</Flex>
					</form>
				</Box>
			</Box>
			<Image
				objectFit="cover"
				objectPosition="center"
				src={VolunteersImage}
				alt="background"
			/>
		</SimpleGrid>
	)
}
