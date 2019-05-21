import React, { Component } from 'react';
import { Table, Loader, Segment, Header, Form } from 'semantic-ui-react';
import { getConfig } from 'radiks';

import Item from '../models/Item';
import StopSharing from '../components/StopSharing';

export default class FileSharing extends Component {
  state = {
    file: null,
    userSession: null,
    loadingFiles: true,
    username: null,
    recipient: '',
    sharing: false
  }

  componentDidMount = async () => {
    const { userSession } = getConfig();
    const user = userSession.loadUserData();
    const file = await Item.findById(this.props.id);
    this.setState({
      file,
      userSession,
      loadingFiles: false,
      username: user.username,
      recipientList: file.attrs.recipients
    })
  }

  onSubmit = async event => {
    event.preventDefault();

    const { userSession, recipient } = this.state;
    console.log('recipient', recipient);
    this.setState({ sharing: true });

    let recipientPublicKey;
    try {
      recipientPublicKey = await userSession.getFile(`keys/${recipient}`, { decrypt: false, username: recipient });
      this.shareFile(recipientPublicKey);
    } catch (error) {
      console.error(error);
      this.setState({ sharing: false, recipient: '' });
      return;
    }
  }

  shareFile = async recipientPublicKey => {
    const { file, userSession, username, recipient } = this.state;

    // get and decrypt the encryption key
    const key = await userSession.decryptContent(file.attrs[username]);

    // encrypt with recipient public key
    const encryptedKey = await userSession.encryptContent(key, { publicKey: recipientPublicKey });

    // update the recipient list
    file.attrs.recipients.push(recipient);

    // save the encrypted key to the model
    file.update({
      [recipient]: encryptedKey
    });

    // save the model
    await file.save();

    this.setState({ sharing: false, recipient: '' });
  }

  render() {
    const { file, recipient, sharing, recipientList } = this.state;
    let recipientListComponent = null;

    if (file === null) {
      return <Loader active={this.state.loadingFiles} inline="centered" />
    }

    if (recipientList.length > 0) {
      const cells = recipientList.map(r => {
        return (
          <StopSharing key={r} recipient={r} file={file} />
        )
      });
      recipientListComponent = (
        <Table basic fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="2">File Shared With</Table.HeaderCell>
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
              width={14}
            />
            <Form.Button
              icon='share'
              basic
              color='teal'
              loading={sharing}
              content='Share'
              type='submit'
              width={2}
              floated='right'
              fluid
            ></Form.Button>
          </Form.Group>
        </Form>
        {recipientListComponent}
      </Segment>
    )
  }
}