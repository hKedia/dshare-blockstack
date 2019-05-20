import { UserGroup } from 'radiks';
import moment from 'moment';

export default class FileManager extends UserGroup {
  static schema = {
    ...UserGroup.schema,
    name: {
      type: String,
      decrypted: true
    }
  }

  ago() {
    return moment(this.attrs.createdAt).fromNow();
  }
}