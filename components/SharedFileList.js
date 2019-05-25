import React, { Component } from 'react';
import { Loader } from 'semantic-ui-react';

import Item from '../models/Item';
import NoFilesFound from './NoFilesFound';
import RenderFiles from './RenderFiles';

export default class SharedFileList extends Component {
  state = {
    loadingFiles: true,
    sharedFiles: []
  }

  async componentDidMount() {
    const myFiles = await Item.fetchOwnList();

    // Retrive those file models where recipients is not empty
    const sharedFiles = myFiles.filter(file => {
      return file.attrs.recipients.length > 0;
    });
    this.setState({
      sharedFiles,
      loadingFiles: false,
    });
  }

  render() {
    let sharedFilesComponent;

    if (this.state.sharedFiles.length === 0) {
      sharedFilesComponent = <NoFilesFound />
    } else {
      sharedFilesComponent = <RenderFiles files={this.state.sharedFiles} isShared={0} />
    }

    return (
      <div>
        {sharedFilesComponent}
        <Loader active={this.state.loadingFiles} inline="centered" />
      </div>
    );
  }
}