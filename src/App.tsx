import React, { useState } from 'react';
import styled from 'styled-components';

import config from './gameConfig';
import Header from './components/Header';
import Canvas from './components/Canvas';
import PauseModal from './components/modals/PauseModal';

import './App.css';

const App = () => {
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight - 103;

  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(config.timeLimit);
  const [game, setGame] = useState();

  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  return (
    <Styles>
      <div className="App">
        <Header timeRemaining={timeRemaining} score={score} />
        <Canvas
          width={canvasWidth}
          height={canvasHeight}
          game={game}
          setGame={setGame}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          timeRemaining={timeRemaining}
          setScore={setScore}
          setTimeRemaining={setTimeRemaining}
        />
        <PauseModal on={isPaused} toggle={togglePause} />
      </div>
    </Styles>
  );
};

const Styles = styled.div``;

export default App;
