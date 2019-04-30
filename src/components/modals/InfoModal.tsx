import React from 'react';
import styled from 'styled-components';

import Toggle from '../elements/Toggle';
import Modal from '../elements/Modal';

const InfoModal = ({ on, toggle }: PauseModalProps) => {
  return (
    <Toggle on={on} toggle={toggle}>
      {({ on, toggle }) => {
        return (
          <Modal on={on} toggle={toggle}>
            <Styles>
              <h1>Rhino Ski</h1>
              <p className="middle">
                Jump as many ramps as you can before you are eaten!
                <br />
                Try to beat the high score!
              </p>
              <h3>Controls:</h3>
              <ul>
                <li>
                  Use <strong>arrow keys</strong> or <strong>a, s, d, w</strong>{' '}
                  to move
                </li>
                <li>
                  <strong>p</strong> to pause
                </li>
                <li>
                  <strong>spacebar</strong> for speed boost
                </li>
              </ul>
            </Styles>
          </Modal>
        );
      }}
    </Toggle>
  );
};

interface PauseModalProps {
  on?: boolean;
  toggle?: Function;
}

const Styles = styled.div`
  h1 {
    text-align: center;
    font-size: 2em;
    padding: 0;
    font-weight: normal;
  }

  div {
    width: 80%;
  }
  .middle {
    text-align: center;
  }
`;

export default InfoModal;
