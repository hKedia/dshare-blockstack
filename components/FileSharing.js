import React, { Component } from 'react';
import { Table, Loader, Segment, Header, Form } from 'semantic-ui-react';

import StopSharing from '../components/StopSharing';

export default class FileSharing extends Component {
  state = {
    loadingFiles: true,
    recipient: '',
    sharing: false,
    recipientList: []
  }

  /**
   * When the component is loaded, it gets the recipients list for the selected file
   */
  componentDidMount = async () => {
    const { file } = this.props;
    this.setState({
      loadingFiles: false,
      recipientList: file.attrs.recipients
    })
  }

  /**
   * Calls stopSharing() in pages/view.js and later fetches the new recipients list.
   * @param {String} recipient The blockstack username of recipient
   */
  stopSharing = async (recipient) => {
    await this.props.stopSharing(recipient);
    const { file } = this.props;
    this.setState({
      recipientList: file.attrs.recipients
    })
  }

  /**
   * Gets the recipient to share file with and calls shareFile() in pages/view.js
   */
  onSubmit = async event => {
    event.preventDefault();

    this.setState({ sharing: true });

    const { recipient } = this.state;
    await this.props.shareFile(recipient);

    this.setState({ sharing: false, recipient: '' });
  }

  render() {
    const { recipient, sharing, recipientList } = this.state;
    const { file } = this.props;

    let recipientListComponent = null;

    if (file == null || recipientList === undefined) {
      return <Loader active={this.state.loadingFiles} inline="centered" />
    }

    // If recipients exists, then render component which enables the functionality to remove a recipient
    if (recipientList.length > 0) {
      const cells = recipientList.map(r => {
        return (
          <StopSharing key={r} recipient={r} file={file} stopSharing={this.stopSharing} />
        )
      });
      recipientListComponent = (
        <Table basic fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="2">Shared With</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{cells}</Table.Body>
        </Table>
      );
    }

    return (
      <Segment>
        <Header size='tiny'>Share File</Header>
        <Form onSubmit={this.onSubmit}>
          <Form.Group>
            <Form.Input
              placeholder="Recipient's Blockstack id"
              value={recipient}
              onChange={event => this.setState({ recipient: event.target.value })}
              required
              width={15}
            />
            <Form.Button
              icon='share'
              basic
              color='purple'
              loading={sharing}
              type='submit'
              width={1}
              fluid
            ></Form.Button>
          </Form.Group>
        </Form>
        {recipientListComponent}
      </Segment>
    )
  }
}