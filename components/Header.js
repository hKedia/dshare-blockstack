import React, { Component } from 'react';
import { Menu, Container } from 'semantic-ui-react';
import Link from 'next/link';

export default class Header extends Component {
    render() {
        return (
            <Menu fixed="top">
                <Container>
                    <Link href="/files">
                        <a className="item">Home</a>
                    </Link>

                    <Menu.Menu position="right">
                        <Link href="/files/upload">
                            <a className="item">Upload Files</a>
                        </Link>
                    </Menu.Menu>
                </Container>
            </Menu>
        )
    }
}