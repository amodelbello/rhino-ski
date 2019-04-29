import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import config from '../gameConfig';

const Header = ({
  isPaused,
  setIsPaused,
  timeRemaining,
}: {
  isPaused: boolean;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
  timeRemaining: number;
}) => {
  return (
    <Styles>
      <header>
        <h1>
          Rhino Ski!:{' '}
          <span className={timeRemaining < 1 ? 'danger' : ''}>
            {timeRemaining || config.timeLimit}
          </span>
        </h1>
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
  .danger {
    color: red;
  }
`;

export default Header;
