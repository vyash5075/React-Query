import React from "react";
import { Form, Formik } from "formik";
import { InputControl, SubmitButton, TextareaControl } from "formik-chakra-ui";
import { Heading, Stack, useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { addNewPost, updatePost } from "../../api/index";
// const addNewPost = async ({ title, body }) => {
//   try {
//     const { data } = await axios.post(
//       `https://gorest.co.in/public/v1/users/500/posts`,
//       {
//         title,
//         body,
//       },{
//           headers:{
//               Authorization:"Bearer 3a6956fd523d5c03f99e71f5eaf5a3c247e93c1cee0e10334c3e2c659e507d10"
//           }
//       }
//     );
//     return data;
//   } catch (error) {
//     throw Error(error.response.statusText);
//   }
// };

const AddNewPost = ({ isUpdate, id }) => {
  const toast = useToast();
  const cache = useQueryClient();
  const { isLoading, data, mutateAsync } = useMutation(
    isUpdate ? "updatePost" : "addNewPost",
    isUpdate ? updatePost : addNewPost,
    {
      onSuccess: () => {
        // isUpdate
        //   ? cache.invalidateQueries(["post", id])
        //   : cache.invalidateQueries("posts");
        cache.invalidateQueries("posts");
      },
      //jab humara mutation ka function khatam ho jayega yaani jab post request cmplete then ye trigger toga on success function.
      
      
      onMutate: async (newPost) => {
        if (isUpdate) {
          // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
          await cache.cancelQueries("post");

          // Snapshot the previous value
          const previousPost = cache.getQueryData(["post", id]);

          // Optimistically update to the new value
          cache.setQueryData(["post", id], (old) => {
            console.log(old);  // set a query to replacce old data with new data.
            return { data: newPost };
          });

          // Return a context object with the snapshotted value
          return { previousPost };
        }
      },

      onError: (error, newPost, context) => {
        cache.setQueryData(["post", id], context.previousPost);   //previous post ka data context ki help se yaha le rha hu aur agar data set karwate time koi 
        // error aa jata hai toh wapis jo value pehle tha cache me usi ko restore kar raha hu.
        toast({ status: "error", title: error.message });
      },
      onSettled: () => {
        // cache.invalidateQueries(["post", id]);
      },
    }
  );
  //use mutateAsync to call addNewPost function on subit or on button click
  return (
    <div>
      <Formik
        initialValues={{ title: "", body: "" }}
        onSubmit={async (values) => {
          isUpdate
            ? await mutateAsync({ title: values.title, body: values.body, id })
            : await mutateAsync({ title: values.title, body: values.body });
        }}
      >
        <Form>
          <Stack my="4">
            <Heading fontSize="2xl" textAlign="center">
            {isUpdate ? "Update" : "Add"} New Post
            </Heading>
            <InputControl name="title" label="title" />
            <TextareaControl name="body" label="content" />
            <SubmitButton>{isUpdate ? "Update" : "Add"} Post</SubmitButton>
          </Stack>
        </Form>
      </Formik>
    </div>
  );
};

export default AddNewPost;
