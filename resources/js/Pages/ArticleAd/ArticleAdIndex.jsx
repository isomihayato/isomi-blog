import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import AdTable from '@/Components/dataDispaly/AdTable';

export default function ArticleAdIndex({ auth, articleAds }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          広告管理
        </h2>
      }
    >
      <Head title="広告管理" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Button
            variant="contained"
            onClick={() => {
              window.location.href = '/article_ads/create';
            }}
          >
            新規作成
          </Button>
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <AdTable
                rows={articleAds}
                headers={['ID', '名称', '広告', 'コメント', '削除']}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

ArticleAdIndex.propTypes = {
  auth: PropTypes.object.isRequired,
  articleAds: PropTypes.array.isRequired,
};
