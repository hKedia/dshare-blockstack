import { getConfig } from 'radiks';

import Layout from '../../components/Layout';
import { encryptItem } from '../../utils/crypto';
import Item from '../../models/Item';
        loading: false,
        publicKey: null,
        userSession: null,
        username: null
    async componentDidMount() {
        const user = userSession.loadUserData();
        const publicKey = await userSession.getFile(`keys/${user.username}`, { decrypt: false });
            publicKey,
            userSession,
            username: user.username
        const { buffer, fileName, publicKey, userSession, username } = this.state;
        const { data, iv, key } = await encryptItem(buffer);
        console.log('keyData', keyData);

        // encryption key encrypted with user public key
        const encryptedKey = await userSession.encryptContent(JSON.stringify(keyData), { publicKey: publicKey });
        console.log('encryptedKey', encryptedKey);
            await userSession.putFile(path, data_iv, { encrypt: false });
            console.log('File Uploaded');
        const file = new Item({
            owner: username,
            [username]: encryptedKey