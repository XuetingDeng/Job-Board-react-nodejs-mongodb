import React, { useState, useEffect } from 'react';
import {
  Box,Container,Heading,Icon,HStack, Link,Spinner,
  Table,Thead,Tbody,Tfoot,Tr,Th,Td,TableCaption,TableContainer
} from '@chakra-ui/react';

import { FaLink,FaBuilding,FaRegCalendarAlt,FaMapMarkerAlt,FaRegFileAlt } from 'react-icons/fa';
import { MdWork } from 'react-icons/md'; 
import Pagination from '../components/Pagination';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [isFetchLoading, setIsFetchLoading] = useState(false); //if click 'Fetch', show loading dialog
  //paginate分页功能:
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);

  useEffect(() => {
    const fetchJobs = async () => {
        setIsFetchLoading(true);
        try{
            const response = await fetch('http://localhost:3001/api/jobs');
            const data = await response.json();
            setJobs(data);
        }catch(error){
            console.error('Error fetching jobs:', error);
        }
        setIsFetchLoading(false);
    };
    fetchJobs();
  }, []);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <Container maxW="85%" centerContent>
      <Heading as="h1" size="lg" mb="4" mt="4" color="gray.500">
        <Icon as={MdWork} mr="2"/>Today's Job List<Icon as={MdWork} ml="2"/>
      </Heading>

      {isFetchLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100px">
            <Spinner size="xl" /> {/* loading dialog */}
        </Box>
      ) : (
        <TableContainer>
            <Table variant='striped' colorScheme='telegram'>
                <TableCaption>
                    job list table
                </TableCaption>
                <Thead bg="gray.200" fontSize="2xl" height={20}>
                    <Tr>
                        <Th width="20%" fontSize="md" fontWeight="bold" color="blue.600"><Icon as={FaLink} mr="2"/>Job (Click to Check Details)</Th>
                        <Th width="20%" fontSize="md" fontWeight="bold" color="blue.600"><Icon as={FaBuilding} mr="2"/>Company</Th>
                        <Th width="15%" fontSize="md" fontWeight="bold" color="blue.600"><Icon as={FaRegCalendarAlt} mr="2"/>Date</Th>
                        <Th width="35%" fontSize="md" fontWeight="bold" color="blue.600"><Icon as={FaRegFileAlt} mr="2"/>Brief Introduction</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {currentJobs.map(job => (
                        <Tr key={job._id}>
                            <Td>
                                <Link href={job.url} isExternal color="black" fontWeight="bold" _hover={{ textDecoration: 'underline', color: 'blue.600' }}>
                                    {job.jobTitle}
                                </Link>
                            </Td>
                            <Td>{job.company}</Td>
                            <Td>{job.postTime}</Td>
                            <Td>It's a {job.role} postition, {job.type} role, located in {job.location} </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
      )}

      <Pagination 
      currentPage={currentPage}
      jobsPerPage={jobsPerPage}
      totalJobs={jobs.length}
      paginate={paginate}
      />
    </Container>
  );
}

export default JobList;
