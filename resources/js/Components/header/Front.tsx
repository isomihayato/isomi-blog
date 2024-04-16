import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
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

type Props = {
  loginOpen?: boolean;
  setLoginOpen?: React.SetStateAction<boolean>;
};
export default function Front(props: Props) {
  const { loginOpen, setLoginOpen } = props;
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
    } else if (status === 'create') {
      setStatus('0,新規登録しました。');
    } else if (
      status === 'error:auth/account-exists-with-different-credential'
    ) {
      setStatus('1,他のSNSアカウントで登録済みです。');
    } else {
      setStatus('2,エラーが発生しました。');
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
        <ListItem key="home" onClick={() => (window.location.href = '/')}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="ホーム" />
        </ListItem>
        <ListItem key="home" onClick={() => (window.location.href = '/about')}>
          <ListItemIcon>
            <WebIcon />
          </ListItemIcon>
          <ListItemText primary="このサイトについて" />
        </ListItem>
        <ListItem
          key="search"
          onClick={() => (window.location.href = '/articles/search')}
        >
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary="記事検索" />
        </ListItem>
        <ListItem
          key="info-list"
          onClick={() => (window.location.href = '/infomations/list')}
        >
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="お知らせ一覧" />
        </ListItem>
        <ListItem
          key="privacy"
          onClick={() => (window.location.href = '/privacy_policy')}
        >
          <ListItemIcon>
            <PrivacyTipIcon />
          </ListItemIcon>
          <ListItemText primary="プライバシーポリシー" />
        </ListItem>
        <ListItem
          key="contact"
          onClick={() => (window.location.href = '/contact')}
        >
          <ListItemIcon>
            <ContactSupportIcon />
          </ListItemIcon>
          <ListItemText primary="お問い合わせ" />
        </ListItem>
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
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            INFO BOX
          </Typography>
          {user === undefined || user === null ? (
            <Button color="inherit" onClick={() => setOpen(true)}>
              Login
            </Button>
          ) : (
            <Avatar alt="メンバー画像" src={photoURL} onClick={handleClick} />
          )}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={menuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
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
