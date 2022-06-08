import { ChakraProvider, Heading } from '@chakra-ui/react'
import React from 'react'
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
  } from 'react-query'
  import { BrowserRouter , Routes, Route, Link } from "react-router-dom";
import Home from './Home/Home'
import Post from './Post/Post'
import {ReactQueryDevtools} from 'react-query/devtools'
 const queryClient = new QueryClient()
 
const App = () => {
    return (
        <ChakraProvider>
        <QueryClientProvider client={queryClient}>
        {/* <Home/> */}
        <BrowserRouter>
        <Routes>
        <Route exact path="/:id" element={<Home/>}/>
        <Route exact path="/post/:id" element={<Post/>}/>
        </Routes>
        </BrowserRouter>
              <ReactQueryDevtools/>
        </QueryClientProvider>
        </ChakraProvider>
    )
}

export default App
