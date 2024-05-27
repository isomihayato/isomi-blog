import * as React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button } from '@mui/material';
import AdForm from '@/Components/forms/AdForm';
import PropTypes from 'prop-types';
import { updateAdvertisements } from '@/Components/axios/axiosAdIntermediate';

export default function ArticleAdTemplatesEdit({
  auth,
  article_template_id,
  template_name,
  article_ads,
  ad_arrangements,
}) {
  const [adData, setAdData] = React.useState([]);

  React.useEffect(() => {
    console.log('article_ads', article_ads);
    const adData = [];
    article_ads.map((ad) => {
      const places = ad.ad_arrangement_ids
        .split(',')
        .map((p) => ad_arrangements[p]);

      adData.push({
        id: ad.id,
        ad: ad.article_ad.id,
        place: places,
      });
    });
    setAdData(adData);
  }, []);

  const submitHndlr = (event) => {
    event.preventDefault();
    const form_tmp = {};

    form_tmp['template_name'] = event.target.template_name.value;
    form_tmp['ad_data'] = adData;
    form_tmp['article_template_id'] = article_template_id;
    console.log('form_tmp', form_tmp);
    updateAdvertisements(
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
      <Head title="広告テンプレート編集管理" />

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
                  action={
                    '/article_ad_templates/' +
                    article_ads[0].article_ad_template_id
                  }
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
                        defaultValue={template_name}
                        name="template_name"
                        id="title"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <AdForm
                      setSubmitFormData={setAdData}
                      defaultData={adData}
                    />
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

ArticleAdTemplatesEdit.propTypes = {
  auth: PropTypes.object,
  article_template_id: PropTypes.string,
  template_name: PropTypes.string,
  article_ads: PropTypes.array,
  ad_arrangements: PropTypes.object,
};
