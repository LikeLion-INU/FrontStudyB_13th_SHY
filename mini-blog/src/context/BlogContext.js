import React, { createContext, useState, useContext } from "react";
import initialPosts from "../data/posts";

// Create the blog context
const BlogContext = createContext();

// Custom hook to use the blog context
export const useBlog = () => useContext(BlogContext);

// Blog context provider component
export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [nextId, setNextId] = useState(initialPosts.length + 1);
  const [nextCommentId, setNextCommentId] = useState(1);

  // Add a new post
  const addPost = (title, content) => {
    const newPost = {
      id: nextId,
      title,
      content,
      author: "성호영",
      createdAt: new Date().toISOString(),
      comments: [],
    };
    setPosts([...posts, newPost]);
    setNextId(nextId + 1);
    return newPost;
  };

  // Delete a post
  const deletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  // Add a comment to a post
  const addComment = (postId, content, author = "방문자") => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const newComment = {
          id: nextCommentId,
          content,
          author,
          createdAt: new Date().toISOString(),
        };
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    setNextCommentId(nextCommentId + 1);
  };

  // Delete a comment
  const deleteComment = (postId, commentId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter((comment) => comment.id !== commentId),
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  // Get a post by id
  const getPost = (postId) => {
    return posts.find((post) => post.id === parseInt(postId));
  };

  const value = {
    posts,
    addPost,
    deletePost,
    addComment,
    deleteComment,
    getPost,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};
