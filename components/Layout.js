import React, { Component } from 'react';
import Header from './Header';
import { Container } from 'semantic-ui-react';

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