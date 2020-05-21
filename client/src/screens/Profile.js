import React, { useEffect, useState, useContext } from 'react';
import CreatePost from '../components/createPost';
import { Usercontext } from "../App";
import { useHistory } from 'react-router-dom';

export default function Profile() {

    const { state, dispatch } = useContext(Usercontext)
    const [comment, setcomment] = useState('')
    const [data, setdata] = useState('')
    const [posts, setposts] = useState([])
    const [image, setimage] = useState('')
    const histroy = useHistory()

    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt'),
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result.posts);
                setposts(result.posts)
            })
    }, [])

    useEffect(() => {
        if (image) {
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "instagram")
            data.append("cloud_name", "gunjan008")
            fetch("https://api.cloudinary.com/v1_1/gunjan008/image/upload", {
                method: "post",
                body: data
            })
                .then(res => res.json())
                .then(data => {


                    fetch('/updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            console.log(result)
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result.pic })
                            //window.location.reload()
                        })

                })
                .catch(err => {
                    console.error(err)
                })
        }
    }, [image])



    const updatePhoto = (file) => {
        setimage(file)
    }

    const deleteUser = (userid) => {
        fetch(`/deleteuser/${userid}`, {
            method: 'delete',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                dispatch({ type: 'CLEAR' })
                localStorage.clear()
                histroy.push('/login')
            })
            .catch(error => console.error(error))
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
        <div>
            <div className='profile-header'>
                <div>
                    <img
                        style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                        src={state ? state.pic : "loading"}
                        alt='profile'
                    />
                    <div className="file-field input-field" style={{ margin: "0px" }}>
                        <div className="btn btn-floating" style={{ marginBottom: '10px', background: '#8134AF' }}>
                            <span><i className='small material-icons'>edit</i></span>
                            <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" style={{ display: "none" }} />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%' }}>
                    <h4>{state ? state.name : 'loading'} <i className='small material-icons' onClick={() => deleteUser(state._id)} >delete</i> </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', width: "50%" }}>
                        <div>
                            <strong>{posts.length}</strong>
                            <p>posts</p>
                        </div>
                        <div>
                            <strong>{state ? state.followers.length : 'loading'}</strong>
                            <p>followers</p>
                        </div>
                        <div>
                            <strong>{state ? state.following.length : 'loading'}</strong>
                            <p>following</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='gallery'>
                {
                    posts.map(post => {
                        return (
                            <div key={post._id} className='card' style={{ margin: '20px' }}>
                                {
                                    post.postedBy._id == state._id && <i className="small material-icons" onClick={() => DeletePost(post._id)}>delete</i>
                                }
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
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <CreatePost />
        </div>
    )
}
