import React from 'react';
import styled from 'styled-components';

import Toggle from '../elements/Toggle';
import Modal from '../elements/Modal';

const PauseModal = ({ on, toggle }: PauseModalProps) => {
  return (
    <Toggle on={on} toggle={toggle}>
      {({ on, toggle }) => {
        return (
          <Modal on={on} toggle={toggle}>
            <Styles>
              <h1>Paused</h1>
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
    font-size: 4em;
    padding: 100px 0;
    font-weight: normal;
  }

  div {
    width: 80%;
  }
`;

export default PauseModal;
