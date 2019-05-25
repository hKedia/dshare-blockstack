import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

import Header from './Header';

export default class Layout extends Component {
  render() {
    return (
      <Container>
        <Header />
        {this.props.children}
      </Container>
    )
  }
}