import { Flex, Box, IconButton, Text, Img, Avatar } from '@chakra-ui/react'
import { MdEdit } from 'react-icons/md'
import { FaQuestion } from 'react-icons/fa'
import { BsFillTrashFill } from 'react-icons/bs'
import { TypeCardData } from '../types'

export type TypeBoxCardParams = {
	data: TypeCardData
	callBackEdit?: any
	callBackDelete?: any
}

export const BoxCard = ({
	data: { name, description, avatarLink, icon },
	callBackEdit,
	callBackDelete,
}: TypeBoxCardParams) => {
	return (
		<Flex
			flexDirection="column"
			alignItems="center"
			justifyContent={'center'}
			borderRadius="5px"
			boxShadow="rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
			padding="10px"
			maxW="250px"
			minW="180px"
			gap={3}
		>
			{(avatarLink && (
				<Img
					src={avatarLink}
					objectFit="contain"
					w={'80px'}
					h={'80px'}
					borderRadius="100%"
					boxShadow="rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
				/>
			)) || (
				<Avatar
					bg="#B6A16D"
					w={'80px'}
					h={'80px'}
					icon={icon || <FaQuestion />}
				/>
			)}
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				gap="7px"
			>
				<Box>
					<Text
						fontWeight="bold"
						textOverflow="ellipsis"
						overflow="hidden"
						whiteSpace="nowrap"
						textAlign={'center'}
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
							textAlign={'center'}
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
			</Box>
		</Flex>
	)
}
