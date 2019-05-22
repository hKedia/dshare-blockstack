import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import Link from 'next/link';

export default class RenderFiles extends Component {
  render() {
    const items = this.props.files.map(file => {
      const { name, _id } = file.attrs;
      const color = this.props.isShared ? 'purple' : 'teal';
      return {
        header: name,
        description: {
          content: (
            <Link href={{
              pathname: "/files/view",
              query: {
                id: _id,
                isShared: this.props.isShared
              }
            }}>
              <a>View File</a>
            </Link>
          ),
          textAlign: 'right'
        },
        meta: file.ago(),
        fluid: true,
        color: color,
        key: _id
      };
    });
    return <Card.Group items={items} />
  }
}