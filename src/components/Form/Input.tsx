import { FormControl, FormLabel, Input as ChakraInput, FormErrorMessage, InputProps as ChakraInputProps } from '@chakra-ui/react';
import React from 'react';

// import { Container } from './styles';

interface InputProps extends ChakraInputProps {
	type?: string;
	name: string;
	label?: string;
	placeholder?: string;
	validation?: () => void;
	errors?: {};
}

const Input: React.FC = ({ name, label, placeholder, validation, errors, ...rest }: InputProps) => {

	const error = errors?.[name];
	const errorMessage = errors?.[name].message;

	return (
		<FormControl isInvalid={error}>
			{!!label &&
				<FormLabel color="#FFF" htmlFor={name}>
					{label}
				</FormLabel>
			}
			<ChakraInput
				size="lg"
				bgColor="#D7D7D7"
				focusBorderColor='#FDD65B'
				variant="filled"
				color="gray.900"
				id={name}
				placeholder={placeholder}
				{...validation}
				{...rest}
			/>
			{error && (
				<FormErrorMessage>
					{errorMessage}
				</FormErrorMessage>
			)}
		</FormControl>
	);
}

export default Input;
