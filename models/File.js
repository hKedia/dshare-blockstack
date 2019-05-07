import { Model } from 'radiks';

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
}