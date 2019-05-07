import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Container } from 'semantic-ui-react';

export default class Layout extends Component {
    render() {
        return (
            <>
                <Header />
                <Container style={{ margin: "4em 0 3em 0" }}>
                    {this.props.children}
                </Container>
                <Footer />
            </>
        )
    }
}