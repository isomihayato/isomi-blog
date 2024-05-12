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
import {
  Alert,
  Avatar,
  Breadcrumbs,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material';
import { deleteStorage, getStorage } from '../common/functions';
import { useEffect } from 'react';
import InfoAlert from '../feedback/InfoAlert';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import WebIcon from '@mui/icons-material/Web';
import InfoIcon from '@mui/icons-material/Info';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import Container from '@mui/material/Container';
import { isMobile } from 'react-device-detect';

const pages = [
  'ホーム',
  '当サイトについて',
  '記事検索',
  'お知らせ一覧',
  'プライバシーポリシー',
  'お問い合わせ',
];
const links = [
  '/',
  '/about',
  '/articles/search',
  '/infomations/list',
  '/privacy_policy',
  '/contact',
];
type Props = {
  loginOpen?: boolean;
  setLoginOpen?: React.SetStateAction<boolean>;
  breadcrumbsLink?: JSX.Element;
};
function ResponsibleHeader(props: Props) {
  const { loginOpen, setLoginOpen, breadcrumbsLink } = props;
  const [open, setOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = React.useState(false);
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
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          color: 'black',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isMobile ? null : (
              <img
                src="/img/fishing_header_logo.webp"
                alt="header_fish_logo"
                width="150"
                style={{
                  marginRight: '15px',
                }}
              />
            )}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              MIE Fishing
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => setDrawer(true)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                color="inherit"
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(menuOpen)}
                onClose={menuClose}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={menuClose}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              MIE Fishing
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => {
                    window.location.href = links[pages.indexOf(page)];
                  }}
                  sx={{ my: 2, display: 'block' }}
                  color="inherit"
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              {user === undefined || user === null ? (
                <Button color="inherit" onClick={() => setOpen(true)}>
                  Login
                </Button>
              ) : (
                <Avatar
                  alt="メンバー画像"
                  src={photoURL}
                  onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                    setAccountMenuOpen(true);
                  }}
                />
              )}
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={accountMenuOpen}
                onClose={() => setAccountMenuOpen(false)}
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
            </Box>
          </Toolbar>
          {breadcrumbsLink}
        </Container>
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
export default ResponsibleHeader;
