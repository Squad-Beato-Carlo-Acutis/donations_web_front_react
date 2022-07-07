import { background, Button } from '@chakra-ui/react'

export const CustomMenuButton = ({ children }) => {
	return (
		<Button
			color={'#fff'}
			background={'transparent'}
			_hover={{ bg: '#0B6051' }}
			_active={{ bg: '#0B6051' }}
		>
			{children}
		</Button>
	)
}
