import React from 'react';
import styled from 'styled-components';

function Canvas({ width, height }: { width: number; height: number }) {
  return (
    <Styles>
      <canvas width={width} height={height} />
    </Styles>
  );
}

const Styles = styled.div`
  canvas {
    border: 1px solid green;
  }
`;

export default Canvas;
