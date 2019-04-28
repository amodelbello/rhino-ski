import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

const Header = ({
  isPaused,
  setIsPaused,
}: {
  isPaused: boolean;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Styles>
      <header>
        <h1>Rhino Ski!</h1>
        <button
          onClick={() => {
            setIsPaused(!isPaused);
          }}
        >
          Pause
        </button>
      </header>
    </Styles>
  );
};

const Styles = styled.span`
  header {
    padding: 0;
    margin: 0;
    height: 100px;
    width: 100%;
    background: #ececec;
  }
  header h1 {
    padding: 20px;
    margin: 0;
  }
`;

export default Header;
