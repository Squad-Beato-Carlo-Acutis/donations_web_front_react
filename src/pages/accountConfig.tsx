import { Flex, Box, Text, WrapItem, Avatar, Input, Button, Heading } from '@chakra-ui/react'
import Image from 'next/image'
import Logo from '../../public/assets/images/logo/Donating.png'

export default function AccountConfig() {
    return (
        <Box h='1366' w='100%' bg='#E5E5E5'>
            <Flex justifyContent="space-between" w='100%' bg="#263734" h='210px' >
                <Box alignItems="center"
                    gap="12"
                    padding="16"
                    ml='98px' >
                    <Image src={Logo} />
                </Box>
                <Flex alignItems="center"
                    gap="12"
                    mr='92px'
                    padding="16"
                    paddingTop='20px'
                >
                    <WrapItem >
                        <Avatar
                            w='55px'
                            h='55px'
                            size="md"
                            name="Kola Tioluwani"
                            src="https://bit.ly/kent-c-dodds"
                        />
                    </WrapItem>
                </Flex>
            </Flex>

            <Box h='920px'
                w='1050px'
                bg='#FFFFFF'
                ml='160px'
                mr='80px'
                mt='-95px'
                borderRadius='8px'
            >
                <Heading fontSize='32px'
                    m='40px'
                    paddingTop='36px'
                >
                    Configuar Conta
                </Heading>

                <Box
                    display='flex'
                >
                    <Box h='70px'
                        ml='40px'
                        mt='22px'
                    >
                        <Text  >Nome da conta</Text>
                        <Input
                            placeholder='Nome'
                            w='464px'
                            h='56px'
                            mt='4px'
                        >

                        </Input>
                    </Box>
                    <Box h='70px'
                        ml='40px'
                        mt='22px'
                    >
                        <Text >Apelido</Text>
                        <Input
                            placeholder='Ex: Conselho Central de Barretos'
                            w='464px'
                            h='56px'
                            mt='4px'
                        >
                        </Input>
                    </Box>
                </Box>

                <Box
                    ml='40px'
                    mt='40px'
                >
                    <Text>Descrição</Text>
                    <Input
                        placeholder='Ex: Descreva a finalidade'
                        textAlign='start'
                        paddingBottom='98px'
                        w='968px'
                        h='150px'
                    >

                    </Input>
                </Box>

                <Box display='flex' >
                    <Box h='70px'
                        ml='40px'
                        mt='25px'
                    >
                        <Text >CNPJ</Text>
                        <Input
                            placeholder='Ex: 17.830.029/0001-01'
                            w='464px'
                            h='56px'
                            mt='4px'
                        >
                        </Input>
                    </Box>
                    <Box h='70px'
                        ml='40px'
                        mt='25px'
                    >
                        <Text >Incrição Estadual</Text>
                        <Input
                            placeholder='Digite a inscrição'
                            w='464px'
                            h='56px'
                            mt='4px'
                        >
                        </Input>
                    </Box>
                </Box>

                <Box display='flex' >
                    <Box h='70px'
                        ml='40px'
                        mt='40px'
                    >
                        <Text >Incrição Municipal</Text>
                        <Input
                            placeholder='Digite a incrição'
                            w='464px'
                            h='56px'
                            mt='4px'
                        >
                        </Input>
                    </Box>
                    <Box h='70px'
                        ml='40px'
                        mt='40px'
                    >
                        <Text >Data de fundação</Text>
                        <Input
                            placeholder='Ex: 18/06/2002'
                            w='464px'
                            h='56px'
                            mt='4px'
                        >
                        </Input>
                    </Box>
                </Box>

                <Box h='70px'
                    ml='40px'
                    mt='40px'
                >
                    <Text >E-mail</Text>
                    <Input
                        placeholder='exemplo@exemplo.com'
                        w='968px'
                        h='56px'
                        mt='4px'
                    >
                    </Input>
                </Box>

                <Button
                    bg="#FFC632"
                    type="submit"
                    colorScheme="yellow"
                    size="lg"
                    w='222px'
                    mt='60px'
                    ml='790px'
                >
                    Salvar Configurações
                </Button>

            </Box>
        </Box>
    )
}