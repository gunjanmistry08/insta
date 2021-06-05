export const LikeHandler = (data, id) => {
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
      return NewData;
    })
    .catch((error) => console.error(error));
};

export const UnlikeHandler = (data, id) => {
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
      return NewData;
      // console.log("data:",data);
    })
    .catch((error) => console.error(error));
};

export const MakeComment = (data, text, postId) => {
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
      return NewData;
    })
    .catch((error) => console.error(error));
};

export const DeletePost = (data, postId) => {
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
      return NewData;
    })
    .catch((error) => console.error(error));
};

export const DeleteComment = (data, postId, commentId) => {
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
      return NewData;
    })
    .catch((error) => console.error(error));
};
