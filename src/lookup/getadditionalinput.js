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

// a lookup can be used as well to generate dynamic input fields for an action
// the fields generated will depend on the selected "secondInput" in the action "advancedecho"

module.exports = {

	name: "getadditionalinput",

	label: "Getadditionalinput",
	mock_input: {
		secondInput: "Advanced_Echo_1",
		auth: {}
	},
	search: false,
	execute: function (input, options, output) {
		console.log("+-+- ADDITIONAL INPUT - ", input);
		var data = {
			schema: {
				type: "object",
				title: "Dynamic Fields",
				properties: {}
			}
		};
		if (input.secondInput && input.secondInput.localeCompare("Advanced_Echo_1") == 0) {
			data.schema.properties["firstName"] = {
				id: "firstName",
				type: "string",
				title: "Name",
			};
			data.schema.properties["surname"] = {
				id: "surname",
				type: "string",
				title: "Surname",
			};
			var extraField = {
				type: "string",
				title: "Email",
				id: "emilio"
			};
			data.schema.properties["E-mail"] = extraField;
		} else {
			data.schema.title = "Other Dynamic Fields";
			data.schema.properties["echoYear"] = {
				id: "echoYear",
				type: "number",
				title: "Echo Year",
				displayTitle: "Echo Year",
				propertyOrder: 2,

			};
			data.schema.properties["somelongecho"] = {
				id: "somelongecho",
				type: "string",
				title: "Long Echo",
				displayTitle: "Long Echo",
			};
		}
		output(null, {
			results: data
		});
	}

}