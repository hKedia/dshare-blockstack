import React from "react";

import { Grid, Header } from "semantic-ui-react";

import Layout from "../../components/Layout";
import SharedFileList from "../../components/SharedFileList";

/**
 * Describes the view to list shared files
 */

export default () => {
  return (
    <Layout>
      <Grid padded='vertically'>
        <Grid.Row>
          <Grid.Column>
            <Header icon='share alternate' size='medium' content='Shared with Others'></Header>
            <SharedFileList />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};