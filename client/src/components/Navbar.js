import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { Usercontext } from '../App';

const Navbar = () => {

    const history = useHistory()
    const searchmodal = useRef(null)
    const { state, dispatch } = useContext(Usercontext)
    const [search, setsearch] = useState('')
    const [users, setusers] = useState([])
    useEffect(() => {
        M.Modal.init(searchmodal.current)
    }, [])
    const RenderList = () => {
        if (state) {
            return [
                <li key={'search'}><i className='large material-icons modal-trigger' data-target='modal1' style={{ color: 'black' }}> search</i></li>,
                <li key={'explore'} >
                    <Link to='/explore' >
                        <i className='large material-icons' style={{ color: 'red' }} >whatshot</i>
                    </Link>
                </li>,
                <li key={'profile'} >
                    <Link to="/profile" style={{ maxHeight: '50px' }}>
                        <img style={{ width: '50px', height: '50px', borderRadius: '25px' }} src={state ? state.pic : "loading"} alt='profile' />
                    </Link>
                </li>
            ]
        } else {
            return [
                <li key={'Login'}><Link className="black-text white" to="/login">Login</Link></li>,
                <li key={'Sign up'}><Link className="black-text white" to="/signup">Sign up</Link></li>
            ]
        }
    }

    const SearchUser = (name) => {
        setsearch(name)
        fetch('/searchuser', {
            method: 'post',
            headers: {
                'Authorization': "Bearer " + localStorage.getItem('jwt'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: name
            })
        }).then(res => res.json())
            .then(results => {
                console.log(results)
                setusers(results)
            })
    }

    return (
        <div>
            <nav>
                <div className="nav-wrapper white">
                    <Link to={state ? '/' : '/login'} className="brand-logo instagram left black-text">Instagram</Link>
                    <ul id="nav-mobile" className="right">
                        {RenderList()}
                    </ul>
                </div>
            </nav>
            <div id="modal1" className="modal" ref={searchmodal}>
                <div className="modal-content">
                    <h4>Search</h4>
                    <input type='text' placeholder='Search username' value={search} onChange={(e) => SearchUser(e.target.value)} />
                    <ul className="collection">
                        {
                            users.map(user => {
                                return (
                                    <Link to={state._id === user._id ? "/profile": "/profile/"+user._id } >
                                        <li className='collection-item modal-close' onClick={() => {
                                            setsearch('')
                                            setusers([])
                                        }}>{user.name}</li>
                                    </Link>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-light btn-flat" onClick={() => {
                        setsearch('');
                        setusers([]);
                    }} >Close</button>
                </div>
            </div>
        </div>

    )
}

export default Navbar