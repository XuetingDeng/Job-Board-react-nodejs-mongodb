import React from 'react';
import { Box } from '@chakra-ui/react';

const Pagination = ({ currentPage, jobsPerPage, totalJobs, paginate }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalJobs / jobsPerPage);
    const pageNeighbours = 1;

    for (let i = 1; i <= totalPages; i++) {
        // show 1st and last page
        if (i === 1 || i === totalPages) {
            pageNumbers.push(i);
        }
        // show current and pre & post page
        else if (i >= currentPage - pageNeighbours && i <= currentPage + pageNeighbours) {
            pageNumbers.push(i);
        }
        // add ...
        else if ((i === currentPage - pageNeighbours - 1 && currentPage > pageNeighbours + 2) || 
                 (i === currentPage + pageNeighbours + 1 && currentPage < totalPages - pageNeighbours - 1)) {
            pageNumbers.push('...');
        }
    }

    // remove 多余 ...
    const uniquePageNumbers = pageNumbers.filter((number, index, self) => 
        number !== '...' || self[index - 1] !== '...'
    );

    return (
        <Box display="flex" justifyContent="center" mt="4">
            {uniquePageNumbers.map((number, index) => (
                <Box
                    key={index}
                    mx="1"
                    px="4"
                    py="2"
                    borderRadius="full"
                    bg="gray.100"
                    cursor="pointer"
                    _hover={{ bg: "gray.300" }}
                    onClick={() => number !== '...' && paginate(number)}
                >
                    {number}
                </Box>
            ))}
        </Box>
    );
};

export default Pagination;
