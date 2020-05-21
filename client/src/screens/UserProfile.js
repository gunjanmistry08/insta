import React, { useEffect, useState, useContext } from 'react';
import { Usercontext } from "../App";
import { useParams } from 'react-router-dom';


export default function UserProfile() {

    const [data, setdata] = useState()
    const [comment, setcomment] = useState('')
    const { state, dispatch } = useContext(Usercontext)
    const { userid } = useParams()
    const [showfollow,setShowFollow] = useState(state? !state.following.includes(userid): true)
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt'),
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                setdata(result)
            })
    }, [])


    const FollowUser = (followId) => {
        fetch('/follow', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                dispatch({type:'UPDATE',payload:{following:result.following,followers:result.followers}})
                localStorage.setItem('user',JSON.stringify(data))
                setdata((prev) => {
                    return {
                        ...prev,
                        user:{
                            ...prev.user,
                            followers:[...prev.user.followers,result._id]
                        }
                    }
                })
                setShowFollow(false)
            })
    }
   
    const UnfollowUser = (unfollowId) => {
        fetch('/unfollow', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                unfollowId
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
                localStorage.setItem('user',JSON.stringify(result))

                setdata((prev) => {
                    const newfollower = prev.user.followers.filter(item => item!= result._id)
                    return {
                        ...prev,
                        user:{
                            ...prev.user,
                            followers:newfollower
                        }
                    }
                })
                setShowFollow(true)

            }) 
    }
    const LikeHandler = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json()).then(result => {
            // console.log("result:",result);
            const NewData = data.map(item => {
                if (item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setdata(NewData)
            // console.log("data:",data);
        })
            .catch(error => console.error(error))
    }

    const UnlikeHandler = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json()).then(result => {
            // console.log("result:",result);
            const NewData = data.map(item => {
                if (item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setdata(NewData)
            // console.log("data:",data);
        })
            .catch(error => console.error(error))
    }


    const MakeComment = (text, postId) => {
        fetch('/comment', {
            method: 'put',
            headers: {
                "Authorization": 'Bearer ' + localStorage.getItem('jwt'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                // console.log("result:",result)
                const NewData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setdata(NewData)
                // console.log("data:",data)

            })
            .catch(error => console.error(error))
    }

    const DeletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: 'delete',
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const NewData = data.filter(post => post._id != postId)
                setdata(NewData)
            })
            .catch(error => console.error(error))
    }

    const DeleteComment = (postId, commentId) => {
        fetch(`/deletecomment/${postId}/${commentId}`, {
            method: 'put',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(result => {
                const NewData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setdata(NewData)

            })
            .catch(error => console.error(error))
    }

    return (
        <>
            {
                data
                    ?
                    <div>
                        <div className='profile-header'>
                            <div>
                                <img
                                    style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                    src={data ? data.user.pic : "loading"}
                                    alt='profile'
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%' }}>
                                <h4>{data.user.name}</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', width: "50%" }}>
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
                                    {
                                        showfollow
                                        ? <button className='btn waves-effect waves-light blue darken 1 white-text' style={{margin:'10px'}}  onClick={() => FollowUser(data.user._id)}>Follow</button>
                                        : <button className='btn waves-effect waves-light white red-text'  style={{margin:'10px'}} onClick={() => UnfollowUser(data.user._id)}>Unfollow</button>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='gallery'>
                            {
                                data.posts.map(post => {
                                    return (
                                        <div key={post._id} className='card' style={{ margin: '20px' }}>
                                            <div className='card-image'>
                                                <img src={post.picurl} alt='profile' />
                                            </div>
                                            <div className='card-content'>
                            <strong>{
                                post.likes.includes(state._id)
                                    ? <i className='small material-icons' style={{ color: 'red' }} onClick={() => UnlikeHandler(post._id)} >favorite</i>
                                    : <i className='small material-icons' style={{ color: 'black' }} onClick={() => LikeHandler(post._id)} >favorite_border</i>
                            }{post.likes.length} Likes
                            </strong>
                            <h5>{post.title}</h5>
                            <h6>{post.body}</h6>
                            {
                                post.comments.map(comment => {
                                    return (
                                        <div className='comments' key={comment._id}>
                                            <h6>
                                                <img style={{ width: '50px', height: '50px', borderRadius: '25px' }} src={comment.postedBy.pic} alt='profile' />
                                                <strong>{comment.postedBy.name} </strong>
                                                {comment.text}
                                                {
                                                    post.postedBy._id == state._id && <i className='tiny material-icons' onClick={() => DeleteComment(post._id, comment._id)}>close</i>
                                                }
                                            </h6>
                                        </div>
                                    )
                                })
                            }
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                setcomment('');
                                MakeComment(e.target[0].value, post._id)
                            }}>
                                <input type='text' placeholder='add comment..' value={comment} onChange={(e) => setcomment(e.target.value)} />
                            </form>
                        </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    :
                    <h6>Loading</h6>
            }
        </>
    )
}
