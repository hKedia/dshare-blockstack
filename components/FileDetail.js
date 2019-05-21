import React, { Component } from 'react';
import Item from '../models/Item';
import { Table, Loader, Button } from 'semantic-ui-react';
import { getConfig } from 'radiks';
import { decryptItem } from '../utils/crypto';
import { download } from '../utils/file-utils';

export default class FileDetail extends Component {
  state = {
    file: null,
    userSession: null,
    loadingFiles: true,
    downloading: false,
    username: null
  }

  componentDidMount = async () => {
    const { userSession } = getConfig();
    const user = userSession.loadUserData();
    const file = await Item.findById(this.props.id);
    console.log('file', file);
    this.setState({
      file,
      userSession,
      loadingFiles: false,
      username: user.username
    });
  }

  download = async () => {
    // set downloading to true
    this.setState({ downloading: true });

    // Get the usersession and file model
    const { file, userSession, username } = this.state;

    // Retrieve the file path and encryption key
    const { path, name, owner } = file.attrs;

    const key = await userSession.decryptContent(file.attrs[username]);

    /** Convert key into valid jwk format */
    const validKey = await window.crypto.subtle.importKey(
      "jwk",
      JSON.parse(key),
      "AES-GCM",
      true,
      ["encrypt", "decrypt"]
    );

    // Retrieve the file Content as array buffer
    const fileBuffer = await userSession.getFile(path, { decrypt: false, username: owner });

    // convert array buffer to a Uint8array
    const fileArray = new Uint8Array(fileBuffer);

    // Retrieve the original file content
    const fileContent = fileArray.slice(0, fileArray.length - 12);

    // Retrieve the original random nonce used for encrypting
    const iv = fileArray.slice(fileArray.length - 12);

    // Decrypt the file
    const decryptedFile = await decryptItem(fileContent, validKey, iv);

    // Download the file
    download(decryptedFile, name);

    // Set downloading to false
    this.setState({ downloading: false });
  }

  render() {
    const { file } = this.state;
    if (file == null) {
      return <Loader active={this.state.loadingFiles} inline="centered" />
    }

    return (
      <Table striped fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>File Details</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>
              <Button
                icon='download'
                content='Download'
                basic
                color='teal'
                size='small'
                onClick={this.download}
                loading={this.state.downloading}
              ></Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>File Name</Table.Cell>
            <Table.Cell textAlign="right">{file.attrs.name}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Last Updated</Table.Cell>
            <Table.Cell textAlign="right">{file.ago()}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  }
}