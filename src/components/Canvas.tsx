import React, {
  useRef,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import styled from 'styled-components';

import CanvasHelper from '../lib/Canvas';
import { assets, assetPromises } from '../lib/AssetLoader';
import Game from '../lib/Game';

function Canvas({
  width,
  height,
  isPaused,
  setIsPaused,
}: {
  width: number;
  height: number;
  isPaused: boolean;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
}) {
  const canvasRef: any = useRef(HTMLCanvasElement);
  const [ctx, setCtx] = useState();
  const [images, setImages] = useState();
  const [game, setGame] = useState();

  /*
   * Initialize canvas, assets, and game
   */
  useEffect(() => {
    setCtx(canvasRef.current.getContext('2d'));
    Promise.all(assetPromises).then(() => {
      setImages(assets);
    });
    if (ctx !== undefined && images !== undefined) {
      setGame(new Game(new CanvasHelper(ctx), images, { setIsPaused }));
    }
  }, [ctx, images, setIsPaused]);

  /*
   * Run the game
   */
  useEffect(() => {
    if (ctx !== undefined && images !== undefined) {
      // setGame(new Game(new CanvasHelper(ctx), images));
      if (game !== undefined) {
        game.start();
      }
    }
  }, [ctx, game, images]);

  /*
   * Listen for pauses
   */
  useEffect(() => {
    if (game !== undefined) {
      if (isPaused) {
        game.pause();
      } else {
        game.resume();
      }
    }
  }, [game, isPaused]);

  return (
    <Styles>
      <canvas ref={canvasRef} width={width} height={height} />
    </Styles>
  );
}

const Styles = styled.div`
  canvas {
    outline: 1px solid black;
    outline-offset: -1px;
  }
`;

export default Canvas;
