import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="stylesheet" href="/static/nprogress.css" />
          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
          />
          <script src="/static/nprogress.js" />
        </Head>
        <body className="custom_class">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
