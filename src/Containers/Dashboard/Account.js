import Button from '../../Components/Button';
import InputField from '../../Components/InputField';
import mail from '../../Images/email-brown.svg';
import x_circle from '../../Images/x-circle-black.svg';
import user_circle from '../../Images/user-circle-brown.svg';
import tag from '../../Images/tag-brown.svg';
import gear from '../../Images/gear-grey.svg';
import "../../App.css";
import React, {useEffect, useState} from 'react';
import {useAuth} from '../../Provider/AuthProvider';
import axios from "axios";

export default function Account() {

    const [editToggle, setEditToggle] = useState(false);
    const [dissableInput, setDissableInput] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('Error');
    const [errorCSS, setErrorCSS] = useState('error-message hidden');
    const { token, user, setUser } = useAuth();

    const client = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        
        headers: {
            "Authorization": "Bearer " + token
        }
        
    });

    useEffect(() => {
        console.log(user);
    },[user])

    const handleSaveClick = async () => {
        
        try {
            const response = await client.post("/users/updateUser", { email: email, first_name: firstName, last_name: lastName});
            setErrorCSS('error-message hidden');
            setUser({
                first_name: response.data.user.first_name,
                last_name: response.data.user.last_name,
                email: response.data.user.email,
                user_id: response.data.user_id
            });

            setDissableInput(true);
            setEditToggle(false);
            
        } catch (error) {
            setError(error.response.data.message);
            setErrorCSS('error-message');
        }   
    }

    const handleEditClick = () => {
        setDissableInput(false);
        setEditToggle(true);
    }

    const handleCloseClick = () => {
        setDissableInput(true);
        setEditToggle(false);
    }

    return (
        <div className="account-section-2">

            {editToggle?
                <div className='account-close'>
                    <img className='grow' src={x_circle} alt='Close Icon' onClick={handleCloseClick}></img>
                </div>
                :
                <></>
            }
                    
            <div className='account-logo'>
                <img className="account-logo-img" src={gear} alt="Account logo"></img>
                <h1 className="account-logo-txt">Account</h1>
            </div>
            
            <InputField onChange={(e) => setFirstName(e.target.value)} inputImg={user_circle} isRequired={true} type='text' placeholder={editToggle? "First Name" : user.first_name} isSpellCheck={false} setWidth={'60%'} isDisabled={dissableInput} isPrimaryStyle={editToggle}></InputField>
            <InputField onChange={(e) => setLastName(e.target.value)} inputImg={tag} isRequired={true} type='text' placeholder={editToggle? "Last Name" : user.last_name} isSpellCheck={false} setWidth={'60%'} isDisabled={dissableInput} isPrimaryStyle={editToggle}></InputField>
            <InputField onChange={(e) => setEmail(e.target.value)} inputImg={mail} isRequired={true} type='email' placeholder={editToggle? "Email" :user.email} isSpellCheck={false} setWidth={'60%'} isDisabled={dissableInput} isPrimaryStyle={editToggle}></InputField>
            
            <div className='account-section-2-btns'>
                <button className='text-btn'><span>Change Password?</span></button>
                {editToggle?
                    <Button children='Save' onClick={handleSaveClick} isPrimaryStyle={false}></Button>
                    :
                    <Button children='Edit' onClick={handleEditClick} isPrimaryStyle={false}></Button>
                }
            </div>
            
            <h4 className={errorCSS}>{error}</h4>

        </div>
    );
}