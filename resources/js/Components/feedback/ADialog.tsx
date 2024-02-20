import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { Box, Button, Grid, Paper, TextField, TextareaAutosize, Typography } from '@mui/material';

type Props = {
    arrangement_id: number,
    open: number,
    clickHndlr: any,
    closeHndlr: () => void
}
export default function ADialog(props: Props) {
    const { arrangement_id, open } = props;
    const { clickHndlr,closeHndlr } = props;
    const [data, setData] = React.useState({name: '', content: ''});

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
