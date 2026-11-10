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
import { deleteStorage, getStorage } from '../common/functions';
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
  setLoginOpen?: React.SetStateAction<boolean>;
  onLoginSuccess?: () => void;
};
export default function Front(props: Props) {
  const { loginOpen, setLoginOpen, onLoginSuccess } = props;
  const [open, setOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [status, setStatus] = React.useState('-1,');
  const [photoURL, setPhotoURL] = React.useState(getStorage('photoUrl'));
  const user = getStorage('user');
  useEffect(() => {
    setOpen(loginOpen);
  }, [loginOpen]);
  useEffect(() => {
    setPhotoURL(getStorage('photoUrl'));
  }, [status]);
  const statusHndlr = (status: string) => {
    if (status === 'signin' || status === 'success') {
      setStatus('0,ログインしました。');
      onLoginSuccess?.();
    } else if (status === 'create') {
      setStatus('0,新規登録しました。');
      onLoginSuccess?.();
    } else if (
      status === 'error:auth/account-exists-with-different-credential'
    ) {
      setStatus('1,他のSNSアカウントで登録済みです。');
    } else {
      setStatus('2,エラーが発生しました。');
    }
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
            alt="ロゴ"
            style={{ marginRight: '5px', width: '110px' }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            BOX
          </Typography>
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
              onClick={() => {
                deleteStorage('user');
                deleteStorage('photoURL');
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          setLoginOpen(false);
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
