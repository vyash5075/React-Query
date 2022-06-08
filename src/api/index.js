import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_URL,
  headers: {
    Authorization:
      "Bearer 3a6956fd523d5c03f99e71f5eaf5a3c247e93c1cee0e10334c3e2c659e507d10",
  },
});

export const addNewPost = async ({ title, body }) => {
  try {
    const { data } = await api.post(`/users/500/posts`, {
      title,
      body,
    });
    return data;
  } catch (error) {
    throw Error(error.response.statusText);
  }
};

export const updatePost = async ({ title, body, id }) => {
    try {
        const { data } = await api.patch(
          `/posts/${id}`,
          {
            title,
            body,
          },
          {
            headers: {
              Authorization:
              "Bearer 3a6956fd523d5c03f99e71f5eaf5a3c247e93c1cee0e10334c3e2c659e507d10",
            },
          }
        );
        return data;
      } catch (error) {
    throw Error(error.response.statusText);
  }
};

export const fetchPosts = async (id) => {
  try {
    const { data } = await api.get(`/users/500/posts?page=${id}`);

    return data;
  } catch (error) {
    throw Error("Unable to fetch posts");
  }
};

export const fetchPost = async (id) => {
  try {
    const { data } = await api.get(`/posts/${id}`);

    return data;
  } catch (error) {
    throw Error("Unable to fetch posts");
  }
};
export const deletePost = async ({ id }) => {
    try {
      const { data } = await api.delete(
        `posts/${id}`,
  
        {
          headers: {
            Authorization:
            "Bearer 3a6956fd523d5c03f99e71f5eaf5a3c247e93c1cee0e10334c3e2c659e507d10",
          },
        }
      );
      return data;
    } catch (error) {
      throw Error(error.response.statusText);
    }
  };