import React, { Component } from 'react';
import { Segment, Header, Button, Form, Input } from 'semantic-ui-react';
import { getConfig } from 'radiks';
import Router from 'next/router';

import Layout from '../../components/Layout';
import { encryptItem } from '../../utils/crypto';
import Item from '../../models/Item';

const shortid = require('shortid');

export default class Upload extends Component {
    state = {
        buffer: null,
        fileName: null,
        loading: false,
        publicKey: null,
        userSession: null,
        username: null
    }

    async componentDidMount() {
        const { userSession } = getConfig();
        const user = userSession.loadUserData();
        const publicKey = await userSession.getFile(`keys/${user.username}`, { decrypt: false });
        this.setState({
            publicKey,
            userSession,
            username: user.username
        });
    }

    captureFile = event => {
        event.stopPropagation();
        event.preventDefault();
        const file = event.target.files[0];
        this.setState({ fileName: file.name });
        let reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            this.convertToBuffer(reader);
        };
    }

    convertToBuffer = async reader => {
        const buffer = await Buffer.from(reader.result);
        this.setState({ buffer });
    };

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ loading: true });

        const { buffer, fileName, publicKey, userSession, username } = this.state;

        // encrypt the file
        const { data, iv, key } = await encryptItem(buffer);
        const dataArray = new Uint8Array(data);

        // combine the data and random value
        const data_iv = new Uint8Array([...dataArray, ...iv]);

        // encryption key in JSON
        const keyData = await window.crypto.subtle.exportKey("jwk", key);
        console.log('keyData', keyData);

        // encryption key encrypted with user public key
        const encryptedKey = await userSession.encryptContent(JSON.stringify(keyData), { publicKey: publicKey });
        console.log('encryptedKey', encryptedKey);

        // generating a random identifier for file path
        const identifier = shortid.generate();

        // contruct the file path
        const path = `files/${identifier}`;

        //upload to Gaia
        try {
            await userSession.putFile(path, data_iv, { encrypt: false });
            console.log('File Uploaded');
        } catch (error) {
            console.error(error.message);
        }

        // Creating a new file model
        const file = new Item({
            name: fileName,
            path: path,
            owner: username,
            [username]: encryptedKey
        })

        // Saving the newly created file model to radiks
        try {
            await file.save();
            Router.push('/files')
        } catch (error) {
            console.error(error.message);
        }
        this.setState({ loading: false });
    }

    render() {
        return (
            <Layout>
                <Segment>
                    <Header>Upload File</Header>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <Input type="file" onChange={this.captureFile} required />
                            </Form.Field>
                        </Form.Group>
                        <Button primary loading={this.state.loading} type="submit">Upload</Button>
                    </Form>
                </Segment>
            </Layout>
        )
    }
}