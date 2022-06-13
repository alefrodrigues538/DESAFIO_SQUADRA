import { Text } from '@chakra-ui/react';
import React from 'react'
import { Link } from 'react-router-dom'

interface props {
    title: string;
    path: string;
    onClick?: VoidFunction
}
const NavbarLink: React.FC<props> = ({ title, path, onClick }) => {
    return (
        <Link to={path || '#'} onClick={onClick}>
            <Text fontSize={'2xl'}
                padding={'6px 12px'} borderRadius={'8px'}
                _hover={{ backgroundColor: "#ffb11f", color: "#444" }}>
                {title}
            </Text>
        </Link >
    )
}
export default NavbarLink