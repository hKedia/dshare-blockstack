import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Item from '../../models/Item';
import { Grid, Loader } from 'semantic-ui-react';
import RenderUploadedFiles from '../../components/RenderUploadedFiles';
import NoFilesFound from '../../components/NoFilesFound';
export default class Index extends Component {
  state = {
    loadingFiles: true
  }

  static async getInitialProps() {
    const uploadedFiles = await Item.fetchOwnList();
    const recipientFiles = [];
    return { uploadedFiles, recipientFiles };
  }

  async componentDidMount() {
    this.setState({
      loadingFiles: false
    });
  }
  render() {
    let { uploadedFiles, recipientFiles } = this.props;

    if (uploadedFiles.length === 0) {
      uploadedFiles = <NoFilesFound />;
    } else {
      uploadedFiles = <RenderUploadedFiles files={uploadedFiles} />
    }

    if (recipientFiles.length === 0) {
      recipientFiles = <NoFilesFound />
    } else {
      recipientFiles = <RenderSharedFiles files={recipientFiles} />
    }
    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <h3>Files Uploaded by me</h3>
              {uploadedFiles}
              <Loader active={this.state.loadingFiles} inline="centered" />
            </Grid.Column>
            <Grid.Column width={8}>
              <h3>Files Shared with me</h3>
              {recipientFiles}
              <Loader active={this.state.loadingFiles} inline="centered" />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    )
  }
}