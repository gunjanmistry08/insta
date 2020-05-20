import React, { useState, useContext } from 'react';
import M from "materialize-css";
import { useHistory } from 'react-router-dom';
import { Usercontext } from "../App";

export default function Login() {

    const {state,dispatch} = useContext(Usercontext)
    const history = useHistory()
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');

    const LoginHandler = () => {
        fetch("/login",
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }).then(res => res.json())
            .then(data => {
                // console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: 'red darken-2' })
                } else {
                    localStorage.setItem('jwt',data.token)
                    localStorage.setItem('user',JSON.stringify(data.user))
                    dispatch({type:"USER", payload:data.user})
                    history.push('/')
                }
            })
    }


    return (
        <div className='container'>
            <div className='card' style={{width:'80%', margin:'100px auto'}} >
                <h2 className='instagram'>Instagram</h2>
                <input type='text' placeholder='Email..' onChange={(e) => setemail(e.target.value)} value={email} />
                <input type='password' placeholder='Password' onChange={(e) => setpassword(e.target.value)} value={password} />
                <button className='btn waves-effect waves-light black ' onClick={()=>LoginHandler()}>Login</button>
            </div>
        </div>
    )
}