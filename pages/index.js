import React, { Component } from 'react';
import { User, getConfig } from 'radiks';
import Router from 'next/router';
import { Container, Segment, Header, Button } from 'semantic-ui-react';
import { getPublicKeyFromPrivate } from 'blockstack';

class Home extends Component {
  state = {
    loading: false
  }

  async componentDidMount() {
    const { userSession } = getConfig();
    if (userSession.isUserSignedIn()) {
      this.setState({ loading: true });
      const user = userSession.loadUserData();
      await this.savePublicKey(user, userSession);
    }
    else if (userSession.isSignInPending()) {
      this.setState({ loading: true });
      const user = await userSession.handlePendingSignIn();
      await User.createWithCurrentUser();
      await this.savePublicKey(user, userSession)
    }
  }

  async savePublicKey(user, userSession) {
    userSession.getFile(`keys/${user.username}`, { decrypt: false }).then(async (data) => {
      if (data === null) {
        const publicKey = getPublicKeyFromPrivate(user.appPrivateKey);
        await userSession.putFile(`keys/${user.username}`, JSON.stringify(publicKey), { encrypt: false });
        console.log('new user saved');
      } else {
        console.log(user);
        console.log('user exists. redirecting...')
      }
    });
    Router.push('/files');
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