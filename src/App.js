import './App.css';
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import JobList from './components/JobList';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <ChakraProvider>
      <Header/>
      <JobList />
      <Footer/>
    </ChakraProvider>
  );
}

export default App;