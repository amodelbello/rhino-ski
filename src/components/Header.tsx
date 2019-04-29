import React from 'react';
import styled from 'styled-components';

import config from '../gameConfig';

const Header = ({
  timeRemaining,
  score,
}: {
  timeRemaining: number;
  score: number;
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
        <div>Score: {score || 0}</div>
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
