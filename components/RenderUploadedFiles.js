import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import Link from 'next/link';

export default class RenderFiles extends Component {
  render() {
    const items = this.props.files.map(file => {
      const { name, _id } = file.attrs;
      return {
        header: name,
        description: {
          content: (
            <Link href={{
              pathname: "/files/view",
              query: {
                id: _id
              }
            }}>
              <a>View File</a>
            </Link>
          ),
          textAlign: 'right'
        },
        meta: file.ago(),
        fluid: true,
        color: 'teal',
        key: _id
      };
    });
    return <Card.Group items={items} />
  }
}