import React from 'react';
import Canvas from './components/Canvas';

import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <Canvas height={400} width={400} />
    </div>
  );
};

export default App;
