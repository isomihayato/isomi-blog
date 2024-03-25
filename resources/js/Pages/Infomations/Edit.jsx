import React from 'react';
import PropTypes from 'prop-types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button, Switch } from '@mui/material';
import BlogEditor from '@/Components/BlogEditor';
import { updateInfomation } from '@/Components/axios/axiosInfomation';

export default function Edit({ auth, categories, infomation }) {
  console.log(infomation.publish_at);
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      title: form.title.value,
      category_id: form.category_id.value,
      body: form.body.value,
      publish_at: form.published_at.value,
      show_by_bar: form.show_by_bar.checked ? 1 : 0,
    };
    console.log(data);
    updateInfomation(
      infomation.id,
      data,
      (response) => {
        console.log(response);
        if (response.data.status === 'success') {
          window.location.href = '/infomations';
        }
      },
      (error) => {
        console.log(error);
        alert(error.response.data.message);
      },
    );
  };
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          お知らせ管理
        </h2>
      }
    >
      <Head title="お知らせ管理" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div>
                <form
                  method="post"
                  action="/infomations"
                  encType="multipart/form-data"
                  onSubmit={handleSubmit}
                >
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="title"
                    >
                      タイトル
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="title"
                      type="text"
                      name="title"
                      value={infomation.title}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="category_id"
                    >
                      カテゴリ
                    </label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="category_id"
                      name="category_id"
                      value={infomation.category_id}
                      required
                    >
                      <option value="">選択してください</option>
                      {Object.keys(categories).map((key) => {
                        return (
                          <option key={key} value={key}>
                            {categories[key]}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="content"
                    >
                      本文
                    </label>
                    <BlogEditor body={infomation.body} />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="published_at"
                    >
                      公開日時
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="published_at"
                      type="datetime-local"
                      name="published_at"
                      value={infomation.publish_at}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="show_by_bar"
                    >
                      バー表示
                    </label>
                    <Switch
                      id="show_by_bar"
                      name="show_by_bar"
                      defaultChecked={infomation.show_by_bar}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Button type="submit" variant="contained" color="primary">
                      作成
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() => {
                        window.location.href = '/infomations';
                      }}
                    >
                      戻る
                    </Button>
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

Edit.propTypes = {
  auth: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
  infomation: PropTypes.object.isRequired,
};
