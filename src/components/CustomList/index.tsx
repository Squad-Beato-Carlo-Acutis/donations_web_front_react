import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

import {
	Box,
	Divider,
	Flex,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	SimpleGrid,
} from '@chakra-ui/react'

import { AvatarCard, TypeAvatarCardData } from './subComponents/AvatarCard'

type TypeParams = {
	callBackEdit: any
	typeList: 'avatar-card'
	data: TypeAvatarCardData[]
}

const CustomList = ({ callBackEdit, typeList, data }: TypeParams) => {
	const loadItems = () => {
		return data.map((item, index) => {
			switch (typeList) {
				case 'avatar-card':
					return (
						<AvatarCard
							key={index}
							data={{
								name: item.name,
								avatarLink: item.avatarLink,
								description: item.description
							}}
							callBackEdit={() => {
								callBackEdit(index)
							}}
						/>
					)
			}
		})
	}

	return (
		<Flex
			flexDirection="column"
			justifyContent="space-between"
			bg="#fafafa"
		>
			<Box alignItems="center" padding="10" w="100%">
				<InputGroup size="lg" w="100%">
					<Input
						pr="4.5rem"
						w="100%"
						type="text"
						placeholder="Pesquisar..."
					/>
					<InputRightElement>
						<IconButton
							aria-label="Search database"
							icon={<AiOutlineSearch />}
						/>
					</InputRightElement>
				</InputGroup>
			</Box>
			<Divider w="80%" m="0 auto" />
			<SimpleGrid
				columns={[2, null, 3]}
				spacing="40px"
				padding="30px 30px"
			>
				{loadItems()}
			</SimpleGrid>
		</Flex>
	)
}

export default CustomList
