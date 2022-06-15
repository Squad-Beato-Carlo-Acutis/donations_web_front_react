import { Box, Badge, Text, Button, ButtonGroup } from '@chakra-ui/react'
import { ReactNode } from 'react'
import Image from 'next/image'
import ProductImage from '../../../public/assets/images/feijao.png'

interface ProductProps {
	children?: ReactNode
}

function Product({ children }: ProductProps) {
	const product = {
		title: 'Pacote de Feijão',
		validate: '29/05/2020',
		category: 'leguminosas',
		quantity: 15,
	}

	return (
		<Box
			bg="#FFF"
			maxW="sm"
			borderWidth="1px"
			borderRadius="lg"
			overflow="hidden"
		>
			<Image src={ProductImage} />

			<Box p="6">
				<Box display="flex" alignItems="baseline">
					<Badge borderRadius="full" px="2" colorScheme="teal">
						500g
					</Badge>
					<Box
						color="gray.500"
						fontWeight="semibold"
						letterSpacing="wide"
						fontSize="xs"
						textTransform="uppercase"
						ml="2"
					>
						&bull; {product.quantity} u
					</Box>
				</Box>

				<Box
					mt="1"
					fontSize="lg"
					fontWeight="semibold"
					as="h4"
					lineHeight="tight"
					noOfLines={1}
				>
					{product.title}
				</Box>

				<Box>
					<Text fontSize="md">{product.validate}</Text>
				</Box>
				<Box>
					<Text fontSize="sm">{product.category}</Text>
				</Box>
				<ButtonGroup mt="4" isAttached variant='outline' size="sm">
					<Button colorScheme="red">Remover</Button>
					<Button colorScheme="blue">Editar</Button>
				</ButtonGroup>
			</Box>
		</Box>
	)
}

export default Product
