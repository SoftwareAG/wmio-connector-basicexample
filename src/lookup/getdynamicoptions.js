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

// The result of this lookup depends on what the user selects in the "firstInput" parameter
module.exports = {

	name: "getdynamicoptions",

	label: "Get Dynamic Options",
	
	mock_input: {
		firstInput: "Simple",
		auth: {}
	},
	search: false,
	execute: function (input, options, output) {
		console.log("+-+- dynamic options... ", input);
		if (input && input.firstInput && input.firstInput.localeCompare("Simple") == 0) {
			output(null, [{
					id: "Simple_Echo_1",
					value: "Simple Echo One"
				},
				{
					id: "Simple_Echo_2",
					value: "Simple Echo Two"
				}
			]);
		} else {
			output(null, [{
					id: "Advanced_Echo_1",
					value: "Advanced Echo One"
				},
				{
					id: "Advanced_Echo_2",
					value: "Advanced Echo Two"
				}
			]);
		}
	}

}