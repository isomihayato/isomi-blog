import React from 'react';
import { Grid } from '@mui/material';
import ResponsibleHeader from '@/Components/header/ResponsibleHeader';
import FrontSideBar from '@/Components/sidebar/FrontSideBar';
import MainFront from '@/Components/main/Front';
import BlogEditor from '@/Components/BlogEditor';
import FrontFooter from '@/Components/footer/FrontFooter';

export default function Show() {
  return (
    <>
      <ResponsibleHeader />
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <FrontSideBar />
        </Grid>
        <Grid item xs={6}>
          <MainFront element={<BlogEditor />} />
        </Grid>
        <Grid item xs={3}>
          <FrontSideBar />
        </Grid>
      </Grid>
      <FrontFooter />
    </>
  );
}
