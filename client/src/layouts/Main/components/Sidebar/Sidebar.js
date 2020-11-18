import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import ApartmentIcon from '@material-ui/icons/Apartment';
//import SettingsIcon from '@material-ui/icons/Settings';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

import { Profile, SidebarNav } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: 'Dashboard',
      href: '/adminDashboard',
      icon: <DashboardIcon />
    },
    {
      title: 'Manage Agencies',
      href: '/manageAgencies',
      icon: <ApartmentIcon />
    },
    {
      title: 'Manage Clients',
      href: '/manageClients',
      icon: <EmojiPeopleIcon />
    },
    {
      title: 'Manage Products',
      href: '/manageProducts',
      icon: <ShoppingBasketIcon />
    },
    {
      title: 'Add User',
      href: '/addUser',
      icon: <GroupAddIcon />
    }, 
    {
      title: 'Manage Users',
      href: '/manageUsers',
      icon: <PeopleIcon />
    },     
    //{
    //  title: 'Settings',
    //  href: '/settings',
    //  icon: <SettingsIcon />
    //}
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;