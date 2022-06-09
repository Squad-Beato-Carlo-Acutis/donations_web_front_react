import { Box, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import Header from '../components/Header';
import Product from "../components/Product";

export default function Dashboard() {
	return (
		<div>
			<Header />
			<Flex px={80} py="70" justifyContent="space-between" bg="#FFF">
				<SimpleGrid columns={5} spacing={10}>
					<Product />
					<Product />
					<Product />
					<Product />
					<Product />
					<Product />
					<Product />
				</SimpleGrid>
			</Flex>
		</div>
	)
}
