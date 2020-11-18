import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import { getAgencies } from '../../actions/agencyActions';
import classnames from 'classnames';
import compose from 'recompose/compose';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.dark,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

const role_options = [
  { name: 'admin' },
  { name: 'agency' }
]

class AddUser extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      role: '',
      agency: '',
      agencies: [],
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  componentDidMount() {
    this.props.getAgencies().then(res => {
      this.setState({
        agencies: res
      });
    });
  }
  
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  
  onSubmit = e => {
    e.preventDefault();

    var newUser = {};

    if (this.state.agency === '') {
      newUser = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        password2: this.state.password2,
        role: this.state.role,
        agency_id: null
      };
    } else {
      newUser = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        password2: this.state.password2,
        role: this.state.role,
        agency_id: this.state.agency
      };
    }    
    
    this.props.registerUser(newUser, this.props.history); 
  };
  
  render() {
    const { errors } = this.state;
    const { classes } = this.props;

    let agency_select;

    if (this.state.role === 'agency') {
      agency_select = <Grid item xs={12}>
        <Select
          variant='outlined'
          native
          required
          fullWidth
          name='agency'
          id='agency'
          onChange={this.onChange}
          value={this.state.agency}
          error={errors.agency}
          className={classnames('', {
            invalid: errors.agency
          })}
        >
          <option aria-label='None' value='' disabled>Agency *</option>
          <option aria-label='None' value='' />
          {this.state.agencies.map(row => (
              <option value={row.id}>{row.name}</option>
          ))}
        </Select>
        <span className='red-text'>{errors.role}</span>
      </Grid>
    }
    
    return (
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <GroupAddIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Add User
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete='name'
                  name='name'
                  variant='outlined'
                  required
                  fullWidth
                  id='name'
                  label='Name'
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  className={classnames('', {
                    invalid: errors.name
                  })}
                />
                <span className='red-text'>{errors.name}</span>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  required
                  fullWidth
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  className={classnames('', {
                    invalid: errors.email
                  })}
                />
                <span className='red-text'>{errors.email}</span>
              </Grid>
              <Grid item xs={12}>
                <Select
                  variant='outlined'
                  native
                  required
                  fullWidth
                  name='role'
                  id='role'
                  onChange={this.onChange}
                  value={this.state.role}
                  error={errors.role}
                  className={classnames('', {
                    invalid: errors.role
                  })}
                >
                  <option aria-label='None' value='' disabled>Role *</option>
                  {role_options.map(row => (
                      <option value={row.name}>{row.name}</option>
                  ))}
                </Select>
                <span className='red-text'>{errors.role}</span>
              </Grid>
              {agency_select}
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  required
                  fullWidth
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='current-password'
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  className={classnames('', {
                    invalid: errors.password
                  })}
                />
                <span className='red-text'>{errors.password}</span>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  required
                  fullWidth
                  name='password2'
                  label='Confirm Password'
                  type='password'
                  id='password2'
                  autoComplete='current-password2'
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  className={classnames('', {
                    invalid: errors.password2
                  })}
                />
                <span className='red-text'>{errors.password2}</span>
              </Grid>
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
              onClick={this.onSubmit}
            >
              Add User
            </Button>
          </form>
        </div>
      </Container>
    );
  }
}

AddUser.propTypes = {
  registerUser: PropTypes.func.isRequired,
  getAgencies: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default compose(
  withStyles(useStyles),
  connect(
    mapStateToProps,
    { registerUser, getAgencies }
  )
)(withRouter(AddUser));