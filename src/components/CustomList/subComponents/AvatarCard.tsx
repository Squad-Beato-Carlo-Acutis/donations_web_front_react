import { Flex, Avatar, Box, IconButton, Text } from '@chakra-ui/react'
import { MdEdit } from 'react-icons/md'
import { BsFillTrashFill } from 'react-icons/bs'
import { TypeCardData } from '../types'

export type TypeAvatarCardParams = {
	data: TypeCardData
	callBackEdit?: any
	callBackDelete?: any
}

export const AvatarCard = ({
	data: { name, description, avatarLink },
	callBackEdit,
	callBackDelete,
}: TypeAvatarCardParams) => {
	return (
		<Flex
			flexDirection="row"
			alignItems="center"
			borderRadius="5px"
			boxShadow="rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
			padding="10px"
			minW="300px"
		>
			<Flex w="100%">
				<Avatar src={avatarLink} />
				<Box ml="3">
					<Text
						fontWeight="bold"
						textOverflow="ellipsis"
						overflow="hidden"
						whiteSpace="nowrap"
						w="170px"
					>
						{name}
					</Text>
					{description && (
						<Text
							fontSize="sm"
							textOverflow="ellipsis"
							overflow="hidden"
							whiteSpace="nowrap"
							w="150px"
						>
							{description}
						</Text>
					)}
				</Box>
			</Flex>
			<Flex flexDirection="column" gap="2" alignItems="center">
				{callBackEdit !== undefined && (
					<IconButton
						bg="#FFC632"
						colorScheme="yellow"
						aria-label="Call Sage"
						fontSize="15px"
						title="Editar"
						h="25px"
						minW="25px"
						onClick={callBackEdit}
						icon={<MdEdit />}
					/>
				)}
				{callBackDelete !== undefined && (
					<IconButton
						bg="#f5222d"
						colorScheme="red"
						aria-label="Call Sage"
						fontSize="15px"
						title="Deletar"
						h="25px"
						minW="25px"
						onClick={callBackDelete}
						icon={<BsFillTrashFill />}
					/>
				)}
			</Flex>
		</Flex>
	)
}
