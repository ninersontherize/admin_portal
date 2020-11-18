import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addProduct } from '../../actions/productActions';
import { getClients } from '../../actions/clientActions';
import classnames from 'classnames';
import compose from 'recompose/compose';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
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

class AddProduct extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      client: '',
      schema_name: '',
      clients: [],
      errors: {}
    };
  }

  componentDidMount() {
    this.props.getClients().then(res => {
      this.setState({
        clients: res
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
    
    const newProduct = {
      name: this.state.name,
      client_id: this.state.client,
      schema_name: this.state.schema_name
    };
    
    this.props.addProduct(newProduct, this.props.history); 
  };
  
  render() {
    const { errors } = this.state;
    const { classes } = this.props;
    
    return (
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <ShoppingBasketIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Add Product
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
                  id='client'
                  value={this.state.client}
                  onChange={this.onChange}
                >
                <option aria-label='None' value='' disabled>Client *</option>
                {this.state.clients.map(row => (
                    <option value={row.id}>{row.name}</option>
                ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete='schema_name'
                  name='schema_name'
                  variant='outlined'
                  required
                  fullWidth
                  id='schema_name'
                  label='Schema Name'
                  onChange={this.onChange}
                  value={this.state.schema_name}
                  error={errors.schema_name}
                  className={classnames('', {
                    invalid: errors.schema_name
                  })}
                />
                <span className='red-text'>{errors.schema_name}</span>
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
              Add Product
            </Button>
          </form>
        </div>
      </Container>
    );
  }
}

AddProduct.propTypes = {
  addProduct: PropTypes.func.isRequired,
  getClients: PropTypes.func.isRequired,
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
    { addProduct, getClients }
  )
)(withRouter(AddProduct));