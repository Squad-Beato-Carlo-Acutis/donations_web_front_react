import React, { useContext } from 'react'

import Image from 'next/image'
import { Avatar, Box, Button, Flex, WrapItem } from '@chakra-ui/react'

import Logo from '../../../public/assets/images/logo/Donating.png'
import { AiOutlineLogout } from 'react-icons/ai'
import Swal from 'sweetalert2'
import { AuthContext } from '../../context/AuthContext'

const Header = () => {
	const { signOut } = useContext(AuthContext)
	const handleLogout = () => {
		Swal.fire({
			title: 'Atenção!!!',
			text: 'Deseja se desconectar da loja?',
			showDenyButton: true,
			confirmButtonText: 'Não',
			icon: 'question',
			denyButtonText: `Sim`,
		}).then((result) => {
			if (result.isDenied) {
				signOut()
			}
		})
	}
	return (
		<Flex justifyContent="space-between" bg="#263734">
			<Box alignItems="center" gap="12" padding="16">
				<Image src={Logo} />
			</Box>
			<Flex alignItems="center" gap="12" padding="16">
				{/* <Button bg="#FFC632" colorScheme="yellow" size="lg">
				Adicionar Produto
			</Button> */}
				<WrapItem alignItems="center" gap="2">
					<Avatar
						size="md"
						name="Kola Tioluwani"
						src="https://bit.ly/kent-c-dodds"
					/>
					<Button
						leftIcon={<AiOutlineLogout />}
						colorScheme="yellow"
						variant="solid"
						bg="#FFC632"
						onClick={handleLogout}
					>
						Sair
					</Button>
				</WrapItem>
			</Flex>
		</Flex>
	)
}

export default Header
