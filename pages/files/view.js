import React, { Component } from 'react';
import Router from 'next/router';
import { getConfig } from 'radiks';

import { decryptItem } from '../../utils/crypto';
import { download } from '../../utils/file-utils';

import Layout from '../../components/Layout';
import FileDetail from '../../components/FileDetail';
import FileSharing from '../../components/FileSharing';
import FileActions from '../../components/FileActions';
import Item from '../../models/Item';
import { Grid } from 'semantic-ui-react';

export default class FileView extends Component {
  state = {
    userSession: null,
    username: null
  }

  static async getInitialProps({ query }) {
    const file = await Item.findById(query.id);
    const isShared = Number(query.isShared);
    return { isShared, file };
  }

  componentDidMount = async () => {
    const { userSession } = getConfig();
    const user = userSession.loadUserData();

    this.setState({
      userSession,
      username: user.username
    });
  }

  downloadFile = async () => {
    // Get the usersession and file model
    const { userSession, username } = this.state;
    const { file } = this.props;

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
  }

  deleteFile = async () => {
    const { file } = this.props;
    await file.destroy();
    Router.push('/files');
  }

  shareFile = async (recipient) => {
    const { userSession, username } = this.state;
    const { file } = this.props;

    let recipientPublicKey;
    // check if recipient has logged in before
    try {
      recipientPublicKey = await userSession.getFile(`keys/${recipient}`, { decrypt: false, username: recipient });
    } catch (error) {
      console.log('Recipient key not found!');
      return;
    }

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
  }

  stopSharing = async (recipient) => {
    const { file } = this.props;

    // remove recipient from recipients file attrs
    const updatedRecipients = file.attrs.recipients.filter(r => {
      return r !== recipient;
    });

    // set the value for key with recipient username is null
    file.update({
      recipients: updatedRecipients,
      [recipient]: null
    });

    await file.save();
  }

  render() {
    let fileSharingComponent = null;
    if (!this.props.isShared) {
      fileSharingComponent = <FileSharing file={this.props.file} shareFile={this.shareFile} stopSharing={this.stopSharing} />;
    }
    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <FileDetail file={this.props.file} />
              {fileSharingComponent}
              <FileActions download={this.downloadFile} delete={this.deleteFile} isShared={this.props.isShared} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    )
  }
}