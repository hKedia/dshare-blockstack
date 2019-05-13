import React, { Component } from 'react';
import { User, getConfig } from 'radiks';
import Router from 'next/router';
import { Container, Segment, Header, Button } from 'semantic-ui-react';

class Home extends Component {
  state = {
    loading: false
  }

  async componentDidMount() {
    const { userSession } = getConfig();
    if (userSession.isUserSignedIn()) {
      this.setState({ loading: true });
      await User.createWithCurrentUser();
      Router.push('/files');
    } else if (userSession.isSignInPending()) {
      this.setState({ loading: true });
      await userSession.handlePendingSignIn();
      await User.createWithCurrentUser();
      Router.push('/files');
    }
  }

  login = () => {
    const scopes = [
      'store_write',
      'publish_data',
    ];
    const redirect = window.location.origin;
    const manifest = `${window.location.origin}/manifest.json`;
    const { userSession } = getConfig();
    userSession.redirectToSignIn(redirect, manifest, scopes);
  }

  render() {
    return (
      <Container textAlign="center">
        <Segment placeholder padded loading={this.state.loading}>
          <Header>Login with Blockstack to get started</Header>
          <Button primary onClick={this.login}>Login</Button>
        </Segment>
      </Container>
    )
  }
}

export default Home;