import React, { Component } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import { User } from 'radiks';

import Layout from '../../components/Layout';
import Item from '../../models/Item';
import RenderFiles from '../../components/RenderFiles';
import NoFilesFound from '../../components/NoFilesFound';

export default class Index extends Component {
  state = {
    loadingFiles: true
  }

  static async getInitialProps() {
    // get current user details
    const user = User.currentUser();

    // get a list of user created models
    const uploadedFiles = await Item.fetchOwnList();

    // retrieve all the file models 
    const allFiles = await Item.fetchList();

    // filter the array based on the current user
    const recipientFiles = allFiles.filter(file => {
      return file.attrs.recipients.includes(user._id);
    });

    return { uploadedFiles, recipientFiles };
  }

  async componentDidMount() {
    this.setState({
      loadingFiles: false
    });
    console.log('recipient files', this.props.recipientFiles);
  }
  render() {
    let { uploadedFiles, recipientFiles } = this.props;

    if (uploadedFiles.length === 0) {
      uploadedFiles = <NoFilesFound />;
    } else {
      uploadedFiles = <RenderFiles files={uploadedFiles} isShared={0} />
    }

    if (recipientFiles.length === 0) {
      recipientFiles = <NoFilesFound />
    } else {
      recipientFiles = <RenderFiles files={recipientFiles} isShared={1} />
    }
    return (
      <Layout>
        <Grid padded='vertically'>
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