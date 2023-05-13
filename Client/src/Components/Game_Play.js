import React, { Component } from 'react'
import{
    Link
  } from "react-router-dom";
import { useState, useEffect} from 'react';

// import io from 'socket.io-client';
// const socket = io.connect("http://localhost:5000")

//const golbalCellCheck = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];


export default function Game_Play(props) {
    
    const room = props.getRoom();
    const socket = props.socket;

    const p1Coin = props.getPlayer1Coin();
    const p2Coin = props.getPlayer2Coin();

    const [cellCheck, setCellCheck] = useState([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
    let newCellCheck = [...cellCheck];
    const cellCheckSkin = [...cellCheck];
    let winningCells = [];

    cellCheckSkin.forEach((value, index, arr) => {
        if(value === 1){
            cellCheckSkin[index] = p1Coin;
        }
        else if(value === 2){
            cellCheckSkin[index] = p2Coin;    
        }
    })


    useEffect(() => {
        socket.on("receive-move", (data) => {
            let move = data.move;//Latest move to store on database or to go to previous moves.
            newCellCheck = [...data.newCellCheck];
            winningCells = data.winningCells;
            if(winningCells.length == 4){
                alert("You Lose");
                props.setMatchOver(true);
            }
            setCellCheck(newCellCheck);

            props.setMyTurn(true);
        })
    }, [socket])
    
    const sendMove = (move) => {
        socket.emit("send-move", {move, newCellCheck, winningCells, room}, (acknowledgement) => {
            props.setMyTurn(false);
            //alert(acknowledgement.status);
        });
    };

    const handleClick = (move) => {

        if(props.getMatchOver() == true){
            return;
        }
        if(props.getMyTurn() === false){
            alert("Opponents turn");
            return;
        }

        move %= 7;
        if(move == 0){
            move = 7;
        }
        
        let cellNum = move - 7;

        for(; cellNum + 7 <= 42; cellNum += 7){
            if(cellCheck[cellNum + 7] != 0){
                break;
            }
        }

        if(cellNum > 0){
            newCellCheck = [...cellCheck];
            let pNo = props.getPlayer1or2();
            newCellCheck[cellNum] = pNo;
            setCellCheck(newCellCheck);
            console.log(newCellCheck);

            winningCells = [];

            //Vertical win
            
            for(let i = cellNum; 1 <= i && i <= 42 && winningCells.length != 4; i += 7){
                if(newCellCheck[i] == pNo){
                    winningCells.push(i);
                }
                else{
                    break;
                }
            }

            //Horizontal win
            if(winningCells.length != 4){
                winningCells = [];
            }

            for(let i = cellNum; 1 <= i && i <= 42 && winningCells.length != 4; i += 1){
                if(newCellCheck[i] == pNo){
                    winningCells.push(i);
                }
                else{
                    break;
                }
                if(i%7 == 0){
                    break;
                }
            }

            for(let i = cellNum - 1; 1 <= i && i <= 42 && winningCells.length != 4; i -= 1){
                if(newCellCheck[i] == pNo){
                    winningCells.push(i);
                }
                else{
                    break;
                }
                if(i%7 == 1){
                    break;
                }
            }

            //Diagonal win (right up)
            if(winningCells.length != 4){
                winningCells = [];
            }

            for(let i = cellNum; 1 <= i && i <= 42 && winningCells.length != 4; i += 6){
                if(newCellCheck[i] == pNo){
                    winningCells.push(i);
                }
                else{
                    break;
                }
                if(i%7 == 1){
                    break;
                }
            }

            for(let i = cellNum - 6; 1 <= i && i <= 42 && winningCells.length != 4; i -= 6){
                if(newCellCheck[i] == pNo){
                    winningCells.push(i);
                }
                else{
                    break;
                }
                if(i%7 == 0){
                    break;
                }
            }

            //Diagonal win (right down)
            if(winningCells.length != 4){
                winningCells = [];
            }

            for(let i = cellNum; 1 <= i && i <= 42 && winningCells.length != 4; i += 8){
                if(newCellCheck[i] == pNo){
                    winningCells.push(i);
                }
                else{
                    break;
                }
                if(i%7 == 0){
                    break;
                }
            }

            for(let i = cellNum - 8; 1 <= i && i <= 42 && winningCells.length != 4; i -= 8){
                if(newCellCheck[i] == pNo){
                    winningCells.push(i);
                }
                else{
                    break;
                }
                if(i%7 == 1){
                    break;
                }
            }

            if(winningCells.length == 4){
                props.setMatchOver(true);
                alert("You Win !!!");
            }
            else{
                winningCells = [];
            }

            sendMove(move);
        }
        else{
            alert("Can't play there\nColumn is full");
        }
    }

    // console.log(cellCheck);    



  return (

    <>

        <div className="play_grid">
            <div className="play_SquareGrid">
                <div className={`play_item-${cellCheckSkin[1]}`} onClick={() => {handleClick(1)}}>1</div>
                <div className={`play_item-${cellCheckSkin[2]}`} onClick={() => {handleClick(2)}}>2</div>
                <div className={`play_item-${cellCheckSkin[3]}`} onClick={() => {handleClick(3)}}>3</div>
                <div className={`play_item-${cellCheckSkin[4]}`} onClick={() => {handleClick(4)}}>4</div>
                <div className={`play_item-${cellCheckSkin[5]}`} onClick={() => {handleClick(5)}}>5</div>
                <div className={`play_item-${cellCheckSkin[6]}`} onClick={() => {handleClick(6)}}>6</div>
                <div className={`play_item-${cellCheckSkin[7]}`} onClick={() => {handleClick(7)}}>7</div>

                <div className={`play_item-${cellCheckSkin[8]}`} onClick={() => {handleClick(8)}}>8</div>
                <div className={`play_item-${cellCheckSkin[9]}`} onClick={() => {handleClick(9)}}>9</div>
                <div className={`play_item-${cellCheckSkin[10]}`} onClick={() => {handleClick(10)}}>10</div>
                <div className={`play_item-${cellCheckSkin[11]}`} onClick={() => {handleClick(11)}}>11</div>
                <div className={`play_item-${cellCheckSkin[12]}`} onClick={() => {handleClick(12)}}>12</div>
                <div className={`play_item-${cellCheckSkin[13]}`} onClick={() => {handleClick(13)}}>13</div>
                <div className={`play_item-${cellCheckSkin[14]}`} onClick={() => {handleClick(14)}}>14</div>
           
                <div className={`play_item-${cellCheckSkin[15]}`} onClick={() => {handleClick(15)}}>15</div>
                <div className={`play_item-${cellCheckSkin[16]}`} onClick={() => {handleClick(16)}}>16</div>
                <div className={`play_item-${cellCheckSkin[17]}`} onClick={() => {handleClick(17)}}>17</div>
                <div className={`play_item-${cellCheckSkin[18]}`} onClick={() => {handleClick(18)}}>18</div>
                <div className={`play_item-${cellCheckSkin[19]}`} onClick={() => {handleClick(19)}}>19</div>
                <div className={`play_item-${cellCheckSkin[20]}`} onClick={() => {handleClick(20)}}>20</div>
                <div className={`play_item-${cellCheckSkin[21]}`} onClick={() => {handleClick(21)}}>21</div>
           
                <div className={`play_item-${cellCheckSkin[22]}`} onClick={() => {handleClick(22)}}>22</div>
                <div className={`play_item-${cellCheckSkin[23]}`} onClick={() => {handleClick(23)}}>23</div>
                <div className={`play_item-${cellCheckSkin[24]}`} onClick={() => {handleClick(24)}}>24</div>
                <div className={`play_item-${cellCheckSkin[25]}`} onClick={() => {handleClick(25)}}>25</div>
                <div className={`play_item-${cellCheckSkin[26]}`} onClick={() => {handleClick(26)}}>26</div>
                <div className={`play_item-${cellCheckSkin[27]}`} onClick={() => {handleClick(27)}}>27</div>
                <div className={`play_item-${cellCheckSkin[28]}`} onClick={() => {handleClick(28)}}>28</div>
           
                <div className={`play_item-${cellCheckSkin[29]}`} onClick={() => {handleClick(29)}}>29</div>
                <div className={`play_item-${cellCheckSkin[30]}`} onClick={() => {handleClick(30)}}>30</div>
                <div className={`play_item-${cellCheckSkin[31]}`} onClick={() => {handleClick(31)}}>31</div>
                <div className={`play_item-${cellCheckSkin[32]}`} onClick={() => {handleClick(32)}}>32</div>
                <div className={`play_item-${cellCheckSkin[33]}`} onClick={() => {handleClick(33)}}>33</div>
                <div className={`play_item-${cellCheckSkin[34]}`} onClick={() => {handleClick(34)}}>34</div>
                <div className={`play_item-${cellCheckSkin[35]}`} onClick={() => {handleClick(35)}}>35</div>
           
                <div className={`play_item-${cellCheckSkin[36]}`} onClick={() => {handleClick(36)}}>36</div>
                <div className={`play_item-${cellCheckSkin[37]}`} onClick={() => {handleClick(37)}}>37</div>
                <div className={`play_item-${cellCheckSkin[38]}`} onClick={() => {handleClick(38)}}>38</div>
                <div className={`play_item-${cellCheckSkin[39]}`} onClick={() => {handleClick(39)}}>39</div>
                <div className={`play_item-${cellCheckSkin[40]}`} onClick={() => {handleClick(40)}}>40</div>
                <div className={`play_item-${cellCheckSkin[41]}`} onClick={() => {handleClick(41)}}>41</div>
                <div className={`play_item-${cellCheckSkin[42]}`} onClick={() => {handleClick(42)}}>42</div>
            </div>
        </div>
    
    </>
  )
}
