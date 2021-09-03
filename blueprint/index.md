---
title: Develop an Angular app that uses the Genesys Cloud Platform SDK
author: prince.merluza
indextype: blueprint
icon: blueprint
image: images/cover.png
category: 6
summary: |
  This Genesys Cloud Developer Blueprint demonstrates how to to include the Genesys Cloud Javascript Platform SDK in an Angular project. The blueprint includes a sample Angular project that uses the Genesys Cloud API for supervisor functionalities like searching and setting the status of users. The blueprint also shows how to configure the SDK for a new or existing Angular project.
---

This Genesys Cloud Developer Blueprint demonstrates how to to include the Genesys Cloud Javascript Platform SDK in an Angular project. The blueprint includes a sample Angular project that uses the Genesys Cloud API for supervisor functionalities like searching and setting the status of users. The blueprint also shows how to configure the SDK for a new or existing Angular project.

:::primary
**Note**: If you have an existing Angular project and only want to know how to configure Genesys Cloud SDK in your app, click [here](#configuring-the-angular-project-to-use-genesys-cloud-sdk "Goes to the Configure the Angular project to use the Genesys Cloud SDK").
:::

***Question***: ![image needed]("Image description")

## Contents

* [Solution components](#solution-components "Goes to the Solutions Components section")
* [Prerequisites](#prerequisites "Goes to the Prerequisites section")
* [Implementation steps](#implementation-steps "Goes to the Implementation steps section")
* [Sample App](#sample-app "Goes to the Sample app section")
* [Configure the Angular Project to use Genesys Cloud SDK](#configure-the-angular-project-to-use-genesys-cloud-sdk "Goes to the Configure the Angular Project to use Genesys Cloud SDK section")
* [Additional resources](#additional-resources "Goes to the Additional resources section")

## Solution components

* **Genesys Cloud** - A suite of Genesys cloud services for enterprise-grade communications, collaboration, and contact center management. The Angular App will be authorized with a Genesys Cloud user.
***QUESTION***: Better/more detailed second sentence?
* **Angular CLI** - A command line tool that facilitates the use of the Angular development framework for building single-page applications. The sample app in this blueprint was built with the Angular 12 CLI.

### Software development kit (SDK)

* **Genesys Cloud Platfrom API SDK** -  Client libraries used to simplify application integration with Genesys Cloud by handling low-level HTTP requests. In this solution, the SDK authorizes the user and performs the API calls required in the execution of the supervisor features.

## Prerequisites

### Specialized knowledge

* Administrator-level knowledge of Genesys Cloud
* Experience using the Genesys Cloud Platform API
* Experience using Angular or the Angular CLI 

### Genesys Cloud account requirements

* A Genesys Cloud license. For more information on licensing, see [Genesys Cloud Pricing](https://www.genesys.com/pricing "Opens the pricing article").
* (Recommended) The Master Admin role in Genesys Cloud. For more information, see [Roles and permissions overview](https://help.mypurecloud.com/?p=24360 "Opens the Roles and permissions overview article") in the Genesys Cloud Resource Center.

## Implementation steps

### Run the sample app

***Question*** I'm confused about the placement/inclusion of this section. Is this optional? What is the primary use case for this blueprint? If running the sample app is optional, could we move it to the end?

***Question***: We don't talk about the need for authorization in any other blueprint. Do we need to include this here?

:::primary
**Note**: You need a Genesys Cloud account for authorization.
:::

Go to the [***QUESTION***: WHAT IS THIS](https://genesyscloudblueprints.github.io/angular-app-with-genesys-cloud-sdk/).

If you're on a different region than `us-east-1` (mypurecloud.com), add an `environment` query parameter to the URL and enter your Genesys Cloud [environment](https://developer.genesys.cloud/api/rest/). For example:

***QUESTION**:DO THEY RUN THIS FROM A COMMAND LINE?***

```bash
https://genesyscloudblueprints.github.io/angular-app-with-genesys-cloud-sdk/?environment=mypurecloud.com.au
```

### Create a Token Implicit Grant (Browser) client in Genesys Cloud

1. To authorize your app with the Genesys Cloud SDK, create an Implicit Grant (Browser) client with the following settings:

* **Authorized redirect URIs (one per line)**:
  * <Your production URI>
  * `http://localhost:4200/` (to test locally)
* **Scope**:
    * analytics
    * authorization
    * presence
    * routing
    * users

For more information, see [Create an OAuth client](https://help.mypurecloud.com/articles/create-an-oauth-client/ Goes to the Create an OAuth client article) in the Genesys Cloud Resource Center.

### Run locally

1. Clone the [blueprint repo](https://github.com/GenesysCloudBlueprints/angular-app-with-genesys-cloud-sdk "Goes to the blueprint repo in Github") to your local machine:

```bash
git clone https://github.com/GenesysCloudBlueprints/angular-app-with-genesys-cloud-sdk.git
```

2. Go to the Angular project directory.

```bash
cd genesys-cloud-sample
```

3. Modify the client ID and redirect URI values in the environment files.
  i. Go to src>environments.
  ii. Modify the production `environment.prod.ts` file:

    ```typescript
    export const environment = {
      production: true,
      GENESYS_CLOUD_CLIENT_ID: '<YOUR CLIENT ID HERE>',
      REDIRECT_URI: '<YOUR PRODUCTION URI HERE>',
    };
    ```
    ii. Modify the test `environment.ts:` file:

    ```typescript
    export const environment = {
      production: false,
      GENESYS_CLOUD_CLIENT_ID: '<YOUR CLIENT ID HERE>',
      REDIRECT_URI: 'http://localhost:4200',
    };
    ```
### Install the Angular CLI

Install the CLI

```bash
npm install -g @angular/cli
```

### Serve the Angular app locally

```bash
ng serve
```

## About the sample app  

This blueprint includes a sample app that contains a service and several pages.

### Genesys Cloud service

The `genesys-cloud` service contains all Genesys Cloud-related functionality. All of the API methods return a promise, but if we want to work with Observables instead, we can easily convert the promises by using the `from` operator.

Example:

```typescript
  getUserDetails(id: string): Observable<platformClient.Models.User> {
    return from(this.usersApi.getUser(id, {
        expand: ['routingStatus', 'presence'],
      }));
  }
```

### App pages

* The **User** page is the app's home page. It displays information about the sample app and details about the current user. It also contains a presence-picker component, which allows a user to change their presence or routing status.
* The **User Search** page allows you to search for users within your org. You can then change a user's presence or go to their User page.
* The **Queues List** page allows you to see Observation Query details of each queue. Here you can also log out all of the agents on a particular queue, which is helpful if agents cannot log out of their stations after their shift is over.

## Configure the Angular project to use Genesys Cloud SDK

One of the most frequently asked questions regarding Angular is how to include the Genesys Cloud SDK in the build process. In this section, we'll look at the step-by-step process of configuring an Angular project and provide other helpful advice in working with the Genesys Cloud environment.

If you've jumped to this section, we assume you have completed all the prerequisites, including [installing Angular CLI](#install-the-angular-cli Goes to the Install the Angular CLI section), and obtaining Genesys Cloud credentials for authorization.

***Question*** Does this mean Create an Oauth client?

### Create an Angular project

1. Create a new Angular 12 project:

```bash
ng new name-of-your-app
```
:::primary
**Tip**: Instead of creating a new Angular project, you can use an existing one. However, these instructions assume you're using Angular 12. If you use an earlier version of Angular, you may need to adapt these instructions.
:::

### Install NPM packages

1. Install the Genesys Cloud platform client:

    ```bash
    npm install purecloud-platform-client-v2
    ```

2. Install the custom-webpack library:

    ```bash
    npm i @angular-builders/custom-webpack --save-dev
    ```

### Configure the files for platform client usage

1. In the root of your project, create a file with a meaningful name. For example, `extra-webpack.config.js`

2. Add the following content to the file:

    ```javascript
    module.exports = {
      externals: {
        'purecloud-platform-client-v2': "require('platformClient')",
      },
    }
    ```

2. In the root of the project, open the `angular.json` file and find the `architect` property. Then modify the builder targets, which are found under the `build` property:

    i. Change the builder property to: `@angular-builders/custom-webpack:browser`
    ii. Under the options property, add a new `customWebpackConfig` object. Refer to the following code block for details.
    iii. In the `scripts` property add `node_modules/purecloud-platform-client-v2/dist/web-cjs/purecloud-platform-client-v2.min.js`

    Modified `build` property:

     ```json
      "build": {
        "builder": "@angular-builders/custom-webpack:browser",
        "options": {
          ...,
          "customWebpackConfig": {
            "path": "./extra-webpack.config.js",
            "mergeRules": { "externals": "prepend" }
          },
          "scripts": [..., "node_modules/purecloud-platform-client-v2/dist/web-cjs/purecloud-platform-client-v2.min.js"]
        }
      }

    ```

    2. Modify the `serve` target:

        ```json
        "serve": {
          "builder": "@angular-builders/custom-webpack:dev-server",
          ...
        }
        ```
        :::primary
        **Tip**: The `serve` property uses the `options` configuration from `build`, so you don't need to change anything else here.
        :::


    3. Modify the `test` property:

        i.  If you're using Karma for Angular testing, change the builder property to: `@angular-builders/custom-webpack:karma`.
        ii. Under the `options` property, add a new `customWebpackConfig` object. Refer to the following code block for details.
        iii. In the `scripts` property add `node_modules/purecloud-platform-client-v2/dist/web-cjs/purecloud-platform-client-v2.min.js`

        The modified `build` property should look something like this:

         ```json
          "build": {
            "builder": "@angular-builders/custom-webpack:karma",
            "options": {
              ...,
              "customWebpackConfig": {
                "path": "./extra-webpack.config.js",
                "mergeRules": { "externals": "prepend" }
              },
              "scripts": [..., "node_modules/purecloud-platform-client-v2/dist/web-cjs/purecloud-platform-client-v2.min.js"]
            }
          }

        ```

3. Finally, in your `tsconfig.json`, we need to disable `noImplicitAny` in the `compilerOptions`:

    ```json
    {
      ...
      "compilerOptions": {
        ...
        "noImplicitAny": false,
      },
    }
    ```

    If we don't add this property, some files in the Platform SDK package will cause the Angular build to fail.

### Import the platform-client-sdk to your project

After following the step-by-step instructions, you should now be able to import and use the Platform Client in your code.

Example:

```javascript
import { Component, OnInit } from '@angular/core';
import * as platformClient from 'purecloud-platform-client-v2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sample-app';
  ngOnInit() {
    console.log(platformClient);
  }
}
```

## Additional resources

* [Genesys Cloud Platform SDK - Javascript](https://developer.genesys.cloud/api/rest/client-libraries/javascript/)
* [Angular Builders - Custom Webpack](https://www.npmjs.com/package/@angular-builders/custom-webpack)
* [Github Repository](https://github.com/GenesysCloudBlueprints/angular-app-with-genesys-cloud-sdk)
* [Yuri's Angular App](https://genesyscloudblueprints.github.io/angular-app-with-genesys-cloud-sdk)
