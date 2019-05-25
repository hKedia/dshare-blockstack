import React, { Component } from 'react';
import Link from 'next/link';

import { Card } from 'semantic-ui-react';

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
              <a>More</a>
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