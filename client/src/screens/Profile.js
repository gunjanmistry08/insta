import React, { useEffect, useState, useContext, useRef} from 'react';
import CreatePost from '../components/createPost';
import { Usercontext } from "../App";
import { useHistory, Link } from 'react-router-dom';
import M from 'materialize-css';
import Post from '../components/Post';

export default function Profile() {

    const { state, dispatch } = useContext(Usercontext)
    const [] = useState('')
    const [data, setdata] = useState('')
    const [posts, setposts] = useState([])
    const [image, setimage] = useState('')
    const histroy = useHistory()
    const userfollow = useRef(null)
    const [followers, setfollowers] = useState([])
    const [following, setfollowing] = useState([])

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
            .catch(error => console.error(error))

        fetch('/userfollow', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }

        })
            .then(res => res.json())
            .then(result => {
                // console.log(result)
                setfollowers(result.followers)
                setfollowing(result.following)
                console.log(followers)
                console.log(following)
            })
            .catch(error => console.error(error))
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

    useEffect(() => {
        M.Modal.init(userfollow.current)
    }, [])

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
            .then(() => {
                // console.log(result)
                dispatch({ type: 'CLEAR' })
                localStorage.clear()
                histroy.push('/login')
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
                    <div className='btn waves-effect waves-light white black-text modal-trigger' style={{margin:'10px 0px'}} data-target='modal2'>
                        <i className='material-icons'>group</i>
                    </div>
                    <button className='btn-small btn waves-effect waves-light' style={{margin:'10px 0px', background: 'linear-gradient(to right bottom,#F58529, #DD2A7B, #8134AF, #515BD4)' }} onClick={() => {
                        localStorage.clear()
                        dispatch({ type: "CLEAR" })
                        histroy.push('/login')

                    }}>Logout
                        </button>
                    </div>
                    <div id="modal2" className="modal" ref={userfollow}>
                        <div className="modal-content">
                            <h4>Followers</h4>
                            <div className='divider'></div>
                            {
                                followers.map(follower => {
                                    return (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', margin: '10px' }} key={follower._id}>
                                            <img
                                                style={{ width: "40px", height: "40px", borderRadius: "20px", marginRight: '50px' }}
                                                src={follower ? follower.pic : "loading"}
                                                alt='profile'
                                            />
                                            <Link to={'profile/' + follower._id} style={{ marginRight: 'auto' }}>{follower.name}</Link>
                                        </div>
                                    )
                                })
                            }
                            <div className='divider'></div>
                            <h4 style={{ marginTop: '10px' }}>Following</h4>
                            <div className='divider'></div>
                            {
                                following.map(follow => {
                                    return (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', margin: '10px' }} key={follow._id} >
                                            <img
                                                style={{ width: "40px", height: "40px", borderRadius: "20px", marginRight: '50px' }}
                                                src={follow ? follow.pic : "loading"}
                                                alt='profile'
                                            />
                                            <Link to={'profile/' + follow._id} style={{ marginRight: 'auto' }}>{follow.name}</Link>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {/* <div className="modal-footer">
                            <a href="#!" className="modal-close waves-effect waves-green btn-flat">Agree</a>
                        </div> */}
                    </div>
                </div>
            </div>
            <div className='gallery'>
                {
                    posts.map(post => {
                        return (
                            <Post post={post} />
                        )
                    })
                }
            </div>
            <CreatePost />
        </div>
    )
}
