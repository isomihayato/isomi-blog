import React from 'react';
import PropTypes from 'prop-types';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Helmet } from 'react-helmet';
import { Head } from '@inertiajs/react';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ContactForm from '@/Components/forms/ContactForm';
import ResponsibleHeader from '@/Components/header/ResponsibleHeader';

export default function InfomationList() {
  return (
    <>
      <Helmet>
        <meta
          name="keywords"
          content={'MIE Fishing,MIE Fishing about,MIE Fishing 概要'}
        />
        <meta
          name="description"
          content={
            '当ブログサイト、MIE Fishingは、管理主、コモ&トモのプログラミングや技術系の情報を発信するためのブログサイトです。'
          }
        />
        <meta property="og:type" content="article" />
      </Helmet>
      <Head title={`お問い合わせ`} />
      <ResponsibleHeader
        breadcrumbsLink={
          <Breadcrumbs aria-label="breadcrumb" style={{ margin: '10px 15px' }}>
            <Link underline="hover" color="inherit" href="/">
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Top 記事一覧
            </Link>
            <Typography color="text.primary">
              <ContactSupportIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              お問い合わせ
            </Typography>
          </Breadcrumbs>
        }
      />
      <MainFront
        element={
          <>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight={'bold'}
            >
              お問い合わせ
            </Typography>
            <Box>
              <ContactForm />
            </Box>
          </>
        }
      />
      <FrontFooter />
    </>
  );
}

InfomationList.propTypes = {
  infomations_pagenation: PropTypes.object.isRequired,
};
