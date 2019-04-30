import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import config from '../gameConfig';
import { GameStatus } from '../types/Enum';

const Header = ({
  timeRemaining,
  score,
  hiScore,
  setInfoModalIsDisplayed,
  gameStatus,
  restartGame,
}: {
  timeRemaining: number;
  score: number;
  hiScore: number;
  setInfoModalIsDisplayed: Dispatch<SetStateAction<boolean>>;
  gameStatus: GameStatus;
  restartGame: any;
}) => {
  const infoModal = () => {
    setInfoModalIsDisplayed(true);
  };
  return (
    <Styles>
      <header>
        <h1>Rhino Ski!</h1>
        <p className={'timer' + (timeRemaining < 1 ? ' danger' : '')}>
          {timeRemaining || config.timeLimit}
        </p>
        {gameStatus === GameStatus.Over && (
          <>
            <p className="game-over danger">Game Over</p>
            <button className="play-again" onClick={restartGame}>
              [ Play Again? ]
            </button>
          </>
        )}
        <table className="score">
          <tbody>
            <tr>
              <td className="label">Score:</td>
              <td className="amount">{score || 0}</td>
              <td className="label">High Score:</td>
              <td className="amount">
                {hiScore || localStorage.getItem(config.hiScoreFieldName) || 0}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="info">
          <button onClick={infoModal}>[ ? ]</button>
        </p>
      </header>
    </Styles>
  );
};

const Styles = styled.span`
  header {
    padding: 0;
    margin: 0;
    height: 100px;
    width: 100%;
    background: #ececec;
    position: relative;
  }
  header h1 {
    margin: 20px 0 0 0;
    padding: 0;
    text-align: center;
    position: absolute;
    bottom: 20px;
    left: 15px;
    font-size: 18px;
  }
  p {
  }
  p.info {
    font-size: 20px;
    position: absolute;
    bottom: 5px;
    right: 35px;
    cursor: pointer;
  }
  button {
    padding: 6px;
    font-size: 18px;
    border: 0;
    background: transparent;
    cursor: pointer;
  }
  p.timer {
    font-size: 40px;
    margin: 0;
    padding: 0;
    position: absolute;
    top: 10px;
    left: 15px;
    text-align: center;
  }
  p.game-over {
    font-size: 40px;
    margin: 0;
    padding: 0;
    position: absolute;
    top: 10px;
    width: 100%;
    text-align: center;
  }
  button.play-again {
    padding: 6px;
    font-size: 18px;
    border: 0;
    background: transparent;
    cursor: pointer;
    margin-top: 50px;
  }
  table.score {
    position: absolute;
    top: 5px;
    right: 5px;
  }
  table.score td.label {
    width: 90px;
    text-align: right;
  }
  table.score td.amount {
    width: 60px;
    text-align: left;
    font-weight: bold;
  }
  .danger {
    color: red;
  }
`;

export default Header;
