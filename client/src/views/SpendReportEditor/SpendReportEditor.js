import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import { getClients, getClientsByProduct, getClientsByAgency } from '../../actions/clientActions';
import { getProducts, getProductsByClient, getProductsByAgency } from '../../actions/productActions';
import { updateCampaign, deleteCampaignById, createCampaign, getCampaignsByFilter } from '../../actions/campaignActions';
import { getLineItemsByProduct, getLineItemsByVendor } from '../../actions/lineItemActions';
import { getVendorByProduct, getVendorByLineItem } from '../../actions/vendorActions';

import MaterialTable from 'material-table';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { TextField, Select, Grid, Card, CardContent, Typography, Avatar } from '@material-ui/core';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  clientTitle: {
    fontWeight: '700',
    fontSize: '15px',
  },
  clientAvatar: {
    backgroundColor: theme.palette.primary.dark,
    height: 56,
    width: 56
  },
  productAvatar: {
    backgroundColor: theme.palette.secondary.dark,
    height: 56,
    width: 56
  },
  dateAvatar: {
    backgroundColor: theme.palette.text.secondary,
    height: 56,
    width: 56
  },
  errorText: {
    fontSize: '15px',
    fontWeight: '500',
    color: 'red',
    padding: theme.spacing(2)
  },
  icon: {
    height: 32,
    width: 32
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
});

