import React from 'react'
import { Redirect, useHistory } from 'react-router-dom';
import './LikeDislikes.css';


const AlertModal = (props) => {
    const history = useHistory();
    const toggleAlert = () =>{
        return props.setShowAlert(!props.showAlert);
    }
    const handleClick = () =>{
        return history.push('/login')
    }
    return (
       <React.Fragment>
        <div onClick={()=>{ console.log("clickedModal");toggleAlert()}} className={ props.showAlert ? `Modal`:`Modal hiddenOverlay`}>
        </div>
         <div className={ props.showAlert ? `main_modal`:`main_modal hidden none`}>
         
         <div className='modal_header'>
         <div className='modal_title' >
         <h2>Please Login First</h2>
         </div>
       
             <p>In order to save your details you need to login</p>

        </div>
         <div onClick={()=>{handleClick()}} className="btn_class"><button className="btn_login">Login</button></div>
         </div>
         </React.Fragment>
        
    )
}

export default AlertModal
