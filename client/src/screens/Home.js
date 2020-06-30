import React, { useEffect, useState, useContext } from 'react';
import { Usercontext } from "../App";
import { Link } from 'react-router-dom';
import Post from '../components/Post';

export default function Home() {
    const [data, setdata] = useState([]);
    const [comment, setcomment] = useState('')
    const { state, dispatch } = useContext(Usercontext)

    useEffect(() => {
        fetch('/followingpost', {
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt'),
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                setdata(result.posts)
            })

    }, [])



    return (
        <div>
            {data.map(post => {
                return (
                    <Post post={post}/> 
                )
            })}
        </div>
    )
}