class SpendReportEditor extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      columns: [],
      displayData: [],
      clients: [],
      products: [],
      vendors: [{id: 0, name: 'Select A Product'}],
      line_items: [{id: 0, name: 'Select A Product'}],
      client: '',
      product: '',
      agency: '',
      startDate: '',
      endDate: '',
      errors: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  componentDidMount() {
    if (this.props.auth.user.agency_id === null) {
      this.props.getClients().then(res => {
        this.setState({
          clients: res
        });
      });

      this.props.getProducts().then(res => {
        this.setState({
          products: res
        });
      });

      this.props.getCampaignsByFilter(this.state.startDate, this.state.endDate, this.state.product, '').then(res => {
        this.setState({
          displayData: res
        });
      });
    } else {
      this.setState({
        agency: this.props.auth.user.agency_id
      });

      this.props.getClientsByAgency(this.props.auth.user.agency_id).then(res => {
        this.setState({
          clients: res
        });
      });

      this.props.getProductsByAgency(this.props.auth.user.agency_id).then(res => {
        this.setState({
          products: res
        });
      });

      this.props.getCampaignsByFilter(this.state.startDate, this.state.endDate, this.state.product, this.props.auth.user.agency_id).then(res => {
        this.setState({
          displayData: res
        });
      });
    }
  }

  onDateChange = e => {
    this.setState({ [e.target.id]: e.target.value });

    if (e.target.id === 'startDate') {
      this.props.getCampaignsByFilter(e.target.value, this.state.endDate, this.state.product, this.state.agency).then(res => {
        this.setState({
          displayData: res
        });
      });
    } else {
      this.props.getCampaignsByFilter(this.state.startDate, e.target.value, this.state.product, this.state.agency).then(res => {
        this.setState({
          displayData: res
        });
      });
    }
    
  };

  onClientChange = e => {
    this.setState({ [e.target.id]: e.target.value });
    
    if (e.target.value === '') {
      if (this.props.auth.user.agency_id === null) {
        this.props.getClients().then(res => {
          this.setState({
            clients: res
          });
        });
  
        this.props.getProducts().then(res => {
          this.setState({
            products: res,
            product: ''
          });
        });
      } else {
        this.props.getClientsByAgency(this.props.auth.user.agency_id).then(res => {
          this.setState({
            clients: res
          });
        });
  
        this.props.getProductsByAgency(this.props.auth.user.agency_id).then(res => {
          this.setState({
            products: res,
            product: ''
          });
        });
      }
    } else {
      this.props.getProductsByClient(e.target.value).then(res => {
        this.setState({
          products: res
        });
      });
    }
  }

  onProductChange = e => {
    this.setState({ [e.target.id]: e.target.value });

    if (e.target.value === '' && this.state.client === '') {
      this.props.getClients().then(res => {
        this.setState({
          clients: res,
          vendors: [{id: 0, name: 'Select A Product'}],
          line_items: [{id: 0, name: 'Select A Product'}]
        });
      });
    } else if (e.target.value !== '') {
      this.props.getClientsByProduct(e.target.value).then(res => {
        this.setState({
          client: res[0].id
        });
      });

      this.props.getVendorByProduct(e.target.value).then(res => {
        this.setState({
          vendors: res
        });
      });

      this.props.getLineItemsByProduct(e.target.value).then(res => {
        this.setState({
          line_items: res
        });
      });
    } else {
      this.setState({
        vendors: [{id: 0, name: 'Select A Product'}],
        line_items: [{id: 0, name: 'Select A Product'}]
      });
    }

    this.props.getCampaignsByFilter(this.state.startDate, this.state.endDate, e.target.value, this.state.agency).then(res => {
      this.setState({
        displayData: res
      });
    });
  }

  onVendorChange = vendor => {
    if (vendor !== '' && vendor !== 'Select A Product') {
      const vendorInfo = {
        name: vendor,
        product: this.state.product
      }; 

      this.props.getLineItemsByVendor(vendorInfo).then(res => {
        this.setState({
          line_items: res
        });
      });
    } else if (this.state.product !== '') {
      this.props.getLineItemsByProduct(this.state.product).then(res => {
        this.setState({
          line_items: res
        });
      });
    }
  }

  onLineItemChange = line_item => {
    if (line_item !== '' && line_item !== 'Select A Product') {
      const lineItemInfo = {
        name: line_item,
        product: this.state.product
      }; 

      this.props.getVendorByLineItem(lineItemInfo).then(res => {
        this.setState({
          vendors: res
        });
      });
    } else if (this.state.product !== '') {
      this.props.getVendorByProduct(this.state.product).then(res => {
        this.setState({
          vendors: res
        });
      });
    }
  }

  onCampaignCreate = campaignData => {
    campaignData["product_id"] = this.state.product;

    this.props.createCampaign(campaignData).then(res => {
      if (res.type !== 'GET_ERRORS') {
        this.setState({
          displayData: this.state.displayData.concat(campaignData)
        });
      }
    });

    this.props.getVendorByProduct(this.state.product).then(res => {
      this.setState({
        vendors: res
      });
    });

    this.props.getLineItemsByProduct(this.state.product).then(res => {
      this.setState({
        line_items: res
      });
    });
  }

  onCampaignUpdate = campaignData => {
    this.props.updateCampaign(campaignData.id, campaignData).then(res => {
      this.props.getCampaignsByFilter(this.state.startDate, this.state.endDate, this.state.product, this.state.agency).then(res => {
        this.setState({
          displayData: res
        });
      });
    }); 

    this.props.getVendorByProduct(this.state.product).then(res => {
      this.setState({
        vendors: res
      });
    });

    this.props.getLineItemsByProduct(this.state.product).then(res => {
      this.setState({
        line_items: res
      });
    });
  }

  onCampaignDelete = campaignId => {
    this.props.deleteCampaignById(campaignId).then(res => {
      this.props.getCampaignsByFilter(this.state.startDate, this.state.endDate, this.state.product, this.state.agency).then(res => {
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
    const { classes } = this.props;
    const { errors } = this.state;
    let error_section;
    let error_message = 'Error: ';

    if (!this.isEmpty(this.state.errors)) {
      for (var prop in errors) {
        error_message = error_message + errors[prop] + ', '
      }
      error_message = error_message.slice(0, error_message.length - 2) + '.';
      error_section = <span className={classes.errorText}>{error_message}</span>
    }

    let columns = [
      { field: 'start_date', title: 'Start Date',
        editComponent: props => (
            <TextField
              id='date'
              type='date'
              value={props.value}
              defaultValue={props.value}
              onChange={e => props.onChange(e.target.value)}
            />
        ) },
      { field: 'end_date', title: 'End Date',
        editComponent: props => (
            <TextField
              id='date'
              type='date'
              value={props.value}
              defaultValue={props.value}
              onChange={e => props.onChange(e.target.value)}
            />
      )  },
      { field: 'vendor', title: 'Vendor',
        editComponent: props => (
            <Select
              native
              value={props.value}
              defaultValue={props.value}
              onChange={e => {
                props.onChange(e.target.value);
                this.onVendorChange(e.target.value);
              }}
              inputProps={{
                name: 'vendor',
                id: 'vendor-native-simple',
              }}
            >
            <option aria-label='None' value=''>Vendor</option>
            {this.state.vendors.map(row => (
                <option value={row.name}>{row.name}</option>
            ))}
            </Select>
      ) },
      { field: 'line_item', title: 'Line Item',
        editComponent: props => (
            <Select
              native
              value={props.value}
              defaultValue={props.value}
              onChange={e => {
                props.onChange(e.target.value);
                this.onLineItemChange(e.target.value);
              }}
              inputProps={{
                name: 'line_item',
                id: 'line-item-native-simple',
              }}
            >
            <option aria-label='None' value=''>Line Item</option>
            {this.state.line_items.map(row => (
                <option value={row.name}>{row.name}</option>
            ))}
            </Select>
      ) },
      { field: 'planned_budget', title: 'Planned Budget', type: 'currency' },
      { field: 'planned_cpm', title: 'Planned CPM', type: 'currency', width: 'auto' },
      { field: 'actual_cpm', title: 'Acutal CPM', type: 'currency' },
      { field: 'planned_impressions', title: 'Planned Impressions', type: 'numeric' },
      { field: 'actual_impressions', title: 'Acutal Impressions', type: 'numeric' }, ];

    return (
      <Container component='main' maxWidth='xl'>
        <CssBaseline />
        <div className={classes.paper}>
          <Grid container spacing={4}>
            <Grid
              item
              lg={1}
              sm={0}
              xl={1}
              xs={0}
            />
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Card className={clsx(classes.root)}>
                <CardContent>
                  <Grid
                    container
                    justify='space-between'
                  >
                    <Grid item>
                      <Typography
                        className={classes.clientTitle}
                        color='textSecondary'
                        gutterBottom
                        variant='body2'
                      >
                        CLIENT:
                      </Typography>
                      <Select
                        fullWidth
                        native
                        id='client'
                        value={this.state.client}
                        label='Client'
                        onChange={this.onClientChange}
                      >
                      <option aria-label='None' value='' disabled>Select Client</option>
                      <option aria-label='None' value='' />
                      {this.state.clients.map(row => (
                          <option value={row.id}>{row.name}</option>
                      ))}
                      </Select>
                    </Grid>
                    <Grid item>
                      <Avatar className={classes.clientAvatar}>
                        <EmojiPeopleIcon className={classes.icon} />
                      </Avatar>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Card className={clsx(classes.root)}>
                <CardContent>
                  <Grid
                    container
                    justify='space-between'
                  >
                    <Grid item>
                      <Typography
                        className={classes.clientTitle}
                        color='textSecondary'
                        gutterBottom
                        variant='body2'
                      >
                        PRODUCT:
                      </Typography>
                      <Select
                        fullWidth
                        native
                        id='product'
                        value={this.state.product}
                        label='Product'
                        onChange={this.onProductChange}
                      >
                      <option aria-label='None' value='' disabled>Select Product</option>
                      <option aria-label='None' value='' />
                      {this.state.products.map(row => (
                          <option value={row.id}>{row.name}</option>
                      ))}
                      </Select>
                    </Grid>
                    <Grid item>
                      <Avatar className={classes.productAvatar}>
                        <ShoppingBasketIcon className={classes.icon} />
                      </Avatar>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              lg={4}
              sm={6}
              xl={4}
              xs={12}
            >
              <Card className={clsx(classes.root)}>
                <CardContent>
                  <Grid
                    container
                    justify='space-between'
                  >
                    <Grid item>
                      <Typography
                        className={classes.clientTitle}
                        color='textSecondary'
                        gutterBottom
                        variant='body2'
                      >
                        START DATE:
                      </Typography>
                      <TextField
                        id='startDate'
                        type='date'
                        value={this.state.startDate}
                        defaultValue={this.state.startDate}
                        onChange={this.onDateChange}
                      />
                    </Grid>
                    <Grid item>
                      <Typography
                        className={classes.clientTitle}
                        color='textSecondary'
                        gutterBottom
                        variant='body2'
                      >
                        END DATE:
                      </Typography>
                      <TextField
                        id='endDate'
                        type='date'
                        value={this.state.endDate}
                        defaultValue={this.state.endDate}
                        onChange={this.onDateChange}
                      />
                    </Grid>
                    <Grid item>
                      <Avatar className={classes.dateAvatar}>
                        <DateRangeIcon className={classes.icon} />
                      </Avatar>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              lg={1}
              md={0}
              xl={1}
              xs={0}
            />
            <Grid
              item
              lg={1}
              md={0}
              xl={1}
              xs={0}
            />
            <Grid
              item
              lg={10}
              md={12}
              xl={10}
              xs={12}
            >
              <MaterialTable
              columns={columns}
              data={this.state.displayData}
              title={<h2>Spend Report Editor</h2>}
              editable={{
                  onRowAdd: newData =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        this.onCampaignCreate(newData);
                        resolve()
                      }, 1000)
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        this.onCampaignUpdate(newData);
                        resolve()
                      }, 1000)
                    }),
                  onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        this.onCampaignDelete(oldData.id);
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

SpendReportEditor.propTypes = {
  getProducts: PropTypes.func.isRequired,
  getProductsByClient: PropTypes.func.isRequired,
  getClients: PropTypes.func.isRequired,
  getClientsByAgency: PropTypes.func.isRequired,
  getClientsByProduct: PropTypes.func.isRequired,
  updateCampaign: PropTypes.func.isRequired,
  getCampaignsByFilter: PropTypes.func.isRequired,
  deleteCampaignById: PropTypes.func.isRequired,
  createCampaign: PropTypes.func.isRequired,
  getVendorByProduct: PropTypes.func.isRequired,
  getVendorByLineItem: PropTypes.func.isRequired,
  getLineItemsByProduct: PropTypes.func.isRequired,
  getLineItemsByVendor: PropTypes.func.isRequired,
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
    { 
      getClients, getClientsByProduct, getClientsByAgency,
      getProducts, getProductsByClient, getProductsByAgency,
      updateCampaign, deleteCampaignById, createCampaign, getCampaignsByFilter,
      getVendorByProduct, getVendorByLineItem,
      getLineItemsByProduct, getLineItemsByVendor
    }
  )
)(withRouter(SpendReportEditor));