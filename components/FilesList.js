import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

export default class FilesList extends Component {
    render() {
        return this.props.files.map(file => {
            const { name, _id } = file.attrs;
            return (
                <Grid.Row key={_id}>
                    <Grid.Column width={10}>{name}</Grid.Column>
                    <Grid.Column width={3}>{file.ago()}</Grid.Column>
                    <Grid.Column width={3}></Grid.Column>
                </Grid.Row>
            );
        })
    }
}