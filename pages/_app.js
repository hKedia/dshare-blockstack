import App, { Container } from 'next/app';
import React from 'react';
import { UserSession, AppConfig } from 'blockstack';
import { configure } from 'radiks';
import Router from 'next/router';
import { toast, Slide } from 'react-toastify';

const appConfig = new AppConfig(['store_write', 'publish_data'], 'http://localhost:5000');
const userSession = new UserSession({ appConfig });

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {
      userSession,
    };

    configure({
      apiServer: process.env.RADIKS_API_SERVER,
      userSession,
    });

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  componentWillMount() {
    // configure radiks server
    configure({
      apiServer: process.env.RADIKS_API_SERVER,
      userSession,
    });

    // configure react-toastify
    toast.configure({
      position: "bottom-right",
      autoClose: 5000,
      transition: Slide
    });

    // configure NProgress
    Router.events.on('routeChangeStart', () => NProgress.start());
    Router.events.on('routeChangeComplete', () => NProgress.done());
    Router.events.on('routeChangeError', () => NProgress.done());
  }

  render() {
    const {
      Component, pageProps,
    } = this.props;

    return (
      <Container>
        <Component {...pageProps} serverCookies={this.props.cookies} />
      </Container>
    );
  }
}

export default MyApp;
