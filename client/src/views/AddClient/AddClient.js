import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addClient } from '../../actions/clientActions';
import { getAgencies } from '../../actions/agencyActions';
import classnames from 'classnames';
import compose from 'recompose/compose';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
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

class AddClient extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      agency: '',
      agencies: [],
      errors: {}
    };
  }

  componentDidMount() {
    this.props.getAgencies().then(res => {
      this.setState({
        agencies: res
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
  
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  
  onSubmit = e => {
    e.preventDefault();
    
    const newClient = {
      name: this.state.name,
      agency_id: this.state.agency
    };
    
    this.props.addClient(newClient, this.props.history); 
  };
  
  render() {
    const { errors } = this.state;
    const { classes } = this.props;
    
    return (
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <EmojiPeopleIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Add Client
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
                <Select
                  variant='outlined'
                  native
                  fullWidth
                  id='agency'
                  value={this.state.agency}
                  onChange={this.onChange}
                >
                  <option aria-label='None' value='' disabled>Agency *</option>
                  {this.state.agencies.map(row => (
                      <option value={row.id}>{row.name}</option>
                  ))}
                </Select>
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
              Add Client
            </Button>
          </form>
        </div>
      </Container>
    );
  }
}

AddClient.propTypes = {
  addClient: PropTypes.func.isRequired,
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
    { addClient, getAgencies }
  )
)(withRouter(AddClient));