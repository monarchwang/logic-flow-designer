import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from '../../../router/index';

class IndexInfo extends React.Component {
  render() {
    return (
      <>
        <Switch>
          {Object.keys(routes).map((route) =>
            Object.keys(routes[route].children).map((child) => (
              <Route
                exact
                key={`/${route}/${child}`}
                path={`/${route}/${child}/${routes[route].children[child]?.params || ''}`}
                component={routes[route].children[child].component}
              />
            ))
          )}
          <Redirect push to="/system/list" />
        </Switch>
      </>
    );
  }
}

export default IndexInfo;
