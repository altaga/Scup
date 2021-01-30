// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';

/**
 * This component is used to display the required
 * terms of use statement which can be found in a
 * link in the about tab.
 */
class TermsOfUse extends React.Component {
    render() {
      return (
        <div>
          <h1>Terms of Use: <br />
          We use cookies to provide better functioning of the site and we only use them to storage the interaction with the report text box. We do not use or share any information about the cookies. By installing this app you accept the use of these cookies.
          </h1>
        </div>
      );
    }
}

export default TermsOfUse;