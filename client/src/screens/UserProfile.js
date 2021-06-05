import React, { useEffect, useState, useContext } from "react";
import { Usercontext } from "../App";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import { Helmet } from "react-helmet";

export default function UserProfile() {
  const [data, setdata] = useState();
  const [comment, setcomment] = useState("");
  const { state, dispatch } = useContext(Usercontext);
  const { userid } = useParams();
  const [showfollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setdata(result);
      });
  }, []);

  const FollowUser = (followId) => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        dispatch({
          type: "UPDATE",
          payload: { following: result.following, followers: result.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setdata((prev) => {
          return {
            ...prev,
            user: {
              ...prev.user,
              followers: [...prev.user.followers, result._id],
            },
          };
        });
        setShowFollow(false);
      });
  };

  const UnfollowUser = (unfollowId) => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        dispatch({
          type: "UPDATE",
          payload: { following: result.following, followers: result.followers },
        });
        localStorage.setItem("user", JSON.stringify(result));

        setdata((prev) => {
          const newfollower = prev.user.followers.filter(
            (item) => item != result._id
          );
          return {
            ...prev,
            user: {
              ...prev.user,
              followers: newfollower,
            },
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <>
      {data ? (
        <div>
          <Helmet>
            <title>{data.user.name}</title>
          </Helmet>
          <div className="profile-header">
            <div>
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={data ? data.user.pic : "loading"}
                alt="profile"
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "50%",
              }}
            >
              <h4>{data.user.name}</h4>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  width: "50%",
                }}
              >
                <div>
                  <strong>{data.posts.length}</strong>
                  <p>posts</p>
                </div>
                <div>
                  <strong>{data.user.followers.length}</strong>
                  <p>followers</p>
                </div>
                <div>
                  <strong>{data.user.following.length}</strong>
                  <p>following</p>
                </div>
                {window.innerWidth >= 460 ? (
                  <div>
                    {showfollow ? (
                      <button
                        className="btn waves-effect waves-light blue darken-1 white-text"
                        style={{ margin: "10px" }}
                        onClick={() => FollowUser(data.user._id)}
                      >
                        Follow
                      </button>
                    ) : (
                      <button
                        className="btn waves-effect waves-light white red-text"
                        style={{ margin: "10px" }}
                        onClick={() => UnfollowUser(data.user._id)}
                      >
                        Unfollow
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    {showfollow ? (
                      <button
                        className="btn waves-effect waves-light blue darken-1 white-text"
                        style={{ margin: "10px" }}
                        onClick={() => FollowUser(data.user._id)}
                      >
                        <i className="material-icons">person_add</i>
                      </button>
                    ) : (
                      <button
                        className="btn waves-effect waves-light white red-text"
                        style={{ margin: "10px" }}
                        onClick={() => UnfollowUser(data.user._id)}
                      >
                        <i className="material-icons">person</i>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="gallery">
            {data.posts.map((post) => {
              return <Post post={post} />;
            })}
          </div>
        </div>
      ) : (
        <h6>Loading</h6>
      )}
    </>
  );
}
