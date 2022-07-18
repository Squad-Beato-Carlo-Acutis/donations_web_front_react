import { Flex, Avatar, Box, IconButton, Text } from '@chakra-ui/react'
import { MdEdit } from 'react-icons/md'
import { BsFillTrashFill } from 'react-icons/bs'

export type TypeBoxCardData = {
	name: string
	description?: string
	avatarLink: string
}

export type TypeBoxCardParams = {
	data: TypeBoxCardData
	callBackEdit?: any
	callBackDelete?: any
}

export const BoxCard = ({
	data: { name, description, avatarLink },
	callBackEdit,
	callBackDelete,
}: TypeBoxCardParams) => {
	return (
		<Flex
			flexDirection="column"
			alignItems="center"
			justifyContent={"center"}
			borderRadius="5px"
			boxShadow="rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
			padding="10px"
			maxW="250px"
			gap={3}
		>
			<Avatar
				src={avatarLink}
				w={'80px'}
				h={'80px'}
				boxShadow="rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
			/>
			<Box ml="3">
				<Text
					fontWeight="bold"
					textOverflow="ellipsis"
					overflow="hidden"
					whiteSpace="nowrap"
					textAlign={"center"}
					// w="170px"
				>
					{name}
				</Text>
				{description && (
					<Text
						fontSize="sm"
						textOverflow="ellipsis"
						overflow="hidden"
						whiteSpace="nowrap"
						textAlign={"center"}
						w="150px"
					>
						{description}
					</Text>
				)}
			</Box>
			<Flex flexDirection="row" gap="2" alignItems="center">
				{callBackEdit !== undefined && (
					<IconButton
						bg="#FFC632"
						colorScheme="yellow"
						aria-label="Call Sage"
						fontSize="15px"
						title="Editar"
						h="35px"
						minW="35px"
						onClick={callBackEdit}
						icon={<MdEdit fontSize={20} />}
					/>
				)}
				{callBackDelete !== undefined && (
					<IconButton
						bg="#f5222d"
						colorScheme="red"
						aria-label="Call Sage"
						fontSize="15px"
						title="Deletar"
						h="35px"
						minW="35px"
						onClick={callBackDelete}
						icon={<BsFillTrashFill fontSize={20} />}
					/>
				)}
			</Flex>
		</Flex>
	)
}
