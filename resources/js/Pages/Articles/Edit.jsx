import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button, Input, Select, MenuItem } from '@mui/material';
import BlogEditor from '@/Components/BlogEditor';
import { updateArticle } from '@/Components/axios/axiosArticle';

export default function Edit({ auth, id, article, article_ad_templates }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const data = {
            title: form.title.value,
            body: form.body.value,
            tags: form.tags.value,
            published_at: form.published_at.value,
            user_id: form.user_id.value,
            article_ad_template_id: form.article_ad_template_id.value
        }
        updateArticle(id, data, (response) => {
            console.log(response);
            if (response.data.status === "success") {
                window.location.href = "/articles";
            }
        });
    }
    console.log(article_ad_templates);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">記事管理</h2>}
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
                                      defaultValue={article.title} 
                                      required 
                                      placeholder='記事タイトル' 
                                      fullWidth 
                                    />
                                </div>
                                <div>
                                    <Input type="text" name="tags" value={article.tags} placeholder='タグ新規登録' fullWidth />
                                </div>
                                <div>
                                    <BlogEditor body={article.body}/>
                                </div>
                                <div>
                                    <Input 
                                      type="datetime-local" 
                                      id="published_at" 
                                      name="published_at" 
                                      required 
                                      placeholder='公開日時'
                                      defaultValue={article.published_at.slice(0, 16)}
                                      fullWidth 
                                    /> 
                                </div>
                                    <div>
                                        <Select name="article_ad_template_id" required defaultValue={article.article_ad_template_id}>
                                            {
                                                Object.keys(article_ad_templates).map((key) => {
                                                    return (
                                                        <MenuItem key={key} value={key}>{article_ad_templates[key]}</MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </div>
                                    <div>
                                        <Button variant='contained' type="submit">新規作成</Button>
                                    </div>
                                </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
