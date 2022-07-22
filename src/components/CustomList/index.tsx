import React, { useState } from 'react'
import { IoAddCircleOutline } from 'react-icons/io5'

import {
	Box,
	Text,
	Divider,
	Flex,
	IconButton,
	Input,
	SimpleGrid,
	Skeleton,
	Stack,
} from '@chakra-ui/react'

import { AvatarCard } from './subComponents/AvatarCard'
import { BoxCard } from './subComponents/BoxCard'
import { TypeCardData } from './types'

type TypeParams = {
	callBackEdit?: any
	callBackDelete?: any
	callBackNew?: any
	typeList: 'avatar-card' | 'box-card'
	data: TypeCardData[]
	isLoading?: boolean
	colums?: Array<number>
}

const CustomList = ({
	callBackEdit,
	callBackDelete,
	callBackNew,
	typeList,
	data,
	isLoading,
	colums = [1, 1, 2, 3]
}: TypeParams) => {
	const [searchText, setSearchText] = useState('')
	const loadList = () => {
		if (isLoading)
			return (
				<Stack padding="30px 30px">
					<Skeleton height="20px" />
					<Skeleton height="20px" />
					<Skeleton height="20px" />
				</Stack>
			)

		if (!data?.length)
			return (
				<Text fontSize="xl" w="100%" textAlign="center" p="20px">
					Nenhum registro encontrado
				</Text>
			)

		return (
			<SimpleGrid
				columns={colums}
				spacing="20px"
				padding="30px 30px"
				justifyItems={"center"}
			>
				{data
					.filter((item) =>
						item?.name
							?.toLocaleLowerCase()
							.includes(searchText?.toLocaleLowerCase())
					)
					.map((item, index) => {
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
										callBackEdit={callBackEdit ? () => {
											callBackEdit(index)
										} : undefined}
										callBackDelete={callBackDelete ? () => {
											callBackDelete(index)
										} : undefined}
									/>
								)
							case 'box-card':
								return (
									<BoxCard
										key={index}
										data={{
											name: item.name,
											avatarLink: item.avatarLink,
											description: item.description,
											icon: item.icon,
										}}
										callBackEdit={callBackEdit ? () => {
											callBackEdit(index)
										} : undefined}
										callBackDelete={callBackDelete ? () => {
											callBackDelete(index)
										} : undefined}
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
			borderRadius="8px"
		>
			<Flex
				flexDirection="row"
				padding="20px"
				alignItems="center"
				gap="3"
			>
				<Box alignItems="center" w="100%">
					<Input
						pr="4.5rem"
						w="100%"
						size="lg"
						onChange={({ target: { value } }) =>
							setSearchText(value)
						}
						type="text"
						placeholder="Pesquisar pelo nome..."
					/>
				</Box>

				{callBackNew !== undefined && (
					<IconButton
						bg="#FFC632"
						title="Novo"
						colorScheme="yellow"
						fontSize="23px"
						aria-label="Search database"
						onClick={callBackNew}
						icon={<IoAddCircleOutline />}
					/>
				)}
			</Flex>
			<Divider w="80%" m="0 auto" />
			{loadList()}
		</Flex>
	)
}

export default CustomList
