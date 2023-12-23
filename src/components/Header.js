import React from 'react';
import { Box, Flex, Text, Heading, Spacer, Button } from '@chakra-ui/react';
function Header(){
    const handleFetchButton = () => {
        fetch('http://localhost:3001/api/fetch-jobs')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error fetching jobs:', error));
    };


    return (
        <Box bg="blue.300" w="100%" p={4} color="white">
            <Flex align="center">
                <Heading as="h1" size="lg">Job Board</Heading>
                <Spacer />
                <Button colorScheme="blue" variant="outline">Home</Button>
                <Button colorScheme="blue" variant="outline" ml={4}>Update</Button>
                <Button colorScheme="blue" variant="outline" ml={4} onClick={handleFetchButton}>Fetch</Button>
            </Flex>
        </Box>
    );
}

export default Header;