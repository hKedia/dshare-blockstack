import React, { Component } from 'react';
import Layout from '../../components/Layout';
import FileDetail from '../../components/FileDetail';
import FileSharing from '../../components/FileSharing';

export default class FileView extends Component {
  static async getInitialProps(props) {
    const id = props.query.id;
    const isShared = Number(props.query.isShared);
    return { id, isShared };
  }
  render() {
    let fileSharingComponent = null;
    if (!this.props.isShared) {
      fileSharingComponent = <FileSharing id={this.props.id} />;
    }
    return (
      <Layout>
        <FileDetail id={this.props.id} />
        {fileSharingComponent}
      </Layout>
    )
  }
}