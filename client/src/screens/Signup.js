import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import M from "materialize-css";

export default function Signup() {

    const history = useHistory()

    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")

    const SignupHandler = () => {
        fetch("/signup",
            {
                method: "post",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({html: data.error, classes:'red darken-2'})
                } else {
                    M.toast({html:'Account Created Successfully', classes:'green draken-2'})
                    history.push('/login')
                }
            })
    }

    return (
        <div className='container'>
            <div className='card' style={{width:'80%',margin:'100px auto' }} >
                <h2 className='instagram'>Instagram</h2>
                <input type='text' placeholder='Name' value={name} onChange={(e) => setname(e.target.value)} />
                <input type='text' placeholder='Email..' value={email} onChange={(e) => setemail(e.target.value)} />
                <input type='password' placeholder='Password' value={password} onChange={(e) => setpassword(e.target.value)} />
                <button className='btn waves-effect waves-light black'onClick={() => SignupHandler()}>Sign Up</button>
            </div>
        </div>
    )
}
