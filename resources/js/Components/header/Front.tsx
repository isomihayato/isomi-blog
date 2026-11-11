import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoginDialog from '../feedback/LoginDialog';
import { Alert, Avatar, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { getStorage } from '../common/functions';
import { FBClient, watchLoginState } from '../auth/FireBaseClient';
import { isLoginSucceeded, toLoginMessage } from '../auth/loginMessages';
import { useEffect } from 'react';
import InfoAlert from '../feedback/InfoAlert';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import WebIcon from '@mui/icons-material/Web';
import InfoIcon from '@mui/icons-material/Info';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

/** メニュー(Drawer)の項目 */
const MENU_ITEMS = [
  { href: '/', label: 'ホーム', icon: <HomeIcon /> },
  { href: '/about', label: 'このサイトについて', icon: <WebIcon /> },
  { href: '/articles/search', label: '記事検索', icon: <SearchIcon /> },
  { href: '/infomations/list', label: 'お知らせ一覧', icon: <InfoIcon /> },
  {
    href: '/privacy_policy',
    label: 'プライバシーポリシー',
    icon: <PrivacyTipIcon />,
  },
  { href: '/contact', label: 'お問い合わせ', icon: <ContactSupportIcon /> },
];

type Props = {
  loginOpen?: boolean;
  setLoginOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onLoginSuccess?: () => void;
  // ログイン状態が変わったとき(別タブでのログアウト・セッション切れを含む)に呼ぶ
  onAuthChange?: () => void;
};
export default function Front(props: Props) {
  const { loginOpen, setLoginOpen, onLoginSuccess, onAuthChange } = props;
  const [open, setOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [status, setStatus] = React.useState('-1,');
  const [photoURL, setPhotoURL] = React.useState(getStorage('photoUrl'));
  // ログイン状態は Firebase の状態に合わせて更新された localStorage から読む
  const [, setAuthVersion] = React.useState(0);
  const user = getStorage('user');
  useEffect(() => {
    return watchLoginState(() => {
      setPhotoURL(getStorage('photoUrl'));
      setAuthVersion((v) => v + 1);
      onAuthChange?.();
    });
  }, []);
  useEffect(() => {
    setOpen(loginOpen);
  }, [loginOpen]);
  useEffect(() => {
    setPhotoURL(getStorage('photoUrl'));
  }, [status]);
  const statusHndlr = (result: string) => {
    const message = toLoginMessage(result);
    if (message === null) {
      setStatus('-1,');
    } else {
      const level = { success: '0', warning: '1', error: '2' }[
        message.severity
      ];
      setStatus(`${level},${message.text}`);
    }
    if (isLoginSucceeded(result)) onLoginSuccess?.();
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };
  const menuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };
  const DrawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setDrawer(false)}
    >
      <List>
        {MENU_ITEMS.map((item) => {
          const current = window.location.pathname === item.href;
          return (
            // 画面遷移はリンクにする(新しいタブで開ける・Tab キーで選べる・押せると分かる)
            <ListItemButton
              key={item.href}
              component="a"
              href={item.href}
              selected={current}
              aria-current={current ? 'page' : undefined}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="メニューを開く"
            sx={{ mr: 2 }}
            onClick={() => setDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <img
            src="/img/info_box.webp"
            alt="INFO BOX"
            style={{ marginRight: '5px', width: '110px' }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            BOX
          </Typography>
          <IconButton
            color="inherit"
            href="/articles/search"
            aria-label="記事検索"
            sx={{ mr: 1 }}
          >
            <SearchIcon />
          </IconButton>
          {user === undefined || user === null ? (
            <Button color="inherit" onClick={() => setOpen(true)}>
              Login
            </Button>
          ) : (
            // アカウントのメニュー(ログアウト)を開くボタン
            <IconButton
              aria-label="アカウントメニューを開く"
              aria-controls={menuOpen ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? 'true' : undefined}
              onClick={handleClick}
              sx={{ p: 0.5 }}
            >
              <Avatar alt="メンバー画像" src={photoURL} />
            </IconButton>
          )}
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={menuClose}
          >
            <MenuItem
              onClick={async () => {
                // Firebase のセッションも消す(localStorage だけ消すと、再読み込みでログイン状態に戻る)
                await new FBClient().signOut();
                window.location.href = '/';
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer open={drawer} onClose={() => setDrawer(false)}>
        {DrawerList}
      </Drawer>
      <LoginDialog
        open={open}
        closeHndlr={() => {
          setOpen(false);
          // setLoginOpen を渡していないページ(記事詳細以外)もあるので、あるときだけ呼ぶ
          setLoginOpen?.(false);
        }}
        statusHndlr={statusHndlr}
      />
      <InfoAlert />
      {status.split(',')[0] === '0' ? (
        <Alert severity="success" onClose={() => setStatus('-1,')}>
          {status.split(',')[1]}
        </Alert>
      ) : null}
      {status.split(',')[0] === '1' ? (
        <Alert severity="warning" onClose={() => setStatus('-1,')}>
          {status.split(',')[1]}
        </Alert>
      ) : null}
      {status.split(',')[0] === '2' ? (
        <Alert severity="error" onClose={() => setStatus('-1,')}>
          {status.split(',')[1]}
        </Alert>
      ) : null}
    </Box>
  );
}
