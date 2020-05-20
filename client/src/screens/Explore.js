import React, { useEffect, useState, useContext } from 'react';
import { Usercontext } from "../App";
import { Link } from 'react-router-dom';

export default function Explore() {
    const [data, setdata] = useState([]);
    const [comment, setcomment] = useState('')
    const { state, dispatch } = useContext(Usercontext)

    useEffect(() => {
        fetch('/allpost', {
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt'),
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                setdata(result.posts)
            })

    }, [])


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
            {data.map(post => {
                return (
                    <div className='card' key={post._id} style={{ margin: '100px auto', width: '80%' }}>
                        <div className='profile-info'>
                            <img style={{ width: '50px', height: '50px', borderRadius: '25px' }} src={state ? state.pic : "loading"} alt='profile' />
                            <h5><Link to={state._id === post.postedBy._id ? "/profile": "/profile/"+post.postedBy._id }>{post.postedBy.name}</Link></h5>
                            {
                                post.postedBy._id == state._id && <i className="small material-icons" onClick={() => DeletePost(post._id)}>delete</i>
                            }
                        </div>
                        <div className='card-image'>
                            <img src={post.picurl} alt='profile' />
                        </div>
                        <div className='card-content'>

                            <strong>{
                                post.likes.includes(state._id)
                                    ? <i className='small material-icons' style={{ color: 'red' }} onClick={() => UnlikeHandler(post._id)} >favorite</i>
                                    : <i className='small material-icons' style={{ color: 'black' }} onClick={() => LikeHandler(post._id)} >favorite_border</i>
                            }{post.likes.length} Likes</strong>
                            <h5>{post.title}</h5>
                            <h6>{post.body}</h6>
                            {
                                post.comments.map(comment => {
                                    return (
                                        <div className='comments' key={comment._id}>
                                            <h6>
                                                <img style={{ width: '50px', height: '50px', borderRadius: '25px' }} src={require('../media/barbie_joo.jpg')} alt='profile' />
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
            })}
        </div>
    )
}
