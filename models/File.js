import { Model } from 'radiks';
import moment from 'moment';

export default class File extends Model {
    static className = 'File';
    static schema = {
        name: String,
        path: String,
        key: String,
        uploadedBy: {
            type: String,
            decrypted: true
        }
    }

    ago() {
        return moment(this.attrs.createdAt).fromNow();
    }
}