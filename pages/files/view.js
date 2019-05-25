import React, { Component } from 'react';
import Router from 'next/router';

import { getConfig } from 'radiks';
import { toast } from 'react-toastify';
import { Grid } from 'semantic-ui-react';

import { decryptItem } from '../../utils/crypto';
import { download } from '../../utils/file-utils';

import Layout from '../../components/Layout';
import FileDetail from '../../components/FileDetail';
import FileSharing from '../../components/FileSharing';
import FileActions from '../../components/FileActions';
import Item from '../../models/Item';

export default class FileView extends Component {
  state = {
    userSession: null,
    username: null
  }

  static async getInitialProps({ query }) {
    // Retrieve the file model based on the id
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

    // Retrieve the path, name and the owner of the file
    const { path, name, owner } = file.attrs;

    // Retrieve and decrypt the file encryption key
    const key = await userSession.decryptContent(file.attrs[username]);

    // Convert key into valid jwk format
    const validKey = await window.crypto.subtle.importKey(
      "jwk",
      JSON.parse(key),
      "AES-GCM",
      true,
      ["encrypt", "decrypt"]
    );

    // Retrieve the file Content as array buffer
    const fileBuffer = await userSession.getFile(path, { decrypt: false, username: owner });

    // convert array buffer to an Uint8array
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

  /**
   * Destroys the corresponding file model
   * [TODO] Also delete a file's content once blockstack implements it. 
   */
  deleteFile = async () => {
    const { file } = this.props;
    await file.destroy();
    Router.push('/files');
  }

  /**
   * Handles the sharing of file with a blockstack user
   * @param {String} recipient The blockstack username of recipient
   */
  shareFile = async (recipient) => {
    const { userSession, username } = this.state;
    const { file } = this.props;

    let recipientPublicKey;

    // check if recipient's public key exists
    try {
      recipientPublicKey = await userSession.getFile(`keys/${recipient}`, { decrypt: false, username: recipient });
    } catch (error) {
      toast.error('Recipient key not found. Ask the user to login atleast once');
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

  /**
   * Stop file sharing
   * @param {String} recipient The blockstack username of recipient
   */
  stopSharing = async (recipient) => {
    const { file } = this.props;

    // remove recipient from recipients file attrs
    const updatedRecipients = file.attrs.recipients.filter(r => {
      return r !== recipient;
    });

    // set the value for key with recipient username as null
    file.update({
      recipients: updatedRecipients,
      [recipient]: null
    });

    // save the model
    await file.save();
  }

  render() {
    let fileSharingComponent = null;

    if (!this.props.isShared) {
      fileSharingComponent = <FileSharing file={this.props.file} shareFile={this.shareFile} stopSharing={this.stopSharing} />;
    }

    return (
      <Layout>
        <Grid padded='vertically'>
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