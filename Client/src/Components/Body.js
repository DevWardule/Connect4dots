import React, { Component } from 'react'
import{
    Link
  } from "react-router-dom";
import { useEffect} from 'react';

// import io from 'socket.io-client';
// const socket = io.connect("http://localhost:5000")

export default function Body(props) {

    const socket = props.socket;
    let amPlayer1or2 = 0;//Get from user if casual
    let createRoomId;
    let joinRoomId;

    useEffect(() => {
        socket.on("joiner-data", (data) => {
            props.setOpponentUserName(data.userName);
            let room = data.room;
            let userName = props.getMyUserName();
            let creatorPlayerNumber = props.getPlayer1or2();
            socket.emit("creator-data", {room, userName, creatorPlayerNumber}, (acknowledgement) => {
                
            });
            
            //Here redirect to game screen
        })

        socket.on("creator-data", (data) => {
            props.setOpponentUserName(data.userName);
            let creatorPlayerNumber = data.creatorPlayerNumber;

            if(creatorPlayerNumber === 1){
                props.setPlayer1or2(2);
                props.setMyTurn(false);
            }
            else{
                props.setPlayer1or2(1);
                props.setMyTurn(true);
            }

            //Here redirect to game screen
        })
    }, [socket])

    const createRoom = () => {
        let room = createRoomId;
        
        props.setRoom(room);
        if(amPlayer1or2 === 0){
            amPlayer1or2 = Math.floor(Math.random() * 2) + 1;
        }
        props.setPlayer1or2(amPlayer1or2);
        if(amPlayer1or2 === 1){
            props.setMyTurn(true);
        }
        else{
            props.setMyTurn(false);
        }

        socket.emit("create-room", {room}, (acknowledgement) => {
            let ack = acknowledgement.status;
            if(ack === "Room already created"){
                alert(ack);
            }
        });
    }

    const joinRoom = () => {
        let room = joinRoomId;
        let userName = props.getMyUserName();
        socket.emit("join-room", {room, userName}, (acknowledgement) => {
            let ack = acknowledgement.status;
            if(ack === "Room not created"){
                alert(ack);
            }
            else if(ack === "Room is full"){
                alert(ack);
            }
        });
        props.setRoom(room);
    }
    
    const leaveRoom = () => {
        const room = props.room;//room not in props needs to be changed
        if(props.room !== ""){
            socket.emit("leave-room", {room}, (acknowledgement) => {
                alert(acknowledgement.status);
            });
        }
    }

    const handleCopyClick = ()=>{
        var text = document.getElementById('Code')
        text.select()
        navigator.clipboard.writeText(text.value)
    }

    // window.addEventListener('beforeunload', function (event) {
    //     // Cancel the event
    //     event.preventDefault();
    //     // Chrome requires returnValue to be set
    //     event.returnValue = '';
      
    //     // Show the popup
    //     alert('Are you sure you want to leave this page?');
    //   });

    return (

        <>
        <div className="shift">

            
            <div className="container-lg col-4 bg-light Play">
                <button type="button" className="btn btn-primary play_comp" data-bs-toggle="modal" data-bs-target="#computerModal">Play With Computer</button>
                <br />
                <button type="button" className="btn btn-primary play_fri" data-bs-toggle="modal" data-bs-target="#friendModal">Play With Friend</button>
                <br />
                <button type="button" className="btn btn-primary play_on">Play Online</button>
            </div>

            <div>

            {/* <!--  friend Modal --> */}
            <div className="modal fade" id="friendModal" tabIndex="-1" aria-labelledby="friendModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-body">

                            <div className="container ">
                                <button className="btn btn-primary game_button_1" data-bs-toggle="modal"
                                    data-bs-target="#createModal">Create Game</button>
                                <button className="btn btn-primary game_button_2" data-bs-toggle="modal" data-bs-target="#joinModal">Join
                                    Game</button>

                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            {/* <!-- <button type="button" className="btn btn-primary">Save changes</button> --> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* <!--Create  Modal Button --> */}
            <div className="modal fade" id="createModal" tabIndex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title " id="createModalLabel">Play with friend</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col">
                                        <input type="text" className="form-control" id='Code' placeholder="Enter the code (e.g)" value = {createRoomId} onChange={(event) => {
                                            createRoomId = event.target.value;
                                        }}/>
                                </div>
                            </div>

                            <div className="row">

                                <div className="col">
                                    <div className="btn-group time_button">
                                        <button type="button" className="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Time Control</button>
                                        <ul className="dropdown-menu drop_down">
                                            <li className="dropdown-item" >1min</li>
                                            <li className="dropdown-item" >5min</li>
                                            <li className="dropdown-item" ><button className="btn custom_button">Custom</button></li>
                                        </ul>
                                        <button type="button" className="btn btn-primary" onClick={handleCopyClick}>Copy Code</button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="btn-group col" role="group" aria-label="Basic radio toggle button group">
                                    <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" />
                                    <label className="btn btn-outline-primary rated_button" htmlFor="btnradio1">Rated</label>

                                    <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off"/>
                                    <label className="btn btn-outline-primary casual_button" htmlFor="btnradio2">Casual</label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                        <Link to="/game"><button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={createRoom}>Join</button></Link>
                        </div>
                    </div>
                </div>
            </div>


            {/* <!--Join  Modal Button --> */}
            <div className="modal fade" id="joinModal" tabIndex="-1" aria-labelledby="joinModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="joinModalLabel">Enter the Code</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col">
                                    <input type="text" className="form-control" placeholder="Enter the Code" value={joinRoomId} onChange={(event) => {
                                        joinRoomId = event.target.value;
                                    }}/>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                        <Link to="/game"><button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={joinRoom}>Join</button></Link>
                        </div>
                    </div>
                </div>
            </div>
            </div>


            {/* computer modal */}
            <div className="modal fade" id="computerModal" tabIndex="-1" aria-labelledby="computerModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-body">

                            <div className="container">

                                <div className="row">

                                    <div className="col">
                                        <div className="btn-group time_button_computer">
                                            <button type="button" className="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Time Control</button>
                                            <ul className="dropdown-menu drop_down_computer">
                                                <li className="dropdown-item" >1min</li>
                                                <li className="dropdown-item" >5min</li>
                                                <li className="dropdown-item" ><button className="btn custom_button">Custom</button></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="Level">
                                    <Link to="/easy"><button type="button" className="btn btn-primary " data-bs-dismiss="modal">Easy</button></Link>
                                    <Link to="/medium"><button type="button" className="btn btn-primary " data-bs-dismiss="modal">Moderate</button></Link>
                                    <Link to="/hard"><button type="button" className="btn btn-primary " data-bs-dismiss="modal">Hard</button></Link>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            {/* <!-- <button type="button" className="btn btn-primary">Save changes</button> --> */}
                        </div>
                    </div>
                </div>
            </div>


            {/* square grid */}

            <div className="grid">
                <div className="SquareGrid">
                    <Link className="item" to="/easy"><div>1</div></Link>
                    <Link className="item" to="/easy"><div>2</div></Link>
                    <Link className="item" to="/easy"><div>3</div></Link>
                    <Link className="item" to="/easy"><div>4</div></Link>
                    <Link className="item" to="/easy"><div>5</div></Link>
                    <Link className="item" to="/easy"><div>6</div></Link>
                    <Link className="item" to="/easy"><div>7</div></Link>
                    <Link className="item" to="/easy"><div>8</div></Link>
                    <Link className="item" to="/easy"><div>9</div></Link>
                </div>
            </div>

        </div>
        </>
    )
  
}
