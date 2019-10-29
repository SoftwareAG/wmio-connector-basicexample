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


const oauthInfos = require("../../common/oauth_infos.json");
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// remove this setting when using in production with real signed certificates
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
module.exports = {

  name: "samplepollingtrigger",

  label: "Sample Polling Trigger",

  version: "v1",

  input: {
    type: "object",
    title: "Sample Polling Trigger",
    description: "Trigger description",
    properties: {
      event: {
        type: "string",
        enum: ["samplepollingtrigger"],
        isExecute: true
      },
      polling: {
        type: "boolean",
        default: true,
        options: {
          hidden: true
        }
      }
    }
  },

  output: {
    samplepollingtrigger: {
      type: "object",
      properties: {
        things: {
          type: "array",
          title: "The objects found",
          items: {
            type: "object",
            title: "Sample Polled Object",
            properties: {
              some_name: {
                type: "string",
                title: "Some Name",
                description: "Name of something"
              },
              some_ts: {
                type: "string",
                title: "Timestamp",
                description: "Timestamp"
              },
            }
          }
        }
      }
    }
  },

  mock_data: {
    things: [{
      some_name: 'Albert',
      some_ts: 1571661196
    }, {
      some_name: 'Frank',
      some_ts: 1571662196
    }]
  }, // output of trigger data

  mock_input: {
    some_in: "no",
    some_ts: 123,
    auth: {
      auth_token: "dummy-token"
    }
  },

  getUserData: function (input, options, output) {
    // will be called when testing trigger before it is created
    // return the actual data from your service which will be used for
    // creating output schema and it should be flat output json
    var msg = {
      'INPUT': input,
      'OPTIONS': options,
      'OUTPUT': output
    };
    console.log("+-+-+-+-+- GET USER DATA +-+-+-+-+- ", '\n', msg);
    // return output(null, this.mock_data);
    output(null, this.mock_data);
  },

  execute: function (input, options, output) {
    // will be called every 5 minutes
    // to access auth info use input.auth , eg: input.auth.username
    // and to return output use output callback like this output(null, [{ mykey : "key", value : "My Val"}])
    // output should be an array of objects or an empty array.
    var msg = {
      'INPUT': input,
      'OPTIONS': options,
      'OUTPUT': output
    };
    console.log("+-+-+-+-+- EXECUTE +-+-+-+-+- ", '\n', msg);

    const rpn = require("request-promise-native");
    var rpnOpts = {
      method: "GET",
      url: '<YOUR_SERVER_EXAMPLE_URI>',
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + input.auth.auth_token
      },
      json: true,
      // "auth": {
      //   "user": "javi",
      //   "pass": "manage",
      //   "sendImmediately": true
      // },
    }
    rpn(rpnOpts)
      .then(function (resp) {
        if (resp && resp.length > 0) {
          var thethings = resp.map(function (val, idx) {
            const sep = "-";
            var tokenIdx = val.token.indexOf(sep) != -1 ? val.token.indexOf(sep) : val.length - 1;
            return {
              'some_name': val.token.substring(0, tokenIdx),
              'some_ts': 1571661196
            };
          });
          console.log('+-+-+-+-+- RESPONSE TTHINGS +-+-+-+-+-', [resp, thethings]);
          output(null, {
            things: thethings
          });
        } else {
          output(null, null);
        }
      })
      .catch(function (err) {
        console.log('+-+---- ERROR ', err);
        // API call failed...
        output(err)
      });
  },

  activate: function (input, options, output) {
    // this function will be called whenever user activate or reactivates flow
    // to access auth info use input.auth , eg: input.auth.username
    // you can use this function to reset your cursor or timestamp
    var msg = {
      'INPUT': input,
      'OPTIONS': options,
      'OUTPUT': output
    };
    console.log("+-+-+-+-+- ACTIVATE +-+-+-+-+- ", '\n', msg);

    const rpn = require("request-promise-native");
    // these are the values needed by the fake oauth2 server used in this sample
    const myBody = {
      grant_type: "authorization_code",
      client_id: input.auth.clientId,
      client_secret: input.auth.clientSecret,
      redirect_uri: oauthInfos.redirectURL,
      code: "activate-" + new Date().toLocaleTimeString()
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
    } catch (error) {
      console.error(error);
    }
  },

  validate: function (input, options, output) {
    // will be called when trigger is created 1st time
    // to access auth info use input.auth , eg: input.auth.username
    // to successfully validate auth info and other parameter provided by user call output(null, true)
    // in case auth or other info is invalid, prevent creating trigger by sending error output("Username or password is invalid")
    var msg = {
      'INPUT': input,
      'OPTIONS': options,
      'OUTPUT': output
    };
    console.log("+-+-+-+-+- VALIDATE +-+-+-+-+- ", '\n', msg);

    const rpn = require("request-promise-native");
    // these are the values needed by the fake oauth2 server used in this sample
    const myBody = {
      grant_type: "authorization_code",
      client_id: input.auth.clientId,
      client_secret: input.auth.clientSecret,
      redirect_uri: oauthInfos.redirectURL,
      code: "validate-" + new Date().toLocaleTimeString()
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
    } catch (error) {
      console.error(error);
      output(error);
    }

    output(null, true);
  }
}