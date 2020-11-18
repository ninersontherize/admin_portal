import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAgencies } from '../../actions/agencyActions';
import { getClients, newClient, updateClient, deleteClientById } from '../../actions/clientActions';
import compose from 'recompose/compose';

import Avatar from '@material-ui/core/Avatar';
import MaterialTable from 'material-table';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
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

class ManageClients extends Component {
  constructor() {
    super();
    this.state = {
      displayData: [],
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
    
    this.props.getClients().then(res => {
      this.setState({
        displayData: res
      });
    });
  }

  onClientCreate = clientData => {
    this.props.newClient(clientData).then(res => {
      if (res.type !== 'GET_ERRORS') {
        this.setState({
          displayData: this.state.displayData.concat(clientData)
        });
      }
    });
  }

  onClientUpdate = clientData => {
    this.props.updateClient(clientData.id, clientData).then(res => {
      this.props.getClients().then(res => {
        this.setState({
          displayData: res
        });
      });
    }); 
  }

  onClientDelete = clientId => {
    this.props.deleteClientById(clientId).then(res => {
      this.props.getClients().then(res => {
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
                    <h2>Manage Clients</h2>
                  </Grid>
                  <Grid item>
                    <Avatar className={classes.avatar}>
                      <EmojiPeopleIcon />
                    </Avatar>
                  </Grid>
                </Grid>

    let columns = [
      { field: 'name', title: 'Client Name', type: 'string', width: 'auto' },
      { field: 'agency', title: 'Agency',
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
          <option aria-label='None' value=''>Agency</option>
          {this.state.agencies.map(row => (
              <option value={row.name}>{row.name}</option>
          ))}
          </Select>
      ) },
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
                        this.onClientCreate(newData);
                        resolve()
                      }, 1000)
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        this.onClientUpdate(newData);
                        resolve()
                      }, 1000)
                    }),
                  onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        this.onClientDelete(oldData.id);
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

ManageClients.propTypes = {
  getAgencies: PropTypes.func.isRequired,
  newClient: PropTypes.func.isRequired,
  getClients: PropTypes.func.isRequired,
  updateClient: PropTypes.func.isRequired,
  deleteClientById: PropTypes.func.isRequired,
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
    { getAgencies,
      getClients, newClient, updateClient, deleteClientById }
  )
)(withRouter(ManageClients));