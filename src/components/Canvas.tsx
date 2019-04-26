import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

import CanvasHelper from '../lib/Canvas';
import Item from '../models/ItemType';
import { assets, assetPromises } from '../lib/AssetLoader';

function Canvas({ width, height }: { width: number; height: number }) {
  const canvasRef: any = useRef(HTMLCanvasElement);
  const [ctx, setCtx] = useState();
  const [images, setImages] = useState();

  // Initialize canvas and assets
  useEffect(() => {
    setCtx(canvasRef.current.getContext('2d'));
    Promise.all(assetPromises).then(() => {
      setImages(assets);
    });
  }, [ctx, images]);

  useEffect(() => {
    if (ctx !== undefined && images !== undefined) {
      const canvas = new CanvasHelper(ctx);
      canvas.clear();

      const testCharacter: Item = {
        image: images.skierRight,
        xPosition: width / 2,
        yPosition: height / 2,
      };

      canvas.draw(testCharacter);
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
