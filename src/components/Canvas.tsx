import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

import CanvasHelper from '../lib/Canvas';
import { assets, assetPromises } from '../lib/AssetLoader';
import Game from '../lib/Game';

function Canvas({ width, height }: { width: number; height: number }) {
  const canvasRef: any = useRef(HTMLCanvasElement);
  const [ctx, setCtx] = useState();
  const [images, setImages] = useState();

  /*
   * Initialize canvas and assets
   */
  useEffect(() => {
    setCtx(canvasRef.current.getContext('2d'));
    Promise.all(assetPromises).then(() => {
      setImages(assets);
    });
  }, [ctx, images]);

  /*
   * Run the game
   */
  useEffect(() => {
    if (ctx !== undefined && images !== undefined) {
      const game = new Game(new CanvasHelper(ctx), images);
      game.start();
    }
  });

  return (
    <Styles>
      <canvas ref={canvasRef} width={width} height={height} />
    </Styles>
  );
}

const Styles = styled.div`
  canvas {
    border: 1px solid green;
  }
`;

export default Canvas;
