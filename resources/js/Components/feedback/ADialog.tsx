import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { Box, Button, Grid, Paper, TextField, TextareaAutosize, Typography } from '@mui/material';
import { useEffect } from 'react';

type Props = {
    aData: {content: string, name: string},
    arrangement_id: number,
    open: number,
    clickHndlr: any,
    closeHndlr: () => void
}
export default function ADialog(props: Props) {
    const { aData, arrangement_id, open } = props;
    const { clickHndlr,closeHndlr } = props;
    const [data, setData] = React.useState(aData);
    useEffect(()=>{
        setData(aData);
    },[aData]);

    return (
        <div>
            <Dialog onClose={closeHndlr} open={Boolean(open)}>
                <Box component={Paper} >
                    <Typography variant='h3'>#{arrangement_id}広告編集</Typography>
                    <Box>
                        <Grid container>
                            <Grid item md={3}>広告名</Grid>
                            <Grid item md={9}>
                                <TextField 
                                  name="name" 
                                  placeholder='例)Docomoのクリック型広告' 
                                  value={data?.name}
                                  onChange={(e)=>{
                                    const _data = {...data};
                                    _data.name = e.target.value;
                                    setData(_data);
                                  }}
                                />
                            </Grid>

                            <Grid item md={3}>内容</Grid>
                            <Grid item md={9}>
                                <TextareaAutosize 
                                  name="content"
                                  value={data?.content}
                                  onChange={(e)=>{
                                    const _data = {...data};
                                    _data.content = e.target.value;
                                    setData(_data);
                                  }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <div><Button onClick={()=>clickHndlr(data)}>送信</Button></div>
                </Box>
            </Dialog>
        </div>
    );
}
