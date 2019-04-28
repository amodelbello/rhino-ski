import React from 'react';
import Canvas from './components/Canvas';

import './App.css';

const App = () => {
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight - 3;

  return (
    <div className="App">
      <Canvas width={canvasWidth} height={canvasHeight} />
    </div>
  );
};

export default App;
