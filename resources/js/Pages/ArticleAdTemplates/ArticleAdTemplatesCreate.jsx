import * as React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import AdForm from '@/Components/forms/AdForm';
import postAdvertisements from '@/Components/axios/axiosAdIntermediate';

export default function ArticleAdTemplatesCreate({ auth }) {
  const [adData, setAdData] = React.useState([]);

  const submitHndlr = (event) => {
    event.preventDefault();
    const form_tmp = {};

    form_tmp['template_name'] = event.target.template_name.value;
    form_tmp['ad_data'] = adData;
    postAdvertisements(
      form_tmp,
      (res) => {
        console.log('res', res);
        if (res.status === 200) {
          window.location.href = '/article_ad_templates';
        }
      },
      (res) => {
        console.log(res);
      },
    );
  };

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
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex justify-end">
                <Button
                  variant="contained"
                  onClick={() => {
                    window.location.href = '/article_ad_templates';
                  }}
                >
                  一覧に戻る
                </Button>
              </div>
              <div className="mt-8">
                <form
                  action="/article_ad_templates"
                  method="post"
                  onSubmit={submitHndlr}
                >
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      タイトル
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="template_name"
                        id="title"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <AdForm setSubmitFormData={setAdData} />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

ArticleAdTemplatesCreate.propTypes = {
  auth: PropTypes.object,
  table_data: PropTypes.object,
};
