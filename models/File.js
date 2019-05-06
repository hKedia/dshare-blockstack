import { Model } from 'radiks';

export default class File extends Model {
    static className = 'File';
    static schema = {
        name: String,
        gaiaUrl: String,
        key: String
    }
}