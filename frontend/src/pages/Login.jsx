import React from "react";
import "../styles/Login.css";
import {useState} from "react";


 export default function Login (){
    let [isLogin, setIsLogin] = useState(true);
    return(
        
        <div className="container">
            <h1 className="title">Welcome to LinkSutra</h1>
            <div className="form-container">
                <div className="form-toggle">
                    <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Login</button>
                    <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Sign-In</button>
                </div>
                {isLogin ?<>
                    <form className="form">
                        <h2>Login</h2>
                        <input type="text" placeholder="Username" />
                        <input type="password" placeholder="Password" />
                        <a href="#">Forgot Password?</a>
                        <button type="submit">Login</button>
                        <p>Don't have an account? <a href="#" onClick={() => setIsLogin(false)}>Sign Up</a></p>

                    </form>
                </>
                :<>
                    <form className="form">
                        <h2>Sign In</h2>
                        <input type="text" placeholder="Name" />
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        <button type="submit">Sign In</button>
                    </form>
                </>
                }
            </div>
        </div>
    )
}