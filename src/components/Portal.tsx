import React from 'react';
import ReactDOM from 'react-dom';

const portalRoot = document.getElementById('portal');

export default class Portal extends React.Component<PortalProps> {
  private el: HTMLElement;
  private constructor(props: Readonly<PortalProps>) {
    super(props);
    this.el = document.createElement('div');
  }

  public componentDidMount = () => {
    if (portalRoot !== null) {
      portalRoot.appendChild(this.el);
    }
  };

  public componentWillUnmount = () => {
    if (portalRoot !== null) {
      portalRoot.removeChild(this.el);
    }
  };

  public render() {
    const { children } = this.props;
    return ReactDOM.createPortal(children, this.el);
  }
}

interface PortalProps {
  children: boolean | JSX.Element;
}
