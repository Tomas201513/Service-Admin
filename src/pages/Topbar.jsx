import * as React from "react";
import { useContext, useRef, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";
import LogoutIcon from "@mui/icons-material/Logout";
import AuthContext from "../context/AuthContext";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import { services, apps, account, dashboard } from "../menu-item/sidebaritems";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  IconButton,
  Paper,
  Popper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import Fade from "@mui/material/Fade";
import { Link, Outlet, useNavigate } from "react-router-dom";

import avatar1 from "../assets/tom.png";
import Logo from "../components/Logo";

const drawerWidth = 260;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Topbar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawer = () => {
    setOpen(!open);
  };
  // const [openprofile, setOpenProfile] = React.useState(false);
  // const handleToggle = () => {
  //   setOpenProfile(!openprofile);
  // };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openprofile, setOpenProfile] = React.useState(false);
  const [placement, setPlacement] = React.useState();
  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpenProfile((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };
  const navigate = useNavigate();
  const handleLogout = async () => {
    navigate("/login");
  };
  const { user, logoutUser } = useContext(AuthContext);
  const anchorRef = useRef(null);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpenProfile(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{ background: "white", color: "#757575", boxShadow: 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawer}
            edge="start"
            // sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            {open ? <FormatIndentDecreaseIcon /> : <FormatIndentIncreaseIcon />}
          </IconButton>
          {/* <Typography variant="h6" noWrap component="div">
            Persistent drawer
          </Typography> */}
          <Box sx={{ width: "100%", ml: 1 }} />
          <IconButton
            // onClick={handleClick("bottom-end")}
            sx={{ borderRadius: 5, color: "#757575", mr: 1, ml: 1, p: 0 }}
          >
            <GTranslateIcon />
          </IconButton>
          <IconButton
            onClick={handleClick("bottom-end")}
            sx={{ borderRadius: 5 }}
          >
            <Avatar
              alt="profile user"
              // src={avatar1}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
          <Popper
            open={openprofile}
            anchorEl={anchorEl}
            placement={placement}
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper
                  sx={{
                    width: 200,
                    minWidth: 200,
                    maxWidth: 290,
                    [theme.breakpoints.down("md")]: {
                      maxWidth: 250,
                    },
                  }}
                >
                  <ClickAwayListener onClickAway={handleClose}>
                    <CardContent sx={{ px: 5.5, pt: 2 }}>
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <Button variant="body2" color="textSecondary">
                            Profile <PersonIcon />
                          </Button>
                          <Button
                            onClick={logoutUser}
                            variant="body2"
                            color="textSecondary"
                          >
                            Logout <LogoutIcon />
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </ClickAwayListener>
                </Paper>
              </Fade>
            )}
          </Popper>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>{/* <Logo />{" "} */}</DrawerHeader>
        <Divider />

        <List>
          {dashboard.map((dashboard) => (
            <ListItem key={dashboard.id} disablePadding>
              <ListItemButton component={Link} to={dashboard.url}>
                <ListItemIcon>{dashboard.icon}</ListItemIcon>
                <ListItemText primary={dashboard.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {services.map((service) => (
            <ListItem key={service.id} disablePadding>
              <ListItemButton component={Link} to={service.url}>
                <ListItemIcon>{service.icon}</ListItemIcon>
                <ListItemText primary={service.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {apps.map((app) => (
            <ListItem key={app.id} disablePadding>
              <ListItemButton component={Link} to={app.url}>
                <ListItemIcon>{app.icon}</ListItemIcon>
                <ListItemText primary={app.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {account.map((accounts) => (
            <ListItem key={accounts.id} disablePadding>
              <ListItemButton component={Link} to={accounts.url}>
                <ListItemIcon>{accounts.icon}</ListItemIcon>
                <ListItemText primary={accounts.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
}
