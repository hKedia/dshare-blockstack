import React, { Component } from 'react';
import { User, getConfig } from 'radiks';

class Home extends Component {
    state = {
        currentUser: null
    }

    async componentDidMount() {
        const { userSession } = getConfig();
        if (userSession.isUserSignedIn()) {
            const currentUser = userSession.loadUserData();
            await User.createWithCurrentUser();
            this.setState({ currentUser });
        } else if (userSession.isSignInPending()) {
            const currentUser = await userSession.handlePendingSignIn();
            await User.createWithCurrentUser();
            this.setState({ currentUser });
        }
    }

    login = () => {
        const { userSession } = getConfig();
        userSession.redirectToSignIn();
    }

    logout = () => {
        const { userSession } = getConfig();
        userSession.signUserOut();
        this.setState({
            currentUser: null,
        });
    }

    render() {
        const { currentUser } = this.state;
        return (
            <div>
                {currentUser ? (
                    <>
                        <p>Logged in as: {currentUser.username}</p>
                        <button onClick={this.logout}>Logout</button>
                    </>
                ) : (
                        <>
                            <p>Login with Blockstack to get started</p>
                            <button onClick={this.login}>Log In</button>
                        </>
                    )}
            </div>
        )
    }
}

export default Home;