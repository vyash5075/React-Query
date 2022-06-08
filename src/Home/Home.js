import { useQuery,useMutation,useQueryClient } from "react-query";
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
import { Link, useParams, useNavigate } from "react-router-dom";
import AddNewPost from "./Component/AddNewPost";
import { fetchPosts ,deletePost} from "../api/index";
// const fetchPosts = async (id) => {
//   try {
//     const { data } = await axios.get(
//       `https://gorest.co.in/public/v1/users/500/posts?page=${id}`,{
//           headers:{
//               Authorization:"Bearer 3a6956fd523d5c03f99e71f5eaf5a3c247e93c1cee0e10334c3e2c659e507d10"
//           }
//       }
//     );

//     return data;
//   } catch (error) {
//     throw Error("Unable to fetch posts");
//   }
// };
const Home = () => {
  const history = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const pageId = parseInt(id, 10);
  const cache = useQueryClient();
  const { data, isLoading, error, isError,isSuccess } = useQuery(
    ["posts", pageId],
    () => fetchPosts(pageId),
    {
      keepPreviousData: true,
      onError: (error) => {
        toast({ status: "error", title: error.message });
      },
    }
  );

  const { data: singlePost } = useQuery(["post", 1315], () => fetchPost(1315), {
    enabled: isSuccess,
    onError: (error) => {
      toast({ status: "error", title: error.message });
    },
  });
  const { isLoading: isMutating, mutateAsync } = useMutation(
    "deletePost",
    deletePost,
    {
      onError: (error) => {
        toast({ status: "error", title: error.message });
      },
      onSuccess: () => {
        cache.invalidateQueries("posts");
      },
    }
  );
  return (
    <Container maxW="1300px">
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <>
          <AddNewPost />
          <Flex justify="space-between" mb="4">
            <Button
              colorScheme="red"
              onClick={() => {
                if (data.meta.pagination.links.previous !== null) {
                  history(`/${pageId - 1}`);
                }
              }}
              disable={!data.meta.pagination.links.previous !== null}
            >
              Prev
            </Button>
            <Text>Current Page: {pageId}</Text>
            <Button
              colorScheme="green"
              onClick={() => {
                history(`/${pageId + 1}`);
              }}
            >
              Next
            </Button>
          </Flex>
          {data.data.map((post) => {
            return (
              <Stack
                p="4"
                boxShadow="md"
                borderRadius="xl"
                border="1px solid #ccc"
                key={post.id}
                mb="4"
              >
                <Flex justify="flex-end">
                  <Button
                    size="sm"
                    isLoading={isMutating}
                    onClick={async () => {
                      await mutateAsync({ id: post.id });
                    }}
                  >
                    Delete
                  </Button>
                </Flex>
                <Link to={`/post/${post.id}`}>
                  <Stack>
                    <Flex justify="space-between">
                      <Text>UserID:{post.user_id}</Text>
                      <Text>PostId:{post.id}</Text>
                    </Flex>
                    <Heading fontSize="2xl">{post.title}</Heading>
                    <Text>{post.body}</Text>
                  </Stack>
                </Link>
              </Stack>
            );
          })}
        </>
      )}
    </Container>
  );
};

export default Home;
