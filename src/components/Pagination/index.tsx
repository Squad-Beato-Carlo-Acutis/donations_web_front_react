import { Button, Flex, HStack, Select, Text } from '@chakra-ui/react'
import { useState } from 'react'
import {
	FaRegArrowAltCircleLeft,
	FaRegArrowAltCircleRight,
} from 'react-icons/fa'

type TypeParams = {
	totalPages: number
	dataLimit: number
	pCurrentPage: number
	callBackPage: any
	callBackDataLimit: any
}

export const Pagination = ({
	pCurrentPage,
	totalPages,
	dataLimit = 10,
	callBackPage,
	callBackDataLimit,
}: TypeParams) => {
	const [currentPage, setCurrentPage] = useState<number>(pCurrentPage || 1)

	const handlePrevOrNextPage = (op: 'next' | 'prev') => {
		const newValue = op === 'prev' ? currentPage - 1 : currentPage + 1

		if (
			(op === 'next' && currentPage >= totalPages) ||
			(op === 'prev' && currentPage <= 1)
		)
			return

		setCurrentPage(newValue)
		callBackPage(newValue)
	}

	return (
		<Flex alignItems="center" justifyContent="right" gap={2} padding={"10px"}>
			<Select
				value={dataLimit}
				onChange={({ currentTarget: { value } }) =>
					callBackDataLimit(value)
				}
				maxW="90px"
				height={'40px'}
			>
				<option value="10">10</option>
				<option value="30">30</option>
				<option value="50">50</option>
				<option value="100">100</option>
			</Select>
			<HStack
				maxW="320px"
				borderRadius={6}
				border="1px solid #b3b5c6"
				height={'40px'}
			>
				<Button
					background="transparent"
					fontSize="25px"
					padding={0}
					margin={0}
					disabled={currentPage <= 1}
					onClick={() => handlePrevOrNextPage('prev')}
				>
					<FaRegArrowAltCircleLeft />
				</Button>
				<Text
					fontWeight="bold"
					letterSpacing="2px"
					margin={0}
				>{`${currentPage}-${totalPages || 1}`}</Text>
				<Button
					background="transparent"
					fontSize="25px"
					padding={0}
					margin={0}
					disabled={currentPage >= totalPages}
					onClick={() => handlePrevOrNextPage('next')}
				>
					<FaRegArrowAltCircleRight />
				</Button>
			</HStack>
		</Flex>
	)
}
