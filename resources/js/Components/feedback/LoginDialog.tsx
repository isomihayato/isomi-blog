import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { Box, Button, Grid, Paper, TextField, TextareaAutosize, Typography } from '@mui/material';
import { useEffect } from 'react';
import { FBClient } from "@/Components/auth/FireBaseClient";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from '@mui/icons-material/GitHub';
import { getStorage } from '../common/functions';

type Props = {
  open: boolean,
  statusHndlr: (status: string) => void,
  closeHndlr: () => void,
}
export default function LoginDialog(props: Props) {
  const { open } = props;
  const { statusHndlr,closeHndlr } = props;
  const client = new FBClient();
  const submitHndlr = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;
    const result = await client.mailAndPassword(email, password);
    console.log(result);
    
    statusHndlr(result);
    closeHndlr();
  }

  return (
    <div>
      <Dialog onClose={closeHndlr} open={Boolean(open)}>
        <Box component={Paper} >
          <Typography variant='h5'>メンバー新規登録/ログイン</Typography>
          <Box component={"form"} onSubmit={submitHndlr}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="メールアドレス"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="パスワード"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  ログイン
                </Button>
              </Grid>
              <Grid item md={6}>
                <Button
                  variant="outlined"
                  onClick={async() => {
                    const result = await client.googlePopup();
                    statusHndlr(result);
                    closeHndlr();
                  }}
                >
                  <GoogleIcon />
                  ログイン
                </Button>
              </Grid>
              <Grid item md={6}>
                <Button
                  variant="outlined"
                  onClick={async() => {
                    const result = await client.githubPopup();
                    statusHndlr(result);
                    closeHndlr();
                  }}
                >
                  <GitHubIcon />
                  ログイン
                </Button>
              </Grid>
            </Grid>
          </Box>
          <div><Button onClick={() => closeHndlr()}>閉じる</Button></div>
        </Box>
      </Dialog>
    </div>
  );
}
