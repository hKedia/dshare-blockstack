import React, { Component } from 'react';
import { Menu, Container } from 'semantic-ui-react';
import Link from 'next/link';
import Router from 'next/router';
import { getConfig } from 'radiks';

export default class Header extends Component {
  logout = () => {
    const { userSession } = getConfig();
    userSession.signUserOut();
    Router.push('/');
  }

  render() {
    return (
      <Menu fixed="top">
        <Container>
          <Link href="/files">
            <a className="item">Home</a>
          </Link>

          <Link href="/files/shared-files">
            <a className="item">View Shared Files</a>
          </Link>

          <Link href="/files/upload">
            <a className="item">Upload Files</a>
          </Link>

          <Menu.Item
            onClick={this.logout}
            position="right"
            color={'red'}
            content="Logout"
            link
          ></Menu.Item>
        </Container>
      </Menu>
    )
  }
}