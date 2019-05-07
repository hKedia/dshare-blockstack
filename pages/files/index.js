import React, { Component } from 'react';
import Layout from '../../components/Layout';
import File from '../../models/File';
import { Grid } from 'semantic-ui-react';
import FilesList from '../../components/FilesList';

export default class Index extends Component {
    state = {
        files: []
    }

    async componentDidMount() {
        const files = await File.fetchOwnList();
        console.log(files);
        this.setState({ files });
    }
    render() {
        let filesList;
        if (this.state.files.length === 0) {
            filesList = <p>No Files Found</p>;
        } else {
            filesList = <FilesList files={this.state.files} />
        }
        return (
            <Layout>
                <Grid celled container>
                    <Grid.Row>
                        <Grid.Column width={10} as="h4">File Name</Grid.Column>
                        <Grid.Column width={3} as="h4">Uploaded</Grid.Column>
                        <Grid.Column width={3} as="h4">Actions</Grid.Column>
                    </Grid.Row>
                    {filesList}
                </Grid>
            </Layout>
        )
    }
}