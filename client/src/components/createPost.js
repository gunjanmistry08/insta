import React, { useState,useEffect } from 'react';
import M from "materialize-css";
import { useHistory } from 'react-router-dom';

export default function CreatePost() {

    const history = useHistory()
    const [title, settitle] = useState('');
    const [body, setbody] = useState('')
    const [image, setimage] = useState('')
    const [picurl, setpicurl] = useState('')

    useEffect(()=>{
        if(picurl){
         fetch("/createpost",{
             method:"post",
             headers:{
                 "Content-Type":"application/json",
                 "Authorization":"Bearer "+localStorage.getItem("jwt")
             },
             body:JSON.stringify({
                 title,
                 body,
                 picurl
             })
         }).then(res=>res.json())
         .then(data=>{
     
            if(data.error){
               M.toast({html: data.error,classes:"red darken-2"})
            }
            else{
                M.toast({html:"Created post Successfully",classes:" green darken-2"})
                history.push('/')
            }
         }).catch(err=>{
             console.log(err)
         })
     }
     },[picurl])
   
    const postDetails = ()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","instagram")
        data.append("cloud_name","gunjan008")
        fetch("https://api.cloudinary.com/v1_1/gunjan008/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
           setpicurl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
 
     
    }
    

    return (
        <div>
            <div className='card' style={{width:'80%'}}>
                <h2 className='instagram'>Add Post</h2>
                <input type='text' placeholder='Title..' onChange={(e) => settitle(e.target.value)} value={title} />
                <input type='text' placeholder='Description..' onChange={(e) => setbody(e.target.value)} value={body} />
                <div className='file-field'>
                    <div className="btn">
                        <span><i className='small material-icons'>add</i></span>
                        <input type="file" onChange={(e) => setimage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" placeholder="Upload one or more files" />
                    </div>
                </div>
                <div className='btn' onClick={() => postDetails()}>
                    Upload
                </div>
            </div>
        </div>
    )
}
