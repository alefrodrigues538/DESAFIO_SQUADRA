import React from 'react'
import { Button, Container, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Show, Text, useDisclosure } from '@chakra-ui/react'
import NavbarLink from './navbarLink'

import { FaBars } from 'react-icons/fa'
import { GrClose } from 'react-icons/gr'

export default function Navbar() {
    return (
        <nav style={{
            display: 'flex',
            width: "100%",
            backgroundColor: "#3f1fbe",
            color: "#FFF",
            padding: '6px',
            marginBottom: '12px',
            alignItems: 'center'
        }} >
            <NavContent />
            <MobileNavContent />
        </nav>
    )
}

const NavContent = () => {
    return (
        <Show above='766px'>
            <Container maxW={'2xl'}
                display={'inline-flex'}
                justifyContent={'space-between'}
                gap={"48px"}>
                <NavbarLink path='/uf' title='UF' />
                <NavbarLink path='/municipio' title='MUNICIPIO' />
                <NavbarLink path='/bairro' title='BAIRRO' />
                <NavbarLink path='/usuario' title='USUARIO' />
            </Container>
        </Show>
    )
}

const MobileNavContent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Show below='765px'>
            <Text userSelect={'none'} fontSize="2xl">DESAFIO FINAL</Text>
            <Button variant={'outline'} colorScheme={'gray'} margin={'4px 0 4px auto'}
                onClick={onOpen}><FaBars /></Button>
            <Drawer placement={'top'} onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent bg={"#3f1fbe"} color={"#FFF"}>
                    <DrawerHeader borderBottomWidth='1px' display="flex" alignItems={'center'}
                        borderColor={"#fca21a"} padding="8px" >
                        <Text userSelect={'none'}>DESAFIO FINAL</Text>
                        <Button variant={'outline'} colorScheme={'gray'} color='#FFF' margin={'4px 0 4px auto'}
                            onClick={onClose}><GrClose /></Button>
                    </DrawerHeader>
                    <DrawerBody textAlign={'center'}>
                        <NavbarLink path='/uf' title='UF' onClick={() => onClose()} />
                        <NavbarLink path='/municipio' title='MUNICIPIO' onClick={() => onClose()} />
                        <NavbarLink path='/bairro' title='BAIRRO' onClick={() => onClose()} />
                        <NavbarLink path='/usuario' title='USUARIO' onClick={() => onClose()} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Show>
    )
}
