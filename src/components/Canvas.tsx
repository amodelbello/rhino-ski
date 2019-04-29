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
  game,
  setGame,
  isPaused,
  setIsPaused,
  setScore,
  timeRemaining,
  setTimeRemaining,
}: {
  width: number;
  height: number;
  game: Game;
  setGame: Dispatch<SetStateAction<Game>>;
  isPaused: boolean;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
  setScore: Dispatch<SetStateAction<number>>;
  timeRemaining: number;
  setTimeRemaining: Dispatch<SetStateAction<number>>;
}) {
  const canvasRef: any = useRef(HTMLCanvasElement);
  const [ctx, setCtx] = useState();
  const [images, setImages] = useState();

  /*
   * Initialize canvas, assets, and game
   */
  useEffect(() => {
    setCtx(canvasRef.current.getContext('2d'));
    Promise.all(assetPromises).then(() => {
      setImages(assets);
    });
    if (ctx !== undefined && images !== undefined) {
      setGame(
        new Game(new CanvasHelper(ctx), images, {
          setIsPaused,
          timeRemaining,
          setTimeRemaining,
          setScore,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, images, setGame, setIsPaused, setTimeRemaining]);

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
