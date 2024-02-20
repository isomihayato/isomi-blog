import * as React from 'react';
import BasicTable from '@/Components/dataDispaly/BasicTablet';
import ADialog from '@/Components/feedback/ADialog';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button } from '@mui/material';
import postArticleAd from '@/Components/axios/axiosArticleAd';


export default function ArticleAdTemplatesCreate({ auth, table_data }) {
    const [form, setFrom] = React.useState(new FormData());
    const [tableData, setTableData] = React.useState(table_data);
    const [open, setOpen] = React.useState(undefined);

    const clickHndlr = (arrangement_id) => {
        setOpen(arrangement_id);
        console.log(open);
    }
    const adClickHndlr = (data) => {
        const form_tmp = Object.assign({}, form);
        const ad_data = Object.assign({}, form['ad_data']);
        ad_data[open] = {
            name: data['name'],
            content: data['content'],
            ad_template_id: open
        }
        form_tmp['ad_data'] = ad_data;
        const _tableData = {...tableData};
        console.log(_tableData);
        _tableData[open] = [tableData[open][0],data['name'],data['content']];
        setTableData(_tableData);
        setFrom(form_tmp);
        setOpen(undefined);
    }

    const submitHndlr = (event) => {
        event.preventDefault();
        const form_tmp = Object.assign({}, form);
        console.log(event);
        form_tmp['template_name'] = event.target.template_name.value;
        postArticleAd(form_tmp,(res)=>{
            console.log(res);
            window.location.href="/article_ad_templates";
        },
        (err)=>{
            console.log(err);
        });
    }

      
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">広告管理</h2>}
        >
            <Head title="広告管理" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-end">
                                <Button variant='contained' onClick={()=>{window.location.href="/article_ad_templates"}}>一覧に戻る</Button>
                            </div>
                            <div className="mt-8">
                                <form action="/article_ad_templates" method="post" onSubmit={submitHndlr}>
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">タイトル</label>
                                        <div className="mt-1">
                                            <input type="text" name="template_name" id="title" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <BasicTable 
                                          headers={['配置場所','広告名','広告']} 
                                          rows={tableData} 
                                          clickHndlr={clickHndlr}
                                        />
                                    </div>
                                    <ADialog open={open} clickHndlr={adClickHndlr} closeHndlr={()=>{setOpen(undefined)}} />
                                    <div className="mt-4">
                                        <Button variant='contained' type="submit">登録</Button>
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
