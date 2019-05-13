import React, { Component } from 'react';
import Layout from '../../components/Layout';
import FileDetail from '../../components/FileDetail';

export default class FileView extends Component {
  static async getInitialProps(props) {
    const id = props.query.id;
    return { id }
  }
  render() {
    return (
      <Layout>
        <FileDetail id={this.props.id} />
      </Layout>
    )
  }
}