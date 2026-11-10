import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { FBClient } from '@/Components/auth/FireBaseClient';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

type Props = {
  open: boolean;
  statusHndlr: (status: string) => void;
  closeHndlr: () => void;
};
export default function LoginDialog(props: Props) {
  const { open } = props;
  const { statusHndlr, closeHndlr } = props;
  const client = new FBClient();
  const submitHndlr = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value;
    // 押したボタンでログインか新規登録かを分ける(ログインに失敗しても勝手に登録しない)
    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const result =
      submitter?.value === 'signup'
        ? await client.mailSignUp(email, password)
        : await client.mailSignIn(email, password);

    statusHndlr(result);
    closeHndlr();
  };

  return (
    <div>
      <Dialog onClose={closeHndlr} open={Boolean(open)}>
        <Box component={Paper} className="form__outer">
          <Typography variant="h5">メンバー新規登録/ログイン</Typography>
          <Box
            component={'form'}
            onSubmit={submitHndlr}
            style={{ marginBottom: '20px' }}
          >
            <Grid container rowSpacing={{ xs: 2, md: 3 }}>
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
                  name="action"
                  value="signin"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  ログイン
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  name="action"
                  value="signup"
                  fullWidth
                  variant="outlined"
                  color="primary"
                >
                  新規登録(パスワードは6文字以上)
                </Button>
              </Grid>
              <Grid item md={6} xs={6} textAlign={'center'}>
                <Button
                  variant="outlined"
                  onClick={async () => {
                    const result = await client.googlePopup();
                    statusHndlr(result);
                    closeHndlr();
                  }}
                >
                  <GoogleIcon />
                  ログイン
                </Button>
              </Grid>
              <Grid item md={6} xs={6} textAlign={'center'}>
                <Button
                  variant="outlined"
                  onClick={async () => {
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
          <div>
            <Button onClick={() => closeHndlr()}>閉じる</Button>
          </div>
        </Box>
      </Dialog>
    </div>
  );
}
