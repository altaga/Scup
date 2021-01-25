// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import Tab from "./Tab";
import Tab2 from "./Tab2";
import { withCookies } from 'react-cookie';

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
class App extends React.Component {

  render() {

    // Initialize the Microsoft Teams SDK
    microsoftTeams.initialize();

    // Display the app home page hosted in Teams
    return (
      <Router>
        <Route exact path="/privacy" component={Privacy} />
        <Route exact path="/termsofuse" component={TermsOfUse} />
        <Route exact path="/tab" render={() => (<Tab cookies={this.props.cookies} />)} />
        <Route exact path="/test" render={() => (<Tab2 cookies={this.props.cookies} />)} />
      </Router>
    );
  }
}

export default withCookies(App);
