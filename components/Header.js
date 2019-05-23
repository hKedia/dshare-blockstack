import React, { Component } from 'react';
import { Menu, Container, Label, Button } from 'semantic-ui-react';
import Link from 'next/link';
import Router from 'next/router';
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

  logout = () => {
    const { userSession } = getConfig();
    userSession.signUserOut();
    Router.push('/');
  }

  render() {
    let menuComponent = null;
    let userComponent = null;
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
            <Menu.Item fitted='vertically'>
              <Button negative size='small' onClick={this.logout}>Logout</Button>
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    )
  }
}