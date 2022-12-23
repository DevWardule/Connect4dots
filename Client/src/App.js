import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';
import Name_color from './Components/Name_color';
import AboutUs from './Components/AboutUs';
import Body from './Components/Body';
import Easy from './Components/Easy';
import Moderate from './Components/Moderate';
import Hard from './Components/Hard';
import Rules_Regulations from './Components/Rules_Regulations';
import Game_Play from './Components/Game_Play';

import{
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useState } from 'react';

import io from 'socket.io-client';
const socket = io.connect("http://localhost:5000")

var myTurn;
var room;
var player1Coin = 1;//initialize from database
var player2Coin = 2;//initialize from database
var player1or2;
var myUserName;//initialize from database
var opponentUserName;
var matchOver = true;

function App() {

  //const [room, setRoom] = useState("");
  //const [myTurn, setMyTurn] = useState(true);
  //const [myCoin, setMyCoin] = useState(1);
  //const [opponentCoin, setOpponentCoin] = useState(2);
  //const [player1or2, setPlayer1or2] = useState(1);

  const setRoom = (data) => {
    room = data;
  }

  const getRoom = () => {
    return room;
  }

  const setMyTurn = (data) => {
    myTurn = data;
  }

  const getMyTurn = () => {
    return myTurn;
  }

  const setPlayer1or2 = (data) => {
    player1or2 = data;
  }

  const getPlayer1or2 = () => {
    return player1or2;
  }

  const getPlayer1Coin = () => {
    return player1Coin;
  }

  const getPlayer2Coin = () => {
    return player2Coin;
  }

  const getMyUserName = () => {
    return myUserName;
  }

  const setOpponentUserName = (data) => {
    opponentUserName = data;
  }

  const getOpponentUserName = () => {
    return opponentUserName;
  }

  const setMatchOver = (data) => {
    matchOver = data;
  }

  const getMatchOver = () => {
    return matchOver;
  }

  // const [cellCheck, setCellCheck] = useState([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1]);

  // const setCellCheckArray = (data) => {
  //   setCellCheck(data);
  // }

  return (
    <div>
      <Router>

        <Navbar/>
        <Routes>
          <Route exact path="/" element={<Body setRoom = {setRoom} getPlayer1or2 = {getPlayer1or2} setPlayer1or2 = {setPlayer1or2} socket = {socket} setMyTurn = {setMyTurn} getMyUserName = {getMyUserName} getOpponentUserName = {getOpponentUserName} setOpponentUserName = {setOpponentUserName} setMatchOver = {setMatchOver}/>}></Route>
          <Route exact path="/easy" element={<Easy/>}></Route>
          <Route exact path="/medium" element={<Moderate/>}></Route>
          <Route exact path="/hard" element={<Hard/>}></Route>
          <Route exact path="/nameColor" element={<Name_color/>}></Route>
          <Route exact path="/aboutUs" element={<AboutUs/>}></Route>
          <Route exact path="/rules" element={<Rules_Regulations/>}></Route>
          <Route exact path="/game" element={<Game_Play getRoom = {getRoom} socket = {socket} getPlayer1Coin = {getPlayer1Coin} getPlayer2Coin = {getPlayer2Coin} getPlayer1or2 = {getPlayer1or2} getMyTurn = {getMyTurn} setMyTurn = {setMyTurn} getMatchOver = {getMatchOver} setMatchOver = {setMatchOver}/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
