---
title: Develop an Angular app that uses the Genesys Cloud Platform SDK
author: prince.merluza
indextype: blueprint
icon: blueprint
image: images/cover.png
category: 6
summary: |
  This Genesys Cloud Developer Blueprint shows how to integrate the Genesys Cloud JavaScript Platform SDK into a modern Angular application. The blueprint includes a sample Angular app that uses PKCE authentication and the Genesys Cloud APIs for user search, presence updates, and queue-based supervisor workflows. It also explains how to configure the SDK in a new or existing Angular project.
---
::{"alert":"primary","title":"About Genesys Cloud Blueprints","autoCollapse":false}
Genesys Cloud blueprints help you jump-start building an application or integrating with a third-party partner.
Blueprints outline how to build and deploy a solution, but they are not production-ready turnkey implementations.

For more details on blueprint support and practices, see the Genesys Cloud blueprint [FAQ](https://developer.genesys.cloud/blueprints/faq).
::::

This blueprint demonstrates how to integrate the Genesys Cloud JavaScript Platform SDK into an Angular application and how to structure that integration in a way that works with current Angular builds. The included sample app uses PKCE authentication and calls the Genesys Cloud APIs for user search, presence updates, and queue-based supervisor actions.

![Flowchart](images/gcsdk_angular.png "Develop an Angular app that uses the Genesys Cloud Platform SDK")

:::primary
**Note**: If you already have an Angular project and only need the SDK setup details, jump to [Configure an Angular project to use the Genesys Cloud SDK](#configure-an-angular-project-to-use-the-genesys-cloud-sdk).
:::

## Contents

* [Solution components](#solution-components "Goes to the Solution components section")
* [Prerequisites](#prerequisites "Goes to the Prerequisites section")
* [Sample Angular app](#sample-angular-app "Goes to the Sample Angular app section")
* [Configure an Angular project to use the Genesys Cloud SDK](#configure-an-angular-project-to-use-the-genesys-cloud-sdk "Goes to the SDK configuration section")
* [Additional resources](#additional-resources "Goes to the Additional resources section")

## Solution components

* **Genesys Cloud** - A suite of cloud services for enterprise communications, collaboration, and contact center management. In this solution, a Genesys Cloud user account authorizes the Angular app and provides the API data used by the sample experience.
* **Angular CLI and Angular build tooling** - Angular CLI provides the development and build workflow for the application. The sample app in this repository currently uses Angular 21 and the Angular application builder.

### Software development kit (SDK)

* **Genesys Cloud Platform API SDK** - Client libraries that simplify integration with Genesys Cloud by handling authentication and low-level HTTP requests. In this solution, the SDK authorizes the user and performs the API calls required for the sample's user, presence, and queue workflows.

## Prerequisites

### Specialized knowledge

* Administrator-level knowledge of Genesys Cloud
* Familiarity with the Genesys Cloud Platform API
* Experience with Angular, TypeScript, and npm-based application development
* Basic understanding of OAuth redirect URIs and browser-based authentication flows

### Genesys Cloud account requirements

* A Genesys Cloud license. For more information on licensing, see [Genesys Cloud Pricing](https://www.genesys.com/pricing "Goes to the pricing page").
* Permission to create or update an OAuth client in Genesys Cloud. For local development, include `http://localhost:4200` as an authorized redirect URI.
* The scopes required by your app. The sample app uses `analytics`, `authorization`, `presence`, `routing`, and `users`.

### Local development requirements

* A supported Node.js and npm installation
* An Angular workspace, either new or existing

## Sample Angular app

:::primary
**Note**: If you have an existing Angular project and only want to know how to configure the Genesys Cloud SDK in your app, see [Configure an Angular project to use the Genesys Cloud SDK](#configure-an-angular-project-to-use-the-genesys-cloud-sdk "Goes to the SDK configuration section").
:::

This solution includes a sample Angular app that authenticates with PKCE and uses the Genesys Cloud JavaScript Platform SDK to display and update data for Genesys Cloud users.

![Sample App screenshot](images/sampleapp.png "The main page of the sample app")

From the sample Angular app, you can authenticate against Genesys Cloud and work with live platform data in real time. Specifically:

* The **Home** page displays the authenticated user's details and lets the user update presence.
* The **User Search** page lets you search for users in your Genesys Cloud organization and open each user's details.
* The **Queues List** page displays queue observation data and provides a bulk logout action for agents in a queue.

### Genesys Cloud service

The sample Angular app includes a `genesys-cloud` service that wraps the Genesys Cloud SDK. The service initializes the API client, performs PKCE login, and converts SDK promises into RxJS observables so the Angular components can consume them naturally.

For example:

```typescript
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthData, Models } from 'purecloud-platform-client-v2';

declare var platformClient: typeof import('purecloud-platform-client-v2');

@Injectable({
  providedIn: 'root'
})
export class GenesysCloudService {
  private client = platformClient.ApiClient.instance;
  private usersApi = new platformClient.UsersApi();

  initialize(): Observable<AuthData> {
    this.client.setPersistSettings(true);
    this.client.setEnvironment('mypurecloud.com');

    return from(
      this.client.loginPKCEGrant(
        environment.GENESYS_CLOUD_CLIENT_ID,
        environment.REDIRECT_URI
      )
    );
  }

  getUserDetails(id: string): Observable<Models.User> {
    return from(this.usersApi.getUser(id, {
      expand: ['routingStatus', 'presence'],
    }));
  }
}
```

### Run the sample Angular app hosted in GitHub Pages

You can run the sample Angular app locally or from the blueprint repository.

:::primary
**Note**: Regardless of where you run the sample Angular app, you need a Genesys Cloud user account for it to work.
:::

To run the sample Angular app from the blueprint repository:

1. Open the hosted [sample Angular app](https://genesyscloudblueprints.github.io/angular-app-with-genesys-cloud-sdk/ "Goes to the sample Angular app").
2. If you are on a different region than `us-east-1` (`mypurecloud.com`), add an `environment` query parameter to the URL and enter your Genesys Cloud environment.

For example:

```bash
https://genesyscloudblueprints.github.io/angular-app-with-genesys-cloud-sdk/?environment=mypurecloud.com.au
```

For more information, see [Platform API](/api/rest/ "Goes to the Platform API page in the Genesys Cloud Developer Center").

### Run the sample Angular app locally

1. Clone the [blueprint repository](https://github.com/GenesysCloudBlueprints/angular-app-with-genesys-cloud-sdk "Goes to the blueprint repository in GitHub") to your local machine.

   ```bash
   git clone https://github.com/GenesysCloudBlueprints/angular-app-with-genesys-cloud-sdk.git
   ```

2. Change to the `genesys-cloud-sample` project directory.

   ```bash
   cd genesys-cloud-sample
   ```

3. Install the project dependencies.

   ```bash
   npm install
   ```

4. Update the client ID and redirect URI values in the environment files under `src/environments`.

   Modify `environment.prod.ts`:

   ```typescript
   export const environment = {
     production: true,
     GENESYS_CLOUD_CLIENT_ID: '<YOUR CLIENT ID HERE>',
     REDIRECT_URI: 'https://your-production-url.example.com'
   };
   ```

   Modify `environment.ts`:

   ```typescript
   export const environment = {
     production: false,
     GENESYS_CLOUD_CLIENT_ID: '<YOUR CLIENT ID HERE>',
     REDIRECT_URI: 'http://localhost:4200'
   };
   ```

5. Start the Angular development server.

   ```bash
   npm start
   ```

## Configure an Angular project to use the Genesys Cloud SDK

Follow these instructions to include the Genesys Cloud JavaScript Platform SDK in your own Angular project using a modern Angular workspace. This approach relies on Angular's built-in build configuration and does not require a custom webpack builder.

### Create a PKCE-enabled OAuth client in Genesys Cloud

1. Create or update an OAuth client for browser-based Authorization Code with PKCE.
2. Add your authorized redirect URIs:
   * Your production URL
   * `http://localhost:4200` for local development
3. Add the scopes your app needs. The sample app uses:
   * `analytics`
   * `authorization`
   * `presence`
   * `routing`
   * `users`

For more information, see [Create an OAuth client](https://help.genesys.cloud/articles/create-an-oauth-client/ "Goes to the Create an OAuth client article") and [Authorization Code with PKCE](https://developer.genesys.cloud/api/rest/authorization/use-authorization-code "Goes to the Authorization Code with PKCE documentation").

### Create or open your Angular project

1. If you need a new project, create one with the current Angular CLI:

   ```bash
   npx @angular/cli@latest new name-of-your-app
   ```

2. Change to the project directory:

   ```bash
   cd name-of-your-app
   ```

### Install the Genesys Cloud SDK

Install the Genesys Cloud platform client package:

```bash
npm install purecloud-platform-client-v2
```

### Register the SDK scripts in `angular.json`

In your workspace `angular.json` file, add the Genesys Cloud SDK bundle and a small bridge file to the `build.options.scripts` array. In a current Angular workspace, the relevant section looks similar to the following:

```json
"build": {
  "builder": "@angular/build:application",
  "options": {
    "browser": "src/main.ts",
    "scripts": [
      "node_modules/purecloud-platform-client-v2/dist/web-cjs/purecloud-platform-client-v2.min.js",
      "src/require-platform-client.js"
    ]
  }
}
```

This keeps the SDK loading compatible with the Angular application builder without introducing a custom webpack configuration.

### Add the `require-platform-client.js` bridge

Create `src/require-platform-client.js` with the following content:

```javascript
const platformClient = require('platformClient');
```

This lightweight bridge ensures the SDK's global client is available at runtime while keeping the Angular configuration simple.

### Configure environment values

Store your Genesys Cloud OAuth settings in the Angular environment files. For example:

```typescript
export const environment = {
  production: false,
  GENESYS_CLOUD_CLIENT_ID: '<YOUR CLIENT ID HERE>',
  REDIRECT_URI: 'http://localhost:4200'
};
```

Use the production environment file to set your deployed redirect URI.

### Authorize and call the SDK from an Angular service

Create an Angular service that initializes the SDK client, sets the Genesys Cloud environment, and starts the PKCE flow.

```typescript
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthData, Models } from 'purecloud-platform-client-v2';

declare var platformClient: typeof import('purecloud-platform-client-v2');

@Injectable({
  providedIn: 'root'
})
export class GenesysCloudService {
  private client = platformClient.ApiClient.instance;
  private usersApi = new platformClient.UsersApi();

  initialize(): Observable<AuthData> {
    this.client.setPersistSettings(true);
    this.client.setEnvironment('mypurecloud.com');

    return from(
      this.client.loginPKCEGrant(
        environment.GENESYS_CLOUD_CLIENT_ID,
        environment.REDIRECT_URI
      )
    );
  }

  getUserDetails(id: string): Observable<Models.User> {
    return from(this.usersApi.getUser(id, {
      expand: ['routingStatus', 'presence'],
    }));
  }
}
```

Once the client is initialized, you can create API instances such as `UsersApi`, `PresenceApi`, or `RoutingApi` and call the methods your Angular components need.

## Additional resources

* [Genesys Cloud Platform SDK - JavaScript](/api/rest/client-libraries/javascript/ "Goes to the Platform API JavaScript client page")
* [Authorization Code with PKCE](https://developer.genesys.cloud/api/rest/authorization/use-authorization-code "Goes to the Authorization Code with PKCE documentation")
* [Create an OAuth client](https://help.genesys.cloud/articles/create-an-oauth-client/ "Goes to the Create an OAuth client article")
* [angular-app-with-genesys-cloud-sdk repository](https://github.com/GenesysCloudBlueprints/angular-app-with-genesys-cloud-sdk "Goes to the angular-app-with-genesys-cloud-sdk repository") in GitHub
* [Sample Angular app](https://genesyscloudblueprints.github.io/angular-app-with-genesys-cloud-sdk/ "Goes to the sample Angular app")
