import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';

export default class StopSharing extends Component {
  state = {
    loading: false,
    recipient: null,
    file: null
  }

  /**
   * Calls the stopSharing() in FileSharing component which in turn calls the same function in pages/view.js
   */
  stopSharing = async () => {
    this.setState({ loading: true });
    await this.props.stopSharing(this.props.recipient);
  }

  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.recipient}</Table.Cell>
        <Table.Cell textAlign='right'>
          <Button
            loading={this.state.loading}
            basic
            color='red'
            icon="remove user"
            onClick={this.stopSharing}
          ></Button>
        </Table.Cell>
      </Table.Row>
    )
  }
}