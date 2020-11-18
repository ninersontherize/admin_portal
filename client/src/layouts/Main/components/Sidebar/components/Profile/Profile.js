import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

const useStyles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
});

class Profile extends Component {
  render () {

    const { className, classes, auth, ...rest } = this.props;

    var user = {}
    let avatar;

    if (this.props.auth.user.name === 'James Vassallo') {
      user = {
        name: this.props.auth.user.name,
        avatar: '/images/avatars/james_profile.png',
        bio: 'Managing Partner'
      };
      avatar =  <Avatar
                  alt="Person"
                  className={classes.avatar}
                  component={RouterLink}
                  src={user.avatar}
                  to="/settings"
                />;
    } else {
      user = {
        name: this.props.auth.user.name,
        avatar: 'none',
        bio: 'Admin User'
      };
    }

    return (
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        {avatar}
        <Typography
          className={classes.name}
          variant="h4"
        >
          {user.name}
        </Typography>
        <Typography variant="body2">{user.bio}</Typography>
      </div>
    );
  }
};

Profile.propTypes = {
  className: PropTypes.string,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default compose(withStyles(useStyles), connect(mapStateToProps))(Profile);