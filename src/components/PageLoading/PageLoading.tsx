import React from 'react'
import {
	Box, Spinner,
} from '@chakra-ui/react'



export const PageLoading = ( {isLoading = false} ) => {

	return (
		<Box
		position="fixed"
		w="100vw"
		h="100vh"
		zIndex="99999"
		background={"#263734b5"}
		display={isLoading ? "flex" : "none"}
		flexDirection="column"
		alignItems="center"
		justifyContent="center"
		>
			<Spinner
				thickness='4px'
				speed='0.65s'
				emptyColor='gray.200'
				color='#263734'
				size='xl'
			/>
		</Box>
	)
}

export default PageLoading
