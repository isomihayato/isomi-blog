import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button, Input } from '@mui/material';
import BlogEditor from '@/Components/BlogEditor';
import { postArticle } from '@/Components/axios/axiosArticle';
import  formatDate  from '@/Components/common/functions';

export default function Index({ auth }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const data = {
            title: form.title.value,
            body: form.body.value,
            published_at: form.published_at.value,
            user_id: form.user_id.value,
        }
        postArticle(data, (response) => {
            console.log(response);
            if (response.data.status === "success") {
                window.location.href = "/articles";
            }
        });
    }

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
                                    <Input type="text" id="title" name="title" required placeholder='記事タイトル' fullWidth />
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
                                      placeholder='公開日時'
                                    //   defaultValue={new Date().toLocaleString().slice(0, 14).replace(' ', 'T').replaceAll('/','-').replace('\d)}
                                      defaultValue={formatDate(new Date())}
                                      fullWidth 
                                    /> 
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
