import React, { Component } from 'react';
import { Table, Loader, Label } from 'semantic-ui-react';

export default class FileDetail extends Component {
  state = {
    loadingFiles: true
  }

  componentDidMount = async () => {
    this.setState({
      loadingFiles: false
    });
  }

  render() {
    const { file } = this.props;
    if (file == null) {
      return <Loader active={this.state.loadingFiles} inline="centered" />
    }

    return (
      <Table basic fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">File Details</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>Name</Table.Cell>
            <Table.Cell textAlign="right">{file.attrs.name}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Uploaded</Table.Cell>
            <Table.Cell textAlign="right">
              <Label icon="clock" content={file.ago()}></Label>
              <Label icon="user" content={file.attrs.owner || 'John Doe'}></Label>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  }
}