import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';

export default class StopSharing extends Component {
  state = {
    loading: false
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
            content='Stop Sharing'
          ></Button>
        </Table.Cell>
      </Table.Row>
    )
  }
}