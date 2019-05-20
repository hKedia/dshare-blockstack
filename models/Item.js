import { Model } from 'radiks';
import moment from 'moment';

export default class Item extends Model {
    static className = 'Item';
    static schema = {
        name: {
            type: String,
            decrypted: true
        },
        path: {
            type: String,
            decrypted: true
        }

    }

    ago() {
        return moment(this.attrs.createdAt).fromNow();
    }
}