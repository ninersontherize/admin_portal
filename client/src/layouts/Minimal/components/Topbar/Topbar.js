import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Hidden, IconButton } from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import { logoutUser } from "../../../../actions/authActions";
import compose from 'recompose/compose';
import { connect } from "react-redux";


const useStyles = theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  titleImg: {
    maxHeight: "100px",
    maxWidth: "100px"
  }
});

class Topbar extends React.Component {

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { classes, className, onSidebarOpen, ...rest } = this.props;
    return (
      <AppBar
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Toolbar>
          <RouterLink to="/">
            <img
              alt="Logo"
              src="/images/logos/Casual-Precision.png"
              className={classes.titleImg}
            />
          </RouterLink>
          <div className={classes.flexGrow} />
          <Hidden mdDown>
            <IconButton
              className={classes.signOutButton}
              color="inherit"
              onClick={this.onLogoutClick}
            >
              <InputIcon />
            </IconButton>
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  }
  
};

Topbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default compose(
  withStyles(useStyles),
  connect(
    mapStateToProps,
    { logoutUser }
  )
)(Topbar);