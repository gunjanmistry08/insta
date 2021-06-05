import React, { useEffect, useState, useContext } from "react";
import { Usercontext } from "../App";
import { Link } from "react-router-dom";
import Post from "../components/Post";
import { Helmet } from "react-helmet";
import {
  DeleteComment,
  DeletePost,
  LikeHandler,
  MakeComment,
  UnlikeHandler,
} from "../helpers/interactions";

export default function Home() {
  const [data, setdata] = useState([]);

  useEffect(() => {
    fetch("/followingpost", {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setdata(result.posts);
      });
  }, []);

  const LikeHandler = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log("result:",result);
        const NewData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        console.log("data:", NewData);
        setdata(NewData);
      })
      .catch((error) => console.error(error));
  };

  const UnlikeHandler = (data, id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log("result:",result);
        const NewData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setdata(NewData);
        // console.log("data:",data);
      })
      .catch((error) => console.error(error));
  };

  const MakeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log("result:",result)
        const NewData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        // console.log("data:", NewData);
        setdata(NewData);
      })
      .catch((error) => console.error(error));
  };

  const DeletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        const NewData = data.filter((post) => post._id != postId);
        setdata(NewData);
      })
      .catch((error) => console.error(error));
  };

  const DeleteComment = (postId, commentId) => {
    fetch(`/deletecomment/${postId}/${commentId}`, {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const NewData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        console.log(NewData);
        setdata(NewData);
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Helmet>
        <title>Insta8 | Home</title>
      </Helmet>
      <div>
        {data.map((post) => {
          return (
            <Post
              key={post._id}
              post={post}
              LikeHandler={LikeHandler}
              UnlikeHandler={UnlikeHandler}
              MakeComment={MakeComment}
              DeleteComment={DeleteComment}
              DeletePost={DeletePost}
            />
          );
        })}
      </div>
    </>
  );
}
