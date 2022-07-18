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
import {
	CustomMenuButton,
} from './CustomMenuButton/CustomMenuButton'
import { useRouter } from 'next/router'

const Header = () => {
	const router = useRouter()
	const { signOut } = useContext(AuthContext)
	const { isOpen, onOpen, onClose } = useDisclosure()

	const getButtonsMenu = () => {
		return (
			<>
				<CustomMenuButton
					active={router.pathname === '/admin/home'}
					title="Home"
				/>
				<CustomMenuButton
					active={router.pathname === '/admin/conferences'}
					title="Conferências"
				/>
				<CustomMenuButton
					active={router.pathname === '/admin/product'}
					title="Produtos"
				/>
				<CustomMenuButton
					active={router.pathname === '/admin/basicbaskets'}
					title="Cestas Básicas"
				/>
				<CustomMenuButton
					active={router.pathname === '/admin/productsneeded'}
					title="Produtos Necessários"
				/>
				<CustomMenuButton
					active={router.pathname === '/admin/movements'}
					title="Mov. Estoque"
				/>
			</>
		)
	}

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
				display={['none', 'none', 'none', 'block']}
			>
				<Image src={Logo} />
			</Box>
			<Flex
				justifyContent={'left'}
				width={'100%'}
				gap={'12px'}
				display={['none', 'none', 'none', 'flex']}
			>
				{getButtonsMenu()}
			</Flex>
			<Box display={['block', 'block', 'block', 'none']}>
				<GiHamburgerMenu fontSize={30} color="#FFF" onClick={onOpen} />
			</Box>
			<Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderBottomWidth="1px" textAlign={"center"}>
						Menu
					</DrawerHeader>
					<DrawerBody gap={3} display="flex" flexDirection={"column"} padding="15px 0px">
						{getButtonsMenu()}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
			<Flex alignItems="center" gap="12">
				<Menu>
					<MenuButton as={'a'}>
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
