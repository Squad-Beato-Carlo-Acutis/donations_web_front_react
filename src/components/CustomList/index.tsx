import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { IoAddCircleOutline } from 'react-icons/io5'

import {
	Box,
	Button,
	Divider,
	Flex,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	SimpleGrid,
	Skeleton,
	Stack,
} from '@chakra-ui/react'

import { AvatarCard, TypeAvatarCardData } from './subComponents/AvatarCard'

type TypeParams = {
	callBackEdit: any
	callBackNew?: any
	typeList: 'avatar-card'
	data: TypeAvatarCardData[]
	isLoading?: boolean
}

const CustomList = ({
	callBackEdit,
	callBackNew,
	typeList,
	data,
	isLoading,
}: TypeParams) => {
	const loadList = () => {
		if (isLoading)
			return (
				<Stack padding="30px 30px">
					<Skeleton height="20px" />
					<Skeleton height="20px" />
					<Skeleton height="20px" />
				</Stack>
			)

		if (!data?.length) return []

		return (
			<SimpleGrid columns={[1, 1, 3]} spacing="20px" padding="30px 30px">
				{data.map((item, index) => {
					switch (typeList) {
						case 'avatar-card':
							return (
								<AvatarCard
									key={index}
									data={{
										name: item.name,
										avatarLink: item.avatarLink,
										description: item.description,
									}}
									callBackEdit={() => {
										callBackEdit(index)
									}}
								/>
							)
					}
				})}
			</SimpleGrid>
		)
	}

	return (
		<Flex
			flexDirection="column"
			justifyContent="space-between"
			bg="#fafafa"
		>
			<Flex
				flexDirection="row"
				padding="20px"
				alignItems="center"
				gap="3"
			>
				<Box alignItems="center" w="100%">
					<InputGroup size="lg" w="100%">
						<Input
							pr="4.5rem"
							w="100%"
							type="text"
							placeholder="Pesquisar..."
						/>
						<InputRightElement>
							<IconButton
							bg="#0B6051"
							title='Novo'
							colorScheme="green"
								aria-label="Search database"
								icon={<AiOutlineSearch />}
							/>
						</InputRightElement>
					</InputGroup>
				</Box>
				{callBackNew !== undefined && (
					<Box alignItems="center" w="10%">
						<IconButton
							bg="#FFC632"
							title='Novo'
							colorScheme="yellow"
							fontSize="23px"
							aria-label="Search database"
							onClick={callBackNew}
							icon={<IoAddCircleOutline />}
						/>
					</Box>
				)}
			</Flex>
			<Divider w="80%" m="0 auto" />
			{loadList()}
		</Flex>
	)
}

export default CustomList
