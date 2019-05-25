import React, { Component } from 'react';
import { Container, Button } from 'semantic-ui-react';

export default class FileActions extends Component {
  state = {
    downloading: false,
    deleting: false
  }

  /**
   * Calls the downloadFile() in pages/view.js
   */
  download = async () => {
    this.setState({ downloading: true });
    await this.props.download();
    this.setState({ downloading: false });
  }

  /**
   * Calls the deleteFile() in pages/view.js
   */
  delete = async () => {
    this.setState({ deleting: true });
    await this.props.delete();
  }

  render() {
    let deleteComponent = null;
    if (!this.props.isShared) {
      deleteComponent = (
        <Button
          basic
          color="red"
          content="Delete"
          loading={this.state.deleting}
          onClick={this.delete}
        ></Button>
      );
    }
    return (
      <Container textAlign='right' fluid>
        <Button
          basic
          color='teal'
          content="Download"
          loading={this.state.downloading}
          onClick={this.download}
          floated='right'
        ></Button>
        {deleteComponent}
      </Container>
    )
  }
}