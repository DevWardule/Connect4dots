// import { compare } from 'bcrypt';

import React, { Component, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import{ Link, Navigate, useAsyncError } from "react-router-dom";
// import { Json } from 'sequelize/types/utils';
// const bcrypt = require('bcrypt');





  export default function Navbar(){

    // Login information storing
    const setLoginEmail = () => {

        var currentValue = document.getElementById("LoginEmail").value;
        var setValue = document.getElementById("LoginEmail");
        setValue.value = currentValue;
    }

    const setLoginPassword = () => {

        var currentValue = document.getElementById("LoginPassword").value;
        var setValue = document.getElementById("LoginPassword");
        setValue.value = currentValue;
    }


    //create new account information storing
    const setFirstName = () => {

        var currentValue = document.getElementById("FirstName").value;
        var setValue = document.getElementById("FirstName");
        setValue.value = currentValue;
    }

    const SetLastName = () => {

        var currentValue = document.getElementById("LastName").value;
        var setValue = document.getElementById("LastName");
        setValue.value = currentValue;
    }

    const setUserName = () => {

        var currentValue = document.getElementById("UserName").value;
        var setValue = document.getElementById("UserName");
        setValue.value = currentValue;
    }

    const setCreateEmail = () => {

        var currentValue = document.getElementById("CreateEmail").value;
        var setValue = document.getElementById("CreateEmail");
        setValue.value = currentValue;
    }


    //validating the difficulty of password
    const [PasswordDifficulty,SetPasswordDifficulty] = useState(0);
    const setCreatePassword = () => {

        var createPassword = document.getElementById("CreatePassword").value;
        var setValue = document.getElementById("CreatePassword");
        setValue.value = createPassword;

        var capitalLetter = 0;
        var smallLetter = 0;
        var length = 0;
        var digit = 0;
        var specialCharacter = 0;

        length = createPassword.length;
        for(let i=0;i<length;i++){

            if(createPassword[i]>='A' && createPassword[i]<='Z'){
                capitalLetter++;
            }
            else if(createPassword[i]>='a' && createPassword[i]<='z'){
                smallLetter++;
            }
            else if(createPassword[i]>='0' && createPassword[i]<='9'){
                digit++;
            }
            else{
                specialCharacter++;
            }
        }

        if(length<8 || digit==0 || capitalLetter==0 || smallLetter==0 || specialCharacter==0){
            SetPasswordDifficulty(0);
            document.getElementById("PasswordDifficulty").innerHTML="Password should contain minimum of 8 characters with atleast 1 capital letter,1 small character,1 digit and 1 special characters";
        }
        else{
            SetPasswordDifficulty(1);
            document.getElementById("PasswordDifficulty").innerHTML="";
        }
    }


    //validating the password and confirm password
    const [PasswordValidation,SetPasswordValidation] = useState(0);
    const SetConfirmPassword = () => {

        var confirmPassword = document.getElementById("ConfirmPassword").value;
        var setValue = document.getElementById("ConfirmPassword");
        setValue.value = confirmPassword;

        var createPassword = document.getElementById("CreatePassword").value;

        if(createPassword!=confirmPassword){
            SetPasswordValidation(0);
            document.getElementById("PasswordValidation").innerHTML="The Confirm password and Password does not match";
        }
        else{
            SetPasswordValidation(1);
            document.getElementById("PasswordValidation").innerHTML="";
        }
    }
      
    
    
    //collecting the data of new account created
    const [name,setName] = useState("");

        const collectData = async () =>{

            var UserName = document.getElementById("UserName").value;
            var CreateEmail = document.getElementById("CreateEmail").value;
            var CreatePassword = document.getElementById("CreatePassword").value;
            var FirstName = document.getElementById("FirstName").value;
            var LastName = document.getElementById("LastName").value;


            //collecting the data of new user account created
            console.warn(UserName,CreateEmail,CreatePassword);
            const result = await fetch('http://localhost:3000/api/adduser',{
                method:'post',
                body: JSON.stringify({UserName,CreateEmail,CreatePassword,FirstName,LastName}),
                headers:{
                    'Content-Type': 'application/json'
                }
           });
           const finalresult = await result.json();
            //this keeps data in localstorage even we close the tab
            localStorage.setItem("user",JSON.stringify(finalresult.user));
            localStorage.setItem("token",JSON.stringify(finalresult.auth));

            console.warn(finalresult);
        }

        const Login = async ()=>{

            var LoginEmail = document.getElementById("LoginEmail").value;
            var LoginPassword = document.getElementById("LoginPassword").value;
            console.warn(LoginEmail,LoginPassword);
            const user = await fetch('http://localhost:3000/api/finduser',{
                method : 'post',
                body : JSON.stringify({LoginEmail,LoginPassword}),
                headers:{
                    'Content-Type': 'application/json'
                }
            });

            const finalresult = await user.json();
            if(finalresult.auth)
            {
                console.warn("find");
                localStorage.setItem("user",JSON.stringify(finalresult.user));
                localStorage.setItem("token",JSON.stringify(finalresult.auth));
                setName(finalresult.user.UserName);
            }
            console.warn(finalresult);
        }

        const namestring = localStorage.getItem("user");
        
        useEffect(() => {
            if(namestring)
            {
                const nameobj = JSON.parse(namestring);
                setName(nameobj.name);
            }
            
        }, [])
        

        const logout = () =>{
            localStorage.clear();
            setName("");
            //Navigate('/');
        }


        return(

            <>
            
            <nav className="navbar navbar-expand-lg navbar-light bg-info">
                <div className="container-fluid">

                {
                    name ?<Link className="navbar-brand" to="/nameColor">{name}</Link>:
                    <Link className="navbar-brand" to="/nameColor">Player Name</Link>
                }                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/aboutUs">About Us</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/rules">Rules</Link>
                            </li>
                        </ul>
                        {
                            name?<button type="button" className="btn btn-outline-danger login"  onClick={logout} >Logout</button>:
                            <button type="button" className="btn btn-outline-danger login" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
                        }
                        <button type="button" className="btn btn-outline-danger">Audio</button>
                    </div>
                </div>
            </nav>

            {/* login modal */}
            <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-body">

                        <form>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                <input type="email" onChange = {setLoginEmail} className="form-control" id="LoginEmail" aria-describedby="emailHelp"/>
                                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="LoginPassword" className="form-label">Password</label>
                                <input type="password" onChange = {setLoginPassword} className="form-control" id="LoginPassword"/>
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                                <label className="form-check-label" htmlFor="exampleCheck1">I am not Robot</label>
                            </div>
                        </form>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createAccModal">Create new Account</button>    
                            <Link to="/aboutUs"><button type="button" onClick={Login} className="btn btn-primary" data-bs-dismiss="modal">Login</button></Link>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                
                            {/* <!-- <button type="button" className="btn btn-primary">Save changes</button> --> */}
                        </div>
                    </div>
                </div>
            </div>


            {/* create account modal */}

            <div className="modal fade" id="createAccModal" tabIndex="-1" aria-labelledby="createAccModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content ">
                <div className="modal-header">
                    <h5 className="modal-title" id="createAccModalLabel">Create New Account</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    

                <form>

                    <div className="input-group my-3">
                        <span className="input-group-text">First and last name <span style={{color: 'red'}}>*</span> </span>
                        <input type="text" onChange = {setFirstName} id='FirstName' aria-label="First name" className="form-control"/>
                        {/* <!-- <input type="text" aria-label="middle name" className="form-control"> --> */}
                        <input type="text" onChange = {SetLastName} id='LastName' aria-label="Last name" className="form-control"/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="userName" className="form-label">User Name <span style={{color: 'red'}}>*</span> </label>
                        <input type="text" onChange = {setUserName} className="form-control" id="UserName"/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address <span style={{color: 'red'}}>*</span> </label>
                        <input type="email" onChange = {setCreateEmail} className="form-control" id="CreateEmail" aria-describedby="emailHelp"/>
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="CreatePassword" className="form-label">Password <span style={{color: 'red'}}>*</span> </label>
                        <input type="password" onChange = {setCreatePassword} className="form-control" id="CreatePassword"/>
                        <span id="PasswordDifficulty" style={{color:"red"}}></span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ConfirmPassword" className="form-label">Confirm Password <span style={{color: 'red'}}>*</span> </label>
                        <input type="password" onChange={SetConfirmPassword} className="form-control" id="ConfirmPassword"/>   
                        <span id="PasswordValidation" style={{color:"red"}}></span> 
                    </div>
                    
                    {/* <button type="submit" className="btn btn-primary my-3">Submit</button> */}
                    </form>

                    <p><span style={{color: 'red'}}>*</span> are required fields</p>

                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" onClick={collectData} disabled={PasswordDifficulty===0 || PasswordValidation===0} className="btn btn-primary" data-bs-dismiss="modal">Create</button>
                </div>
                </div>
            </div>
            </div>

            </>

        )
    
}