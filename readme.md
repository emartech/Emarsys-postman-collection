# Emarsys API Developer tooling
**Available in Postman and Bruno formats**
**Written in the Postman format and tested with Bruno**

This document describes the Emarsys Suite API v3, which uses OpenID Connect (OAuth 2.0 client credentials grant) authentication. 

- Other API collections, including the Emarsys suite WSSE APIs: [link](./wsse_APIs/)
- Introduction to Emarsys API: [link](https://help.sap.com/docs/SAP_EMARSYS/5d44574160f44536b0130abf58cb87cc/fdf6023c74c11014b724bbfdb6028c98.html?locale=en-US)
- Setting up API credentials: [link](https://help.sap.com/docs/SAP_EMARSYS/5d44574160f44536b0130abf58cb87cc/fdf4b58974c110149353957a3e7ef453.html?locale=en-US)

---

### Quick links
| | |
|---|---|
| 🔑 | [Creating your API user](#creating-your-api-user) |
| 🟠 | [Using with Bruno](#using-with-bruno) |
| 📮 | [Using with Postman](#using-with-postman) |
| 🌐 | [Selecting an API endpoint](#selecting-an-api-endpoint-data-center) |

---

## Creating your API user

To create your API user, follow [this documentation guide for OpenID Connect](https://help.sap.com/docs/SAP_EMARSYS/5d44574160f44536b0130abf58cb87cc/fdf4b58974c110149353957a3e7ef453.html#openid-connect)

> [!NOTE]
> Be sure to copy your all of the credential details from the gray text boxes to a secure location immediately, as you won't be able to access them again!


## Using with Bruno

[Bruno](https://docs.usebruno.com/) is an open-source API tool that is fully free to use and is supported by the Open-Source community. This collection ships with a native Bruno format that includes pre-configured OAuth2 settings.

### Setting up the Bruno collection

The Bruno collection is generated locally from the Postman source.

Prerequisites:
- [Bruno](https://www.usebruno.com/downloads) — the API client
- [mise](https://mise.jdx.dev/) — task runner (`brew install mise` on macOS, or see [install docs](https://mise.jdx.dev/getting-started.html))
- [Node.js](https://nodejs.org/) — if not already installed, mise will install it automatically

Steps:
1. Clone or download this repository 
2. Run the setup task:
    ```bash
    mise run setup-bruno
    ```
    This generates the `bruno/` folder with all requests, environments, and pre-configured OAuth2 settings.

3. Open Bruno and click **"Open Collection"**, then select the `bruno/` directory 
4. Select the environment matching your Emarsys suite instance from the environment dropdown in Bruno's sidebar 
5. Fill in your `OIDC_ClientId` and `OIDC_Secret` in the environment's secret variables (Bruno stores these securely in its internal app data)

> [!NOTE]
> If you are using [SAP Cloud Identities](https://help.emarsys.com/hc/en-us/articles/22036625729554-Security-settings-API-Credentials#openid-connect-sap-cloud-identity) to manage your Emarsys API credentials, you will need to update the `OIDC_TokenUrl` variable in the Bruno environment settings.

> [!TIP]
> You can re-run `mise run setup-bruno` at any time to update the collection from the Postman source.


## Using with Postman

### Installing the collection in Postman
1. First, make sure you have Postman installed. These collections are meant to be used with the program Postman, which can be downloaded here: https://www.postman.com/downloads/
2. Download this repository by clicking on the Green "Code" button at the top of this page, then "Download Zip":
  ![Graphic displaying the location of the "code" and "download ZIP" buttons on the current github page](./readme-images/github-download-steps.png)
3. Extract the files from the .zip folder
4. With Postman installed and the collections downloaded, click on the import button in the top-left:
  ![Postman import button](./readme-images/import-button.png)
5. Select The upload files option:
    ![Postman upload files option](./readme-images/upload-files-button.png)
6. Select the file `postman/Emarsys_postman_collection.json` from the downloaded files
7. Finally, select the import button to confirm and the package will be fully installed!
 
### Setting up your API user in Postman

1. In Postman, click on the folder for the Emarsys API collection, then select the Authorization tab 
2. Scroll down to the "Configure New Token" section where you will see red text in the boxes for Client ID and Client Secret
![The program Postman, with the Authorization configuration panel open for the collection called "Emarsys - Suite and Sales APIs - V3. There is a large red circle around the parameters for Client ID and Client Secret, which highlights the red text {{OIDC_ClientID}} and {{OIDC_Secret}}, respectively."](./readme-images/postman-oauth-configuration.png)
3. Hover your mouse over the red text for {{OIDC_ClientID}} to see the options of where to store this variable. Click the Environment section to save the variable. If you see text that says "No environment selected", click "Create One" and give it a name like "Emarsys environment" 
![The program Postman, with the Authorization configuration panel open for the collection called "Emarsys - Suite and Sales APIs - V3. That page is scrolled to view the parameters for Client ID and Client Secret, with placeholder text of {{OIDC_ClientID}} and {{OIDC_Secret}}. Above those fields is a dialog window that says "add variable to" with options for Environment, Collection, Globals, and Vault. There is a large red circle around the option "Create One" next to the Environment option."](./readme-images/postman-configure-new-environment.png)
4. In the "Enter Value" checkbox, enter the value you saved from the Emarsys API user creation screen. Do this for Client ID and Client Secret. The text for each will turn from red to blue once it's configured correctly
    1. ***NOTE*** If you are using [SAP Cloud Identities](https://help.emarsys.com/hc/en-us/articles/22036625729554-Security-settings-API-Credentials#openid-connect-sap-cloud-identity) to manage your Emarsys API credentials, you will need to replace the Access Token URL as well 
5. Scroll to the bottom of the window and click the Orange "Get New Access Token" button. Postman will take a moment to make sure your credentials work, then report it was successful. Click "Proceed" on this window, then click "Use Token"
6. Your credentials are now configured!


## Selecting an Emarsys API instance

Every request URL in this collection points at the variable `{{apiHost}}` instead of a hardcoded hostname. To switch between data centers, use the appropriate environment file.

### Public environment

| File                                    | Data center   | Host                                 |
| --------------------------------------- | ------------- | ------------------------------------ |
| `postman/environments/EU-Production.environment.json` | EU Production | `api.emarsys.net`                    |

### Internal environments (private submodule)

Additional environments (EU Staging, US Production, US Staging) are in a private Git submodule at `postman/environments-private/`. To access them:

```bash
git submodule update --init
```

> [!NOTE]
> This requires access to the [private environments repository](https://github.com/emartech/emarsys-api-environments-private). Contact your team lead if you need access.

**Postman:** click the gear icon (Manage Environments) → Import → pick the environment file. Then choose the environment from the dropdown in the top-right of the Postman window.

**Bruno:** run `mise run setup-bruno` after initializing the submodule. The environments will appear in Bruno's environment dropdown.

If no environment is selected, the collection falls back to its built-in default of `api.emarsys.net` (EU Production).


