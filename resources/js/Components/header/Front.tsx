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
import { Alert, Avatar, Menu, MenuItem } from '@mui/material';
import { deleteStorage, getStorage } from '../common/functions';
import { useEffect } from 'react';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

export default function Front(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [status, setStatus] = React.useState("-1,");
  const [photoURL, setPhotoURL] = React.useState(getStorage('photoUrl'));
  const user = getStorage('user');
  useEffect(() => {
    setPhotoURL(getStorage('photoUrl'));
  }, [status]);
  const statusHndlr = (status: string) => {
    if (status === "signin" || status === "success") {
      setStatus("0,ログインしました。");
    } else if (status === "create") {
      setStatus("0,新規登録しました。");
    } else if (status === "error:auth/account-exists-with-different-credential") {
      setStatus("1,他のSNSアカウントで登録済みです。");
    } else {
      setStatus("2,エラーが発生しました。");
    }
  }
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  }
  const menuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={()=>setDrawer(false)}>
      <List>
        <ListItem key="home" onClick={() => window.location.href = "/"}>
          <ListItemText primary="ホーム" />
        </ListItem>
        <ListItem key="search" onClick={() => window.location.href = "/articles/search"}>
          <ListItemText primary="記事検索" />
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
            onClick={()=>setDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            INFO BOX
          </Typography>
          {
            user === undefined || user === null?
              <Button color="inherit" onClick={()=>setOpen(true)}>Login</Button>
              :
              <Avatar alt="メンバー画像" src={photoURL} onClick={handleClick}/>
          }
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={menuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={()=>{deleteStorage('user');deleteStorage('photoURL');window.location.href="/"}}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer open={drawer} onClose={()=>setDrawer(false)}>
        {DrawerList}
      </Drawer>
      <LoginDialog open={open} closeHndlr={() => setOpen(false)} statusHndlr={statusHndlr} />
      {
        status.split(',')[0] === "0"?<Alert severity="success" onClose={() => setStatus('-1,')}>{status.split(',')[1]}</Alert>:null
      }
      {
        status.split(',')[0] === "1"?<Alert severity="warning" onClose={() => setStatus('-1,')}>{status.split(',')[1]}</Alert>:null
      }
      {
        status.split(',')[0] === "2"?<Alert severity="error" onClose={() => setStatus('-1,')}>{status.split(',')[1]}</Alert>:null
      }
    </Box>
  );
}
