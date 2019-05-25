import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';

import { Menu, Container, Label, Button } from 'semantic-ui-react';
import { getConfig } from 'radiks';

export default class Header extends Component {
  state = {
    username: null
  }

  componentDidMount() {
    const { userSession } = getConfig();
    const user = userSession.loadUserData();
    this.setState({ username: user.username });
  }

  /**
   * Handles signout by calling signUserOut() from blockstack user session object
   */
  logout = () => {
    const { userSession } = getConfig();
    userSession.signUserOut();
    Router.push('/');
  }

  render() {
    let menuComponent, userComponent = null;

    // Hide the navigation menu, if no blockstack username is set for the logged in user
    if (this.state.username != null) {
      menuComponent = (
        <Menu.Menu position='left'>
          <Link href="/files">
            <a className="item">Home</a>
          </Link>

          <Link href="/files/shared-files">
            <a className="item">View Shared Files</a>
          </Link>

          <Link href="/files/upload">
            <a className="item">Upload Files</a>
          </Link>
        </Menu.Menu>
      );
      userComponent = (
        <Menu.Item>
          <Label icon='user' size='large' content={this.state.username}></Label>
        </Menu.Item>
      );
    }
    return (
      <Menu attached="top" borderless>
        <Container>
          {menuComponent}
          <Menu.Menu position='right'>
            {userComponent}
            <Menu.Item>
              <Button negative size='small' onClick={this.logout}>Logout</Button>
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    )
  }
}