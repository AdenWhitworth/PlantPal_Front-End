import SignUp from './SignUp';
import Login from './Login';
import React, { useState } from 'react';

export default function UserAuthentication({setManageDevices}) {

    const [isCurrentUser, setIsCurrentUser] = useState(true);
    const [loginBtnStyle, setloginBtnStyle] = useState("userAuth-toggle-btn-selected");
    const [signUpBtnStyle, setSignUpBtnStyle] = useState("userAuth-toggle-btn");

    const HandleLoginToggle = () => {
        setIsCurrentUser(true);
        setloginBtnStyle("userAuth-toggle-btn-selected");
        setSignUpBtnStyle("userAuth-toggle-btn");
    }

    const HandleSignUpToggle = () => {
        setIsCurrentUser(false);
        setloginBtnStyle("userAuth-toggle-btn");
        setSignUpBtnStyle("userAuth-toggle-btn-selected");
    }

    return (
        <section className="userAuthentication">
            
            <div className="userAuth-sections">

                <div className="userAuth-section-1">
                    <div className='userAuth-selection'>
                        <button onClick={HandleLoginToggle} className={loginBtnStyle}><span>Login</span></button>
                        <button onClick={HandleSignUpToggle} className={signUpBtnStyle}><span>Sign Up</span></button>
                    </div>
                </div>

                {isCurrentUser? <Login setManageDevices={setManageDevices}></Login> : <SignUp setManageDevices={setManageDevices}></SignUp>}

            </div>

        </section>
    );
}