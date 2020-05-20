import React, { useContext } from 'react';
import { Link, useHistory } from "react-router-dom";
import { Usercontext } from '../App';

const Navbar = () => {

    const history = useHistory()
    const { state, dispatch } = useContext(Usercontext)
    const RenderList = () => {
        if (state) {
            return [
                <li key={'explore'} >
                    <Link to='/explore' >
                        <i className='small material-icons' style={{color:'black'}} >search</i>
                    </Link>
                </li>,
                <li key={'profile'} >
                    <Link to="/profile" style={{ maxHeight: '50px' }}>
                        <img style={{ width: '50px', height: '50px', borderRadius: '25px' }} src={state ? state.pic : "loading"} alt='profile' />
                    </Link>
                </li>,
                <li key={'logout'} >
                    <button className='btn waves-effect waves-light' style={{background:'linear-gradient(to right bottom,#F58529, #DD2A7B, #8134AF, #515BD4)'}} onClick={() => {
                        localStorage.clear()
                        dispatch({ type: "CLEAR" })
                        history.push('/login')

                    }} >Logout</button>
                </li>
            ]
        } else {
            return [
                <li key={'Login'}><Link className="black-text white" to="/login">Login</Link></li>,
                <li key={'Sign up'}><Link className="black-text white" to="/signup">Sign up</Link></li>
            ]
        }
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
        </div>
    )
}

export default Navbar