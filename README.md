# Echo Custom Connector

[webMethods.io Integration](https://webmethods.io) is a powerful integration platform as a service (iPaaS) that provides a combination of capabilities offered by ESBs, data integration systems, API management tools, and B2B gateways.

This is an example of a custom connector for [webMethods.io Integration](https://webmethods.io) showing some of the basic features that can be used in it.

You can create custom web connectors for [webMethods.io Integration](https://webmethods.io) using the Connector Builder. The Connector Builder app is a custom Node.js application that you build using a web application’s APIs. So, for example, if you have a private API or an API that is not in webMethods.io Integration yet, you can create custom webMethods.io Integration actions and triggers for those APIs. Once you have created these custom actions and triggers, you can use them like any other action on webMethods.io integration platform.

Follow the link to find further details about the [Connector Builder](https://docs.webmethods.io/integration/developer_guide/connector_builder/#gsc.tab=0)

***

## Trigger

A trigger is a powerful tool that automatically launches a workflow when a defined event happens. This enables you to automate complex business process without having to manually run the workflow every time. You can find detailed information about how triggers work under <https://docs.webmethods.io/integration/developer_guide/connector_builder/#triggers>

In this example, you will find a polling trigger. It will run the _"execute"_ method every five minutes.

***

## Actions

Actions define the tasks to be performed by the connector inside an integration flow. In this connector you can find two actions:

### echo

In the "echo" action, you can see the available data types that can be used as input for an action and how to generate the options for an input field based on the results of a service call (by using lookups).

### advancedecho

In the "advancedecho" action, you can see how to make input options dependent from another input fields using lookups.

***

### Lookups

Lookup helps you autofill input fields with data coming from your account or other remote resources. You will find three lookups in this example:

#### getsampleoptions

This lookup produces an static result, as it can be seen below, which will generate a dropdown field with two values. The _"value"_ property is used as label by the dropdown, while the _"id"_ is passed as the value into the property.

`[{"id": "true","value": "True"},{"id": "false","value": "False"}]`

#### getdynamicoptions

It shows how the output of the lookup can be made dependent from another input parameter that comes from the action where the lookup is used. This dependency is configured automatically when the lookup is attached to the action using the CLI (for it, follow the instruction provided in the command line).

```command
$ wmio create lookup samplelookup
? Does your lookup have searchable feature No
[mytenant:myname] lookup samplelookup created successfully

$ wmio attach lookup
? Select the lookup you want to attach samplelookup
? Do you want to setup lookup for an action field Yes
? Do you want to setup lookup for an trigger field No
? Select the action you want to enable lookup for /v1/advancedecho
? Select the field you want to attach the lookup to secondInput
? Lookup needs dependencies of other input fields Yes
? Select dependency fields firstInput
[mytenant:myname] Lookup attached to field secondInput of /v1/advancedecho
```

##### getadditionalinput

A lookup can be used as well to generate input parameters at runtime. For this, the lookup will not be attached to an action via the CLI. Instead, it will be manually configured inside the action as a _'form'_ like:

```json
input: {...}
form: {
    id: "getadditionalinput",
    dependencies: ["secondInput"]
 },
 output: {...}
```

The _'secondInput'_ field of the action will be passed as well to the lookup every time its value changes.

***

### Custom Authentication

Most of the action/triggers need some sort of authentication from users to function. [webMethods.io Integration](https://webmethods.io) provides some methods to help add authentication for your them. There are some OOTB methods provided by the platform (Basic, OAuth...), but you can also create your own one, as it is shown here.

## Getting started

Once you have read the information about the [Connector Builder](https://docs.webmethods.io/integration/developer_guide/connector_builder/#gsc.tab=0), and installed all prerequisites, you should be able to test and deploy the example into your [webMethods.io](http://webMethods.io) instance.

You need to use the folder "src" as the root folder for using the **webMethods** **.io** Command Line Interface.

```command
cd src
wmio test
...
wmio deploy
```

I hope that you find this connector helpful and that it simplifies your first steps creating your own custom connectors.

***

These tools are provided as-is and without warranty or support. They do not constitute part of the Software AG product suite. Users are free to use, fork and modify them, subject to the license agreement. While Software AG welcomes contributions, we cannot guarantee to include every contribution in the master project.

Contact us at [TECHcommunity](mailto:technologycommunity@softwareag.com?subject=Github/SoftwareAG) if you have any questions.
