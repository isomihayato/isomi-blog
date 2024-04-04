import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button, Input, Select, MenuItem, Switch } from '@mui/material';
import BlogEditor from '@/Components/BlogEditor';
import { postArticle } from '@/Components/axios/axiosArticle';
import formatDate from '@/Components/common/functions';
import PropTypes from 'prop-types';

export default function Create({ auth, article_ad_templates }) {
  const label = { inputProps: { name: 'visible', 'aria-label': '表示' } };
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      title: form.title.value,
      body: form.body.value,
      tags: form.tags.value,
      describe: form.describe.value,
      published_at: form.published_at.value,
      visible: form.visible.checked,
      user_id: form.user_id.value,
      article_ad_template_id: form.article_ad_template_id.value,
    };
    postArticle(data, (response) => {
      if (response.data.status === 'success') {
        window.location.href = '/articles';
      }
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          記事管理
        </h2>
      }
    >
      <Head title="記事管理" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <form method="post" action="/articles" onSubmit={handleSubmit}>
                <input type="hidden" name="_token" value={auth.csrf_token} />
                <input type="hidden" name="user_id" value={auth.user.id} />
                <div>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    required
                    placeholder="記事タイトル"
                    fullWidth
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    name="tags"
                    placeholder="タグ新規登録"
                    fullWidth
                  />
                </div>
                <div>
                  <textarea
                    name="describe"
                    id="describe"
                    required
                    placeholder="describe"
                    rows="3"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <BlogEditor />
                </div>
                <div>
                  <Input
                    type="datetime-local"
                    id="published_at"
                    name="published_at"
                    required
                    placeholder="公開日時"
                    //   defaultValue={new Date().toLocaleString().slice(0, 14).replace(' ', 'T').replaceAll('/','-').replace('\d)}
                    defaultValue={formatDate(new Date())}
                    fullWidth
                  />
                </div>
                <div>
                  <label htmlFor="visible">表示</label>
                  <Switch {...label} defaultChecked />
                </div>
                <div>
                  <Select name="article_ad_template_id" required>
                    {Object.keys(article_ad_templates).map((key) => {
                      return (
                        <MenuItem key={key} value={key}>
                          {article_ad_templates[key]}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
                <div>
                  <Button variant="contained" type="submit">
                    新規作成
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

Create.propTypes = {
  auth: PropTypes.object,
  article_ad_templates: PropTypes.object,
};
