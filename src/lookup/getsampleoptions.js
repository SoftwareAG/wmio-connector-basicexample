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

// Add your function in module.exports
const rpn = require("request-promise-native");
module.exports = {

	name: "getsampleoptions",

	label: "Get Sample Options",
	// add input data lookup will depend on for
	// eg: if auth is oauth so add access_token inside auth object
	// you can also add other input properties which are mentioned in action/trigger
	mock_input: {
		auth: {}
	},
	search: false,
	execute: function (input, options, output) {
		// Making a dummy call to an available service... the rest call response has nothing to do with 
		// the output that will be set... the output will be available if the service call is fine
		const rpnOpts = {
			method: "GET",
			url: "http://petstore.swagger.io/v2/pet/findByStatus?status=sold",
			headers: {
				"Accept": "application/json"
			},
			json: true
		}

		rpn(rpnOpts)
			.then(function (resp) {
				// the response of the service call will be ignored and a fixed one will be used instead.
				output(null, [{
						"id": "true",
						"value": "True"
					},
					{
						"id": "false",
						"value": "False"
					}
				]);
			})
			.catch(function (err) {
				console.log('+-+---- ERROR ', err);
				// API call failed...
				output(err)
			});

		// DO NOT add another output callback after the request has been done... otherwise, these values would be used
		// and the ones from the request then/catch would be ignored
	}

}