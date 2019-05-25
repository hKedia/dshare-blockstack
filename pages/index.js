import React, { Component } from 'react';
import Router from 'next/router';

import { User, getConfig } from 'radiks';
import { Segment, Header, Button, Grid } from 'semantic-ui-react';
import { getPublicKeyFromPrivate } from 'blockstack';

class Home extends Component {
  state = {
    loading: false
  }

  /**
   * Get the userSession from radiks.
   * Handle user signin.
   * Call savePublicKey()
   */
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

  /**
   * Checks if user's public key is saved, if not, it generates the public key from user's app private key and saves it under keys/username
   * @param {Object} user The user object for the current user
   * @param {Object} userSession The blockstack user session
   */
  async savePublicKey(user, userSession) {
    userSession.getFile(`keys/${user.username}`, { decrypt: false }).then(async (data) => {
      if (data === null) {
        const publicKey = getPublicKeyFromPrivate(user.appPrivateKey);
        await userSession.putFile(`keys/${user.username}`, JSON.stringify(publicKey), { encrypt: false });
        console.log('new user saved');
      } else {
        console.log('user exists. redirecting...')
      }
    });
    Router.push('/files');
  }

  /**
   * Gets called when cliks on Login
   * Defines the scopes for connecting to Blockstack
   * Calls redirectToSignin() from blockstack which initiates the sign in process
   */
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
      <Grid container verticalAlign='middle' textAlign='center' style={{ height: "100vh" }}>
        <Grid.Row>
          <Grid.Column>
            <Segment placeholder padded loading={this.state.loading}>
              <Header>Login with Blockstack to continue</Header>
              <Button basic color='purple' size='large' onClick={this.login}>Login</Button>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default Home;