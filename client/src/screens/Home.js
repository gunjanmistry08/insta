import React, { useEffect, useState, useContext } from 'react';
import { Usercontext } from "../App";
import { Link } from 'react-router-dom';
import Post from '../components/Post';
import { Helmet } from "react-helmet";

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
        <>
            <Helmet>
                <title>Insta8 | Home</title>
            </Helmet>
            <div>
                {data.map(post => {
                    return (
                        <Post post={post} />
                    )
                })}
            </div>
        </>
    )
}
