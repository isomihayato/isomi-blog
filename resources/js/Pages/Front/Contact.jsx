import React from 'react';
import FrontPage from '@/Components/layout/FrontPage';
import { Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { Head } from '@inertiajs/react';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ContactForm from '@/Components/forms/ContactForm';

export default function Contact() {
  return (
    <>
      <Helmet>
        <meta
          name="keywords"
          content={'INFO BOX,INFO BOX about,INFO BOX 概要'}
        />
        <meta
          name="description"
          content={
            '当ブログサイト、INFO BOXは、管理主、りっすんのプログラミングや技術系の情報を発信するためのブログサイトです。'
          }
        />
        <meta property="og:type" content="article" />
      </Helmet>
      <Head title={`お問い合わせ`} />
      <FrontPage
        breadcrumbs={[
          {
            label: 'お問い合わせ',
            icon: <ContactSupportIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
          },
        ]}
        title="お問い合わせ"
      >
        <Box>
          <ContactForm />
        </Box>
      </FrontPage>
    </>
  );
}
