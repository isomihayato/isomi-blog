import * as React from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { FBClient } from '@/Components/auth/FireBaseClient';
import {
  isLoginSucceeded,
  toLoginMessage,
} from '@/Components/auth/loginMessages';

type Props = {
  open: boolean;
  statusHndlr: (status: string) => void;
  closeHndlr: () => void;
};

type Mode = 'signin' | 'signup';
// 処理中のボタン(スピナーを出すボタン)
type Pending = 'email' | 'google' | 'github' | null;
// エラーをどこに出すか
type ErrorTarget = 'email' | 'password' | 'form';

const PASSWORD_MIN_LENGTH = 6;

// Firebase のエラーコードごとに、エラーを表示する場所
const ERROR_TARGETS: Record<string, ErrorTarget> = {
  'auth/invalid-email': 'email',
  'auth/user-not-found': 'email',
  'auth/email-already-in-use': 'email',
  'auth/wrong-password': 'password',
  'auth/weak-password': 'password',
};

function errorTarget(result: string): ErrorTarget {
  const code = result.startsWith('error:') ? result.slice('error:'.length) : '';
  return ERROR_TARGETS[code] ?? 'form';
}

// 全幅・同じ高さにそろえる。「Google」「GitHub」が大文字にならないようにする
const BUTTON_SX = { height: 44, textTransform: 'none' } as const;

export default function LoginDialog(props: Props) {
  const { open, statusHndlr, closeHndlr } = props;
  const client = React.useMemo(() => new FBClient(), []);
  const [mode, setMode] = React.useState<Mode>('signin');
  const [pending, setPending] = React.useState<Pending>(null);
  const [error, setError] = React.useState<{
    target: ErrorTarget;
    text: string;
  } | null>(null);

  // 開き直したときは前回のエラーを残さない
  React.useEffect(() => {
    if (open) {
      setError(null);
      setPending(null);
    }
  }, [open]);

  const close = () => {
    // 処理中に閉じると結果を表示できないので、閉じさせない
    if (pending) return;
    closeHndlr();
  };

  // ログイン・新規登録の結果を受け取る。成功したら閉じて画面上部に知らせ、失敗したらダイアログ内に出す
  const handleResult = (result: string) => {
    if (isLoginSucceeded(result)) {
      statusHndlr(result);
      closeHndlr();
      return;
    }
    const message = toLoginMessage(result);
    // 自分でポップアップを閉じたときなどは何も出さない
    setError(
      message ? { target: errorTarget(result), text: message.text } : null,
    );
  };

  const run = async (
    kind: Exclude<Pending, null>,
    action: () => Promise<string | undefined>,
  ) => {
    if (pending) return;
    setPending(kind);
    setError(null);
    try {
      handleResult((await action()) ?? 'error:unknown');
    } finally {
      setPending(null);
    }
  };

  const submitHndlr = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value;
    run('email', () =>
      mode === 'signup'
        ? client.mailSignUp(email, password)
        : client.mailSignIn(email, password),
    );
  };

  const fieldError = (target: ErrorTarget) =>
    error?.target === target ? error.text : undefined;
  const spinner = <CircularProgress size={20} color="inherit" />;
  const busy = pending !== null;

  return (
    <Dialog
      onClose={close}
      open={Boolean(open)}
      fullWidth
      maxWidth="xs"
      aria-labelledby="login-dialog-title"
    >
      <DialogTitle id="login-dialog-title" sx={{ pr: 6 }}>
        メンバーログイン
      </DialogTitle>
      <IconButton
        aria-label="閉じる"
        onClick={close}
        disabled={busy}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ pt: 0 }}>
        <Tabs
          value={mode}
          onChange={(_, value: Mode) => {
            setMode(value);
            setError(null);
          }}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="ログイン" value="signin" disabled={busy} />
          <Tab label="新規登録" value="signup" disabled={busy} />
        </Tabs>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {mode === 'signin'
            ? '登録済みのメールアドレス、または Google・GitHub のアカウントでログインします。'
            : 'はじめての方はこちら。Google・GitHub のアカウントなら、そのままログインすると登録されます。'}
        </Typography>
        {error?.target === 'form' ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.text}
          </Alert>
        ) : null}
        <Box component="form" onSubmit={submitHndlr}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              id="email"
              label="メールアドレス"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoFocus
              required
              disabled={busy}
              error={Boolean(fieldError('email'))}
              helperText={fieldError('email')}
            />
            <TextField
              fullWidth
              name="password"
              label="パスワード"
              type="password"
              id="password"
              autoComplete={
                mode === 'signup' ? 'new-password' : 'current-password'
              }
              required
              disabled={busy}
              inputProps={
                mode === 'signup' ? { minLength: PASSWORD_MIN_LENGTH } : {}
              }
              error={Boolean(fieldError('password'))}
              helperText={
                fieldError('password') ??
                (mode === 'signup'
                  ? `${PASSWORD_MIN_LENGTH}文字以上で入力してください`
                  : undefined)
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={busy}
              startIcon={pending === 'email' ? spinner : undefined}
              sx={BUTTON_SX}
            >
              {mode === 'signup'
                ? 'メールアドレスで新規登録'
                : 'メールアドレスでログイン'}
            </Button>
          </Stack>
        </Box>
        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            または
          </Typography>
        </Divider>
        <Stack spacing={1.5}>
          <Button
            fullWidth
            variant="outlined"
            disabled={busy}
            startIcon={pending === 'google' ? spinner : <GoogleIcon />}
            onClick={() => run('google', () => client.googlePopup())}
            sx={BUTTON_SX}
          >
            Googleでログイン
          </Button>
          <Button
            fullWidth
            variant="outlined"
            disabled={busy}
            startIcon={pending === 'github' ? spinner : <GitHubIcon />}
            onClick={() => run('github', () => client.githubPopup())}
            sx={BUTTON_SX}
          >
            GitHubでログイン
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
