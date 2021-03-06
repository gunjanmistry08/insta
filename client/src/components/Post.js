import React, { useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Usercontext } from "../App";

export default function Post({
  post,
  DeletePost,
  UnlikeHandler,
  LikeHandler,
  DeleteComment,
  MakeComment,
}) {
  const [comment, setcomment] = useState("");
  const { state } = useContext(Usercontext);

  return (
    <div>
      <div className="card" key={post._id}>
        <div className="profile-info">
          <img
            style={{ width: "50px", height: "50px", borderRadius: "25px" }}
            src={post ? post.postedBy.pic : "loading"}
            alt="profile"
          />
          <h5>
            <Link
              to={
                state._id === post.postedBy._id
                  ? "/profile"
                  : "/profile/" + post.postedBy._id
              }
            >
              {post.postedBy.name}
            </Link>
          </h5>
          {post.postedBy._id == state._id && (
            <i
              className="small material-icons"
              onClick={() => DeletePost(post._id)}
            >
              delete
            </i>
          )}
        </div>
        <div className="card-image">
          <img src={post.picurl} alt="profile" />
        </div>
        <div className="card-content">
          <strong>
            {post.likes.includes(state._id) ? (
              <i
                className="small material-icons"
                style={{ color: "red" }}
                onClick={() => UnlikeHandler(post._id)}
              >
                favorite
              </i>
            ) : (
              <i
                className="small material-icons"
                style={{ color: "black" }}
                onClick={() => LikeHandler(post._id)}
              >
                favorite_border
              </i>
            )}
            {post.likes.length} Likes
          </strong>
          <h5>{post.title}</h5>
          <h6>{post.body}</h6>
          <div className="comments">
            {post.comments.map((comment) => {
              return (
                <div className="comment" key={comment._id}>
                  <h6>
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "25px",
                      }}
                      src={comment.postedBy.pic}
                      alt="profile"
                    />
                    <strong>{comment.postedBy.name} </strong>
                    {comment.text}
                    {post.postedBy._id == state._id && (
                      <i
                        className="tiny material-icons"
                        onClick={() => DeleteComment(post._id, comment._id)}
                      >
                        close
                      </i>
                    )}
                  </h6>
                </div>
              );
            })}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setcomment("");
              MakeComment(e.target[0].value, post._id);
            }}
          >
            <input
              type="text"
              placeholder="add comment.."
              value={comment}
              onChange={(e) => setcomment(e.target.value)}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
