import React, { Component } from 'react';
import Layout from '../../components/Layout';
import File from '../../models/File';
import { Grid, Loader } from 'semantic-ui-react';
import RenderUploadedFiles from '../../components/RenderUploadedFiles';
import NoFilesFound from '../../components/NoFilesFound';

export default class Index extends Component {
  state = {
    uploadedFiles: [],
    recipientFiles: [],
    loadingFiles: true
  }

  async componentDidMount() {
    const uploadedFiles = await File.fetchOwnList();
    this.setState({
      uploadedFiles: uploadedFiles,
      loadingFiles: false
    });
  }
  render() {
    let uploadedFiles, recipientFiles;

    if (this.state.uploadedFiles.length === 0) {
      uploadedFiles = <NoFilesFound />;
    } else {
      uploadedFiles = <RenderUploadedFiles files={this.state.uploadedFiles} />
    }

    if (this.state.recipientFiles.length === 0) {
      recipientFiles = <NoFilesFound />
    } else {
      recipientFiles = <RenderSharedFiles files={this.state.recipientFiles} />
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