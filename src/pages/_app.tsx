import { AppProps } from 'next/app'
import { ChakraProvider, Switch } from '@chakra-ui/react'
import { theme } from '../styles/theme'
import { tokenPercistence } from '../repository/donationsApi/login'
import Router from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
	tokenPercistence()
	return (
		<ChakraProvider theme={theme}>
			<Component {...pageProps} />
		</ChakraProvider>
	)
}
