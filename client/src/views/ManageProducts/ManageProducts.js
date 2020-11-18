import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getClients } from '../../actions/clientActions';
import { getProducts, newProduct, updateProduct, deleteProductById } from '../../actions/productActions';
import compose from 'recompose/compose';

import Avatar from '@material-ui/core/Avatar';
import MaterialTable from 'material-table';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { withStyles } from '@material-ui/core/styles';

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
    height: 35,
    width: 35
  },
  errorText: {
    fontSize: '15px',
    fontWeight: '500',
    color: 'red',
    padding: theme.spacing(2)
  },
});

class ManageProducts extends Component {
  constructor() {
    super();
    this.state = {
      displayData: [],
      clients: [],
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
    this.props.getClients().then(res => {
      this.setState({
        clients: res
      });
    });
    
    this.props.getProducts().then(res => {
      this.setState({
        displayData: res
      });
    });
  }

  onProductCreate = productData => {
    this.props.newProduct(productData).then(res => {
      if (res.type !== 'GET_ERRORS') {
        this.setState({
          displayData: this.state.displayData.concat(productData)
        });
      }
    });
  }

  onProductUpdate = productData => {
    this.props.updateProduct(productData.id, productData).then(res => {
      this.props.getProducts().then(res => {
        this.setState({
          displayData: res
        });
      });
    }); 
  }

  onProductDelete = productId => {
    this.props.deleteProductById(productId).then(res => {
      this.props.getProducts().then(res => {
        this.setState({
          displayData: res
        });
      });
    }); 
  }

  isEmpty = obj => {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
  }
  
  render() {
    const { errors } = this.state;
    const { classes } = this.props;
    let error_section;
    let error_message = 'Error: ';

    if (!this.isEmpty(this.state.errors)) {
      for (var prop in errors) {
        error_message = error_message + errors[prop] + ', '
      }
      error_message = error_message.slice(0, error_message.length - 2) + '.';
      error_section = <span className={classes.errorText}>{error_message}</span>
    }

    let title = <Grid
                  container
                  justify='space-between'
                >
                  <Grid item>
                    <h2>Manage Products</h2>
                  </Grid>
                  <Grid item>
                    <Avatar className={classes.avatar}>
                      <ShoppingBasketIcon />
                    </Avatar>
                  </Grid>
                </Grid>

    let columns = [
      { field: 'name', title: 'Product Name', type: 'string', width: 'auto' },
      { field: 'client', title: 'Client',
        editComponent: props => (
          <Select
            native
            value={props.value}
            defaultValue={props.value}
            onChange={e => {
              props.onChange(e.target.value);
            }}
            inputProps={{
              name: 'vendor',
              id: 'vendor-native-simple',
            }}
          >
          <option aria-label='None' value=''>Client</option>
          {this.state.clients.map(row => (
              <option value={row.name}>{row.name}</option>
          ))}
          </Select>
      ) },
      { field: 'schema_name', title: 'Schema Name', type: 'string', width: 'auto' },
    ];
    
    return (
      <Container component='main' maxWidth='xl'>
        <CssBaseline />
        <div className={classes.paper}>
          <Grid container spacing={4}>
            <Grid
              item
              lg={3}
              sm={0}
              xl={3}
              xs={0}
            />
            <Grid
              item
              lg={6}
              sm={12}
              xl={6}
              xs={12}
            >
              <MaterialTable
              columns={columns}
              data={this.state.displayData}
              title={title}
              editable={{
                  onRowAdd: newData =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        this.onProductCreate(newData);
                        resolve()
                      }, 1000)
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        this.onProductUpdate(newData);
                        resolve()
                      }, 1000)
                    }),
                  onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        this.onProductDelete(oldData.id);
                        resolve()
                      }, 1000)
                    }),
                }}
              />
            </Grid>
            {error_section}
          </Grid>
        </div>
      </Container>
    );
  }
}

ManageProducts.propTypes = {
  getClients: PropTypes.func.isRequired,
  newProduct: PropTypes.func.isRequired,
  getProducts: PropTypes.func.isRequired,
  updateProduct: PropTypes.func.isRequired,
  deleteProductById: PropTypes.func.isRequired,
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
    { getClients,
      getProducts, newProduct, updateProduct, deleteProductById }
  )
)(withRouter(ManageProducts));