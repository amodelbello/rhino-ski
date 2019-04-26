import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

function Canvas({ width, height }: { width: number; height: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canvasRef: any = useRef(HTMLCanvasElement);
  const [ctx, setCtx] = useState({});

  useEffect(() => {
    setCtx(canvasRef.current.getContext('2d'));
  }, [ctx]);

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
