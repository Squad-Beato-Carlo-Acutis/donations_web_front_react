import React from 'react'

import Image from 'next/image'
import { Avatar, Box, Button, Flex, Spacer, WrapItem } from '@chakra-ui/react'

import Logo from '../../../public/assets/images/logo/Donating.png'

// import { Container } from './styles';

const Header: React.FC = () => (
	<Flex justifyContent="space-between" bg="#263734">
		<Box alignItems="center" gap="12" padding="16">
			<Image src={Logo} />
		</Box>
		<Flex alignItems="center" gap="12" padding="16">
			<Button bg="#FFC632" colorScheme="yellow" size="lg">
				Adicionar Produto
			</Button>
			<WrapItem>
				<Avatar
					size="md"
					name="Kola Tioluwani"
					src="https://bit.ly/kent-c-dodds"
				/>
			</WrapItem>
		</Flex>
	</Flex>
)

export default Header