import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { AdminRouteWithLayout, PrivateRouteWithLayout, RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout, Login as LoginLayout } from './layouts';

import {
  SpendReportEditor as DashboardView,
  AddUser as AddUserView,
  Login as LoginView,
  AddProduct as AddProductView,
  ManageAgencies as ManageAgenciesView,
  ManageClients as ManageClientsView,
  ManageProducts as ManageProductsView,
  ManageUsers as ManageUsersView,
  ResetPassword as ResetPasswordView,
  //Settings as SettingsView,
  NotFound as NotFoundView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect
        exact
        from='/'
        to='/adminDashboard'
      />
      <RouteWithLayout
        component={LoginView}
        exact
        layout={LoginLayout}
        path='/login'
      />
      <RouteWithLayout
        component={ResetPasswordView}
        exact
        layout={LoginLayout}
        path='/reset/:token'
      />
      <PrivateRouteWithLayout
        component={DashboardView}
        exact
        layout={MinimalLayout}
        path='/dashboard'
      />
      <AdminRouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path='/adminDashboard'
      />
      <AdminRouteWithLayout
        component={AddUserView}
        exact
        layout={MainLayout}
        path='/addUser'
      />
      <AdminRouteWithLayout
        component={AddProductView}
        exact
        layout={MainLayout}
        path='/addProduct'
      />
      <AdminRouteWithLayout
        component={ManageAgenciesView}
        exact
        layout={MainLayout}
        path='/manageAgencies'
      />
      <AdminRouteWithLayout
        component={ManageClientsView}
        exact
        layout={MainLayout}
        path='/manageClients'
      />
      <AdminRouteWithLayout
        component={ManageProductsView}
        exact
        layout={MainLayout}
        path='/manageProducts'
      />
      <AdminRouteWithLayout
        component={ManageUsersView}
        exact
        layout={MainLayout}
        path='/manageUsers'
      />
      <AdminRouteWithLayout
        component={NotFoundView}
        exact
        layout={MainLayout}
        path='/not-found'
      />
      <Redirect to='/not-found' />
    </Switch>
  );
};

export default Routes;