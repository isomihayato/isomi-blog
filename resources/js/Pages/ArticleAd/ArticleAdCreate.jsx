import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Box, Button, Grid, Input } from '@mui/material';
import PropTypes from 'prop-types';
import postArticleAd from '@/Components/axios/axiosArticleAd';

export default function ArticleAdCreate({ auth }) {
  const [adContext, setAdContext] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      adCode: form.adCode.value,
      comment: form.comment.value,
    };
    postArticleAd(
      data,
      (response) => {
        if (response.data.status === 'success') {
          window.location.href = '/article_ads';
        }
      },
      (error) => {
        console.log(error);
      },
    );
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          広告新規作成
        </h2>
      }
    >
      <Head title="広告作成" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <Box component={'form'} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item sx={{ width: '100%' }}>
                    <div
                      dangerouslySetInnerHTML={{ __html: adContext }}
                      className="preview"
                    />
                  </Grid>
                  <Grid item sx={{ width: '100%' }}>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="名称"
                      fullWidth
                    />
                  </Grid>
                  <Grid item sx={{ width: '100%' }}>
                    <Input
                      type="text"
                      id="adCode"
                      name="adCode"
                      required
                      placeholder="広告code"
                      onBlur={(e) => setAdContext(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item sx={{ width: '100%' }}>
                    <Input
                      type="text"
                      id="comment"
                      name="comment"
                      required
                      placeholder="一言コメント"
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Button type="submit">作成</Button>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

ArticleAdCreate.propTypes = {
  auth: PropTypes.object.isRequired,
};
