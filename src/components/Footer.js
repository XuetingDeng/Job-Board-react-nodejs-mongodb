import React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
function Footer(){
    return (
        <Box bg="white" w="100%" p={4} color="blue.500">
            <Flex justifyContent="center" align="center">
                <Heading as="h1" size="lg">Click 'Fetch' Button to web-crawl new data, wait 5 secs, then refresh the webpage</Heading>
            </Flex>
        </Box>
    );
}

export default Footer;