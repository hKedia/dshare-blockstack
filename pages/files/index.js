import React, { Component } from 'react';
import Router from 'next/router';

import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
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

    return { uploadedFiles, recipientFiles, user };
  }

  streamCallback = (item) => {
    Router.push('/files');
  }

  async componentDidMount() {
    this.setState({
      loadingFiles: false
    });
    Item.addStreamListener(this.streamCallback);
  }

  componentWillUnmount() {
    Item.removeStreamListener(this.streamCallback);
  }

  render() {
    const { uploadedFiles, recipientFiles, user } = this.props;
    let uploadComponent, recipientComponent = null;

    // If uploaded files not empty then call RenderFiles component with uploaded files as props
    if (uploadedFiles.length === 0) {
      uploadComponent = <NoFilesFound />;
    } else {
      uploadComponent = <RenderFiles files={uploadedFiles} isShared={0} />
    }

    // If there exists files shared with the user, the call RenderFiles component with files as props
    if (recipientFiles.length === 0) {
      recipientComponent = <NoFilesFound />
    } else {
      recipientComponent = <RenderFiles files={recipientFiles} isShared={1} />
    }

    // If the user has not set a blockstack username
    if (user.attrs.username == null) {
      return (
        <Layout>
          <Grid container verticalAlign='middle' textAlign='center' style={{ height: "100vh" }}>
            <Grid.Row>
              <Grid.Column>
                <Segment padded>
                  <Header>Create a username to use this application.</Header>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Layout>
      )
    }

    return (
      <Layout>
        <Grid padded='vertically'>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header icon='cloud upload' size='medium' content='Uploaded By Me'></Header>
              {uploadComponent}
              <Loader active={this.state.loadingFiles} inline="centered" />
            </Grid.Column>
            <Grid.Column width={8}>
              <Header icon='cloud download' size='medium' content='Shared With Me'></Header>
              {recipientComponent}
              <Loader active={this.state.loadingFiles} inline="centered" />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    )
  }
}