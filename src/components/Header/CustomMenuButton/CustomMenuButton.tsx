import { background, Button } from '@chakra-ui/react'

export const CustomMenuButton = ({ title, onClick = null, active = false }) => {
	return (
		<Button
			onClick={onClick}
			color={[
				`${active ? '#FFF' : '#000'}`,
				`${active ? '#FFF' : '#000'}`,
				`${active ? '#FFF' : '#000'}`,
				`#FFF`,
			]}
			background={[
				`${active ? '#0B6051' : '#f3f3f3'}`,
				`${active ? '#0B6051' : '#f3f3f3'}`,
				`${active ? '#0B6051' : '#f3f3f3'}`,
				`${active ? '#0B6051' : 'transparent'}`,
			]}
			_hover={{ bg: '#0B6051', color: '#FFF' }}
			width={['100%', '100%', '100%', 'initial']}
			borderRadius={['0px', '0px', '0px', '7px']}
		>
			{title}
		</Button>
	)
}
