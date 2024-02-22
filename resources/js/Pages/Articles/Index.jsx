import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button } from '@mui/material';


export default function Index({ auth, articles }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">記事管理</h2>}
        >
            <Head title="記事管理" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Button variant='contained' onClick={()=>{window.location.href="/articles/create"}}>新規作成</Button>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div>
                                <table className="table-auto">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2">ID</th>
                                            <th className="px-4 py-2">タイトル</th>
                                            <th className="px-4 py-2">公開日時</th>
                                            <th className="px-4 py-2">編集</th>
                                            <th className="px-4 py-2">削除</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {
                                                articles.map((article) => {
                                                    return (
                                                        <tr key={article.id}>
                                                            <td className="border px-4 py-2">{article.id}</td>
                                                            <td className="border px-4 py-2">{article.title}</td>
                                                            <td className="border px-4 py-2">{article.published_at}</td>
                                                            <td className="border px-4 py-2">
                                                                <Button 
                                                                  variant='contained' 
                                                                  onClick={()=>{window.location.href="/articles/"+article.id+"/edit"}}
                                                                >
                                                                    編集
                                                                </Button>
                                                            </td>
                                                            <td className="border px-4 py-2">
                                                                <Button 
                                                                  variant='contained' 
                                                                  onClick={()=>{window.location.href="/articles/"+article.id+"/delete"}}
                                                                >
                                                                    削除
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
