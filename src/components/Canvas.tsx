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
import { GameStatus } from '../types/Enum';

function Canvas({
  width,
  height,
  game,
  setGame,
  isPaused,
  setIsPaused,
  setScore,
  setHiScore,
  timeRemaining,
  setTimeRemaining,
  infoModalIsDisplayed,
  gameStatus,
  setGameStatus,
}: {
  width: number;
  height: number;
  game: Game;
  setGame: Dispatch<SetStateAction<Game>>;
  isPaused: boolean;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
  setScore: Dispatch<SetStateAction<number>>;
  setHiScore: Dispatch<SetStateAction<number>>;
  timeRemaining: number;
  setTimeRemaining: Dispatch<SetStateAction<number>>;
  infoModalIsDisplayed: boolean;
  gameStatus: GameStatus;
  setGameStatus: Dispatch<SetStateAction<GameStatus>>;
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
          setHiScore,
          infoModalIsDisplayed,
          gameStatus,
          setGameStatus,
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
  }
`;

export default Canvas;
