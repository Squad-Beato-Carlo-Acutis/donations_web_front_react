import { Flex, Avatar, Box, IconButton, Text } from '@chakra-ui/react'
import { FiEdit } from 'react-icons/fi'

export type TypeAvatarCardData = {
	name: string
	description: string
	avatarLink: string
}

export type TypeAvatarCardParams = {
	data: TypeAvatarCardData
	callBackEdit: any
}

export const AvatarCard = ({
	data: { name, description, avatarLink },
	callBackEdit,
}: TypeAvatarCardParams) => {
	return (
		<Flex
			flexDirection="row"
			alignItems="center"
			borderRadius='5px'
			boxShadow="rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
			padding="10px"
			minW='300px'
		>
			<Flex w="100%">
				<Avatar src={avatarLink} />
				<Box ml="3">
					<Text fontWeight="bold" textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap' w='170px'>{name}</Text>
					<Text fontSize="sm" textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap' w='150px'>{description}</Text>
				</Box>
			</Flex>
			<IconButton
				bg="#FFC632"
				colorScheme="yellow"
				aria-label="Call Sage"
				fontSize="19px"
				title="Editar"
				onClick={callBackEdit}
				h="100%"
				mt="5px"
				icon={<FiEdit />}
			/>
		</Flex>
	)
}
