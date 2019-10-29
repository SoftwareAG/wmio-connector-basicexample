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

module.exports = {

  name: "advancedecho",

  title: "Advancedecho",

  description: "This function shows how input parameters can be generated depending on another input and how they can be dynamically generated using lookups",
  version: "v1",

  // The firstInput property is a simple enum with two values.
  // The secondInput property depends from the value selected in the firstInput, and configured using a lookup ("getdynamicoptions"). This dependency is defined in the "index.json" file.
  input: {
    title: "Advanced Echo",
    type: "object",
    properties: {
      firstInput: {
        title: "Simple Dropdown",
        displayTitle: "Simple Dropdown",
        description: "Simple Dropdown",
        type: "string",
        minLength: 1,
        propertyOrder: 1,
        enum: [
          "Simple",
          "Double"
        ]
      },
      secondInput: {
        title: "Second Input",
        // displayTitle: "Another Entry",
        description: "Different options from the lookup will be retrieved depending on the first input",
        type: "string",
        minLength: 0,
        propertyOrder: 2
      },
    }
  },
  // using this property we can generate input properties dynamically, depending on the value selected for another fields
  // the input values are generated in the lookup "getadditionalinput" and it depends on "secondInput"
  form: {
    id: "getadditionalinput",
    dependencies: ["secondInput"]
  },

  output: {
    title: "output",
    type: "object",
    properties: {
      theEcho: {
        title: "The Advanced Echo",
        displayTitle: "Advanced Echo",
        description: "Echo produced based on the input...",
        type: "string"
      }
    }
  },

  // The mock_input will be used as input for local testing.
  // When testing locally, the dependencies on lookups will not be used.
  mock_input: {
    isTest: true,
    firstInput: "Simple",
    secondInput: "Simple_Echo_1",
    __dynamicInput__: {
      echoYear: 2019,
      somelongecho: "holaaaaaa"
    }
  },

  execute: function (input, output) {
    // to access auth info use input.auth , eg: input.auth.username
    // and to return output use output callback like this output(null, { 'notice' : 'successful'})
    // your code here
    var theResult = {
      theEcho: "UNKNOWN"
    };
    if (input && input.secondInput) {
      if (input.secondInput.toLowerCase().startsWith('simple')) {
        if (input.__dynamicInput__) {
          theResult = {
            theEcho: (input.__dynamicInput__.somelongecho ? input.__dynamicInput__.somelongecho : 'no long echo') +
            " " + (input.__dynamicInput__.echoYear ? input.__dynamicInput__.echoYear : 'no echo year') + "!!"
          };
        } else {
          theResult = {
            theEcho: 'No simple dynamic input :('
          };
        }
      } else {
        // the advanced option should have been selected...
        if (input.__dynamicInput__) {
          theResult = {
            theEcho: (input.__dynamicInput__.firstName ? input.__dynamicInput__.firstName : 'no first name') +
              " " + (input.__dynamicInput__.surname ? input.__dynamicInput__.surname : 'no surname') + "!!"
          };
        } else {
          theResult = {
            theEcho: 'No advanced dynamic input :('
          };
        }
      }
    }
    output(null, theResult);
  }

}