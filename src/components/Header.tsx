import React from 'react';
import styled from 'styled-components';

import config from '../gameConfig';

const Header = ({
  timeRemaining,
  score,
  hiScore,
}: {
  timeRemaining: number;
  score: number;
  hiScore: number;
}) => {
  return (
    <Styles>
      <header>
        <h1>Rhino Ski!</h1>
        <p className={'timer' + (timeRemaining < 1 ? ' danger' : '')}>
          {timeRemaining || config.timeLimit}
        </p>
        <table className="score">
          <tr>
            <td className="label">Score:</td>
            <td className="amount">{score || 0}</td>
            <td className="label">High Score:</td>
            <td className="amount">
              {hiScore || localStorage.getItem(config.hiScoreFieldName) || 0}
            </td>
          </tr>
        </table>
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
    position: relative;
  }
  header h1 {
    margin: 20px 0 0 0;
    padding: 0;
    text-align: center;
    position: absolute;
    bottom: 20px;
    left: 15px;
    font-size: 18px;
  }
  p {
  }
  p.timer {
    font-size: 40px;
    margin: 0;
    padding: 0;
    position: absolute;
    top: 10px;
    left: 15px;
    text-align: center;
  }
  table.score {
    position: absolute;
    top: 5px;
    right: 5px;
  }
  table.score td.label {
    width: 90px;
    text-align: right;
  }
  table.score td.amount {
    width: 60px;
    text-align: left;
    font-weight: bold;
  }
  .danger {
    color: red;
  }
`;

export default Header;
