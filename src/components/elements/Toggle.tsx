import React from 'react';

export default class Toggle extends React.Component<ToggleProps> {
  public state = {
    on: this.props.on,
    toggle: this.props.toggle,
  };

  public toggle = () => {
    this.setState({
      on: !this.state.on,
    });
  };

  public render() {
    const { children } = this.props;
    return children({
      on: this.props.on || this.state.on,
      toggle: this.props.toggle || this.toggle,
    });
  }
}

interface ToggleProps {
  on?: boolean;
  toggle?: Function;
  children(props: any): JSX.Element;
}
