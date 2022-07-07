import React, { useContext } from 'react'

import Image from 'next/image'
import {
	Avatar,
	Box,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	Menu,
	MenuButton,
	MenuDivider,
	MenuGroup,
	MenuItem,
	MenuList,
	useDisclosure,
} from '@chakra-ui/react'

import Logo from '../../../public/assets/images/logo/Donating.png'
import { GiHamburgerMenu } from 'react-icons/gi'
import Swal from 'sweetalert2'
import { AuthContext } from '../../context/AuthContext'
import { CustomMenuButton } from './CustomMenuButton/CustomMenuButton'

const Header = () => {
	const { signOut } = useContext(AuthContext)
	const { isOpen, onOpen, onClose } = useDisclosure()

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
		<Flex
			justifyContent="space-between"
			alignItems={'center'}
			gap={'30px'}
			bg="#263734"
			padding={'30px 25px 80px 25px'}
			minHeight={100}
		>
			<Box
				alignItems="center"
				gap="12"
				display={['none', 'none', 'block', 'block']}
			>
				<Image src={Logo} />
			</Box>
			<Flex
				justifyContent={'left'}
				width={'100%'}
				gap={'9px'}
				display={['none', 'none', 'block', 'block']}
			>
				<CustomMenuButton>Teste 1</CustomMenuButton>
				<CustomMenuButton>Teste 2</CustomMenuButton>
				<CustomMenuButton>Teste 3</CustomMenuButton>
				<CustomMenuButton>Teste 4</CustomMenuButton>
				<CustomMenuButton>Teste 5</CustomMenuButton>
			</Flex>
			<Box display={['block', 'block', 'none', 'none']}>
				<GiHamburgerMenu onClick={onOpen} />
			</Box>
			<Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderBottomWidth="1px">
						Basic Drawer
					</DrawerHeader>
					<DrawerBody>
						<p>Some contents...</p>
						<p>Some contents...</p>
						<p>Some contents...</p>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
			<Flex alignItems="center" gap="12">
				<Menu>
					<MenuButton as={'circle'}>
						<Avatar
							size="md"
							name="Kola Tioluwani"
							src="https://bit.ly/kent-c-dodds"
						/>
					</MenuButton>

					<MenuList>
						<MenuGroup>
							<MenuItem>Minha Conta</MenuItem>
						</MenuGroup>
						<MenuDivider />
						<MenuGroup>
							<MenuItem as={'button'} onClick={handleLogout}>
								Sair
							</MenuItem>
						</MenuGroup>
					</MenuList>
				</Menu>
			</Flex>
		</Flex>
	)
}

export default Header
