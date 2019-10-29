/*
 * Copyright (c) 2019 Software AG, Darmstadt, Germany and/or its licensors
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const oauthInfos = require("./common/oauth_infos.json");
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// remove this setting when using in production with real signed certificates
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// with custom authentication, the values of input.auth set in the validate function will be propagated when actions/lookups are used
module.exports = {
  label: "Connect to SampleConnector",
  // from v1.1.3 on, the input for the authentication test is taken from auth.conf
  mock_input: {
    clientId: "dummy-client-id",
    clientSecret: "dummy-client-secret"
  },
  // these input properties will be moved into input.auth
  input: {
    type: "object",
    properties: {
      clientId: {
        title: "Client_ID",
        displayTitle: "Client ID",
        description: "Custom Client ID",
        type: "string",
        minLength: 1,
        propertyOrder: 1
      },
      clientSecret: {
        title: "Client_Secret",
        displayTitle: "Client Secret",
        description: "Custom Client Secret",
        type: "string",
        format: "password",
        minLength: 1,
        propertyOrder: 2
      },
      clientNumber: {
        title: "Client_Number",
        displayTitle: "Client Number",
        description: "Custom Client Number",
        type: "number",
        minLength: 1,
        propertyOrder: 3
      },
    }
  },
  /**
   * This validation will be performed everytime a connector is added to a flow and a new validation is added.
   * In this sample, the validation goes to a dummy custom nodejs server that will deliver some token.
   * 
   * @param {clientId,clientSecret,clientNumber} input 
   * @param {*} output 
   */
  validate: function (input, output) {
    console.log("+-+- VALIDATE AUTH ", [input, oauthInfos, this.mock_input]);
    // init dummy auth token
    input.auth["auth_token"] = "a-token";
    const rpn = require("request-promise-native");
    // these are the values needed by the fake server used in this sample
    const myBody = {
      grant_type: "authorization_code",
      client_id: input.auth.clientId,
      client_secret: input.auth.clientSecret,
      redirect_uri: oauthInfos.redirectURL,
      code: "dummy" + input.clientNumber
    };
    var options = {
      method: "POST",
      url: oauthInfos.tokenURL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      json: myBody
    }


    try {
      rpn(options)
        .then(function (resp) {
          console.log('User has RESP', resp);
          input.auth["auth_token"] = resp.token;
          output(null, true);
        })
        .catch(function (err) {
          console.log('+-+---- ERROR ', err);
          // API call failed...
        });
      // DEFAULT-REQUEST --------------------------------------------------------------------------------------------------------
      // var options = {
      //   method: 'POST',
      //   uri: '<YOUR_SERVER_EXAMPLE_URI>',
      //   body: myBody,
      //   headers: {
      //     'User-Agent': 'Request-Promise',
      //   },
      //   // qs: {
      //   //   access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
      //   // },
      //   // resolveWithFullResponse: true,
      //   json: true // Automatically parses the JSON string in the response
      // };
      // const request = require("request");
      // request(options, function (err, res, body) {
      //   if (err) {
      //     console.log("+-+- error while getting options...")
      //     return output(err);
      //   }
      //   if (res.statusCode == 200) {
      //     // set the auth_token or any other auth info to be used in the next actions/lookups
      //     input.auth.auth_token = res.body.token;
      //     output(null,true);
      //   } else {
      //     output(res.statusMessage != null ? res.statusMessage : 'Unexpected problem', 'Unexpected result');
      //   }
      // });


      // SYNC-REQUEST --------------------------------------------------------------------------------------------------------
      // using a sync request to wait for the values to be retrieved from the service prior to setting them in the auth object
      // const sync_request = require("sync-request");
      // var res = sync_request(options.method, options.url, options);
      // if (res && res.statusCode == 200) {
      //   // the local test server sends a plain text msg with the needed token
      //   const body = res.getBody('utf-8');
      //     console.log("+-+- auth token received ", body);
      //     // set the auth_token or any other auth info to be used in the next actions/lookups
      //     input.auth.auth_token = body;
      // } else {
      //   output(res.statusMessage != null ? res.statusMessage : 'Unexpected problem', 'Unexpected result');
      // }
      // ---------------------------------------------------------------------------------------------------------------------
    } catch (error) {
      console.error(error);
    }
  }
}