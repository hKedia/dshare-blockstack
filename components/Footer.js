import React, { Component } from 'react';
import { Menu, Container } from 'semantic-ui-react';
import { getConfig } from 'radiks';

export default class Footer extends Component {
  state = {
    currentUser: null
  }

  componentDidMount() {
    const { userSession } = getConfig();
    const currentUser = userSession.loadUserData();
    this.setState({ currentUser })
  }

  render() {
    const { currentUser } = this.state;
    return (
      <Menu fixed="bottom">
        <Container>
          {currentUser ? (
            <Menu.Item>Logged in as: {currentUser.username}</Menu.Item>
          ) : (
              <Menu.Item>Fetching User Data ...</Menu.Item>
            )}

        </Container>
      </Menu>
    )
  }
}