import React, { useState } from 'react';
import styled from 'styled-components';

import config from './gameConfig';
import Header from './components/Header';
import Canvas from './components/Canvas';
import PauseModal from './components/modals/PauseModal';
import InfoModal from './components/modals/InfoModal';
import { GameStatus } from './types/Enum';

import './App.css';

const App = () => {
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight - 103;

  const [isPaused, setIsPaused] = useState(false);
  const [infoModalIsDisplayed, setInfoModalIsDisplayed] = useState(false);
  const [score, setScore] = useState(0);
  const [hiScore, setHiScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(config.timeLimit);
  const [game, setGame] = useState();
  const [gameStatus, setGameStatus] = useState(GameStatus.Unstarted);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  const toggleInfoModal = () => {
    setInfoModalIsDisplayed(!infoModalIsDisplayed);
  };

  const restartGame = () => {
    game.restart();
  };
  return (
    <Styles>
      <div className="App">
        <Header
          timeRemaining={timeRemaining}
          score={score}
          hiScore={hiScore}
          setInfoModalIsDisplayed={setInfoModalIsDisplayed}
          gameStatus={gameStatus}
          restartGame={restartGame}
        />
        <Canvas
          width={canvasWidth}
          height={canvasHeight}
          game={game}
          setGame={setGame}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          timeRemaining={timeRemaining}
          setScore={setScore}
          setHiScore={setHiScore}
          setTimeRemaining={setTimeRemaining}
          infoModalIsDisplayed={infoModalIsDisplayed}
          gameStatus={gameStatus}
          setGameStatus={setGameStatus}
        />
        <PauseModal on={isPaused} toggle={togglePause} />
        <InfoModal on={infoModalIsDisplayed} toggle={toggleInfoModal} />
      </div>
    </Styles>
  );
};

const Styles = styled.div``;

export default App;
