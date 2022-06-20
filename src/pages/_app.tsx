import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../styles/theme'
import { AuthProvider } from '../context/AuthContext'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
			<ChakraProvider theme={theme}>
				<Component {...pageProps} />
			</ChakraProvider>
		</AuthProvider>
	)
}
