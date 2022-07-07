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

type SignInFormData = {
	email: string;
	password: string;
	resolve?: number;
  }

const schema = yup
	.object({
		email: yup.string().email().required(),
		password: yup.string().required(),
	})
	.required()

export default function Home() {

	const handleSignIn: SubmitHandler<SignInFormData> =  async (values) => {

		await new Promise(resolve => setTimeout(resolve, 2000))
	}

	const {
		register,
		handleSubmit,
		formState
	} = useForm({
		resolver: yupResolver(schema),
	})

	return (
		<SimpleGrid h="100vh" w="100vw" columns={2}>
			<Box
				justifyContent="center"
				alignItems="center"
				display="flex"
				height="full"
				bg="#263734"
			>
				<Box borderRadius={8} py="16" px="40" bg="#00715D">
					<form onSubmit={handleSubmit(handleSignIn)}>
						<Flex gap="2" direction='column' mb="10">
							<WrapItem mb="2">
								<Image
									layout='fixed'
									width={184.35}
									// maxHeight='41.18px'
									// objectFit="cover"
									// objectPosition="center"
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
								validation={register('email',
									{
										required:
											'Email é obrigatório',
										minLength: {
											value:
												4,
											message:
												'O comprimento mínimo deve ser 4',
										},
									})} />
							<Input
								type="password"
								name="password"
								label="Senha"
								placeholder="Digite sua senha"
								validation={register('password',
									{
										required:
											'Senha é obrigatório',
										minLength: {
											value:
												4,
											message:
												'O comprimento mínimo deve ser 4',
										},
									})} />

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
