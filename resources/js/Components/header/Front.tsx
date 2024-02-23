import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Login from '@/Pages/Auth/Login';
import LoginDialog from '../feedback/LoginDialog';
import { Alert } from '@mui/material';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

export default function Front(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState("-1,");
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
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            INFO BOX
          </Typography>
          <Button color="inherit" onClick={()=>setOpen(true)}>Login</Button>
        </Toolbar>
      </AppBar>
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
