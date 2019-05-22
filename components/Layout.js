import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Container } from 'semantic-ui-react';

export default class Layout extends Component {
  render() {
    return (
      <>
        <Container style={{ margin: "1em 0 3em 0" }}>
          <Header />
          {this.props.children}
          <Footer />
        </Container>
      </>
    )
  }
}