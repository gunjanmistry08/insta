import React, { useEffect, useState, useContext } from 'react';
import barbie_joo from "../media/barbie_joo.jpg";
import { Usercontext } from "../App";
import { useParams } from 'react-router-dom';


export default function UserProfile() {

    const [result, setresult] = useState()
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
                setresult(result)
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
                localStorage.setItem('user',JSON.stringify(result))
                setresult((prev) => {
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

                setresult((prev) => {
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

    return (
        <>
            {
                result
                    ?
                    <div>
                        <div className='profile-header'>
                            <div>
                                <img
                                    style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                    src={state ? state.pic : "loading"}
                                    alt='profile'
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%' }}>
                                <h4>{result.user.name}</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', width: "50%" }}>
                                    <div>
                                        <strong>{result.posts.length}</strong>
                                        <p>posts</p>
                                    </div>
                                    <div>
                                        <strong>{result.user.followers.length}</strong>
                                        <p>followers</p>
                                    </div>
                                    <div>
                                        <strong>{result.user.following.length}</strong>
                                        <p>following</p>
                                    </div>
                                    {
                                        showfollow
                                        ? <button className='btn waves-effect waves-light blue darken 1 white-text' style={{margin:'10px'}}  onClick={() => FollowUser(result.user._id)}>Follow</button>
                                        : <button className='btn waves-effect waves-light white red-text'  style={{margin:'10px'}} onClick={() => UnfollowUser(result.user._id)}>Unfollow</button>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='gallery'>
                            {
                                result.posts.map(post => {
                                    return (
                                        <div key={post._id} className='card' style={{ margin: '20px' }}>
                                            <div className='card-image'>
                                                <img src={post.picurl} alt='profile' />
                                            </div>
                                            {/* <div className='card-content'>
                                        <i className='small material-icons' style={{ color: 'red' }}>favorite_border</i>
                                        <strong>399 Likes</strong>
                                        <h5>{post.title}</h5>
                                        <h6>{post.body}</h6>
                                        <p>Nice pic deer</p>
                                    </div> */}
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
