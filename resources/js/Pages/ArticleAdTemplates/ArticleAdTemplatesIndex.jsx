import ArrayTable from '@/Components/dataDispaly/ArrayTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button } from '@mui/material';


export default function ArticleAdTemplatesIndex({ auth, ad_templates}) {
    console.log(ad_templates);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">広告管理</h2>}
        >
            <Head title="広告管理" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Button 
                      variant='contained' 
                      onClick={()=>{window.location.href="/article_ad_templates/create"}}
                    >
                        新規作成
                    </Button>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <ArrayTable headers={['ID', '広告テンプレート名']} rows={ad_templates} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
