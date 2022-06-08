import { useQuery } from "react-query";
import axios from "axios";
import React from "react";
import {
  Container,
  Heading,
  Stack,
  Flex,
  Text,
  Grid,
  Spinner,
  useToast,
  Button,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import AddNewPost from "../Home/Component/AddNewPost";
import {fetchPost} from '../api/index'
// const fetchPost = async (id) => {
//   try {
//     const { data } = await axios.get(
//       `https://gorest.co.in/public/v1/posts/${id}`
//     );

//     return data;
//   } catch (error) {
//     throw Error("Unable to fetch posts");
//   }
// };
const Post = () => {
  const toast = useToast();
  const { id } = useParams();
 
  const { data, isLoading, error, isError } = useQuery(
    ["post", parseInt(id)],
    () => fetchPost(id),
    {
      onError: (error) => {
        toast({ status: "error", title: error.message });
      },
    }
  );
  return (
    <Container maxW="1300px">
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <>
        <AddNewPost isUpdate={true} id={data.data.id}/>
          
          <Stack
                p="4"
                boxShadow="md"
                borderRadius="xl"
                border="1px solid #ccc"
                key={data.data.id}
                mb="4"
              >
                <Flex justify="space-between">
                  <Text>UserID:{data.data.user_id}</Text>
                  <Text>PostId:{data.data.id}</Text>
                </Flex>
                <Heading fontSize="2xl">{data.data.title}</Heading>
                <Text>{data.data.body}</Text>
              </Stack>
        </>
      )}
    </Container>
  );
};

export default Post;
