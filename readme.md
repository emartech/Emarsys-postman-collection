# Emarsys API Postman collections
This document describes the Emarsys Suite API v3, which uses OpenID Connect (OAuth 2.0 client credentials grant) authentication. 

Other API collections, including the Emarsys suite WSSE APIs can be found [here](./wsse_APIs/)


## How to install
1. First, make sure you have Postman installed. These collections are meant to be used with the program Postman, which can be downloaded here: https://www.postman.com/downloads/
1. Download this repository by clicking on the Green "Code" button at the top of this page, then "Download Zip":
  ![Graphic displaying the location of the "code" and "download ZIP" buttons on the current github page](./readme-images/github-download-steps.png)
3. Extract the files from the .zip folder
4. With Postman installed and the collections downloaded, click on the import button in the top-left:
  ![Postman import button](./readme-images//import-button.png)
1. Select The upload files option:
    ![Postman upload files option](./readme-images/upload-files-button.png)
1. Select each of the files from the downloaded package (The readme.md and readme-images folder are okay to select too, but aren't necessary)
    ![Postman file selector with all files from package highlighted](./readme-images/file-selector.png)
1. Finally, select the import button to confirm and the package will be fully installed!
  ![Postman interface displaying all the highlighted files, waiting for confirmation to import](./readme-images/final-import-button.png)
 




## Setting up your API user

1. First, create your API user in Emarsys. Open your account, select Management by clicking the wrench icon from pop-out menu on the left of the page, then click "Security Settings"
1. Click the API icon from the menu on the left, then click "Create API Credentials" and select OpenID Connect as the authentication type to make credentials that will work with this collection 
![The Emarsys suite interface, opened to the API Credentials page, with a pop-up showing options for OpenID Connect or WSSE for authentication. There is a large red arrow pointed to OpenID Connect](./readme-images/oidc-authentication-type-selector.png)
1. Your API user is now created! Be sure to copy your all of the credential details from the gray text boxes to a secure location immediately, as you won't be able to access them again
1. Still on the API credentials page, look through the Permissions table and toggle any API actions you need to the Enabled status. If your needs change in the future, you can return to this page and enable more endpoints
1. In Postman, click on the folder for the Emarsys API collection, then select the Authorization tab
1. Scroll down to the "Configure New Token" section where you will see red text in the boxes for Client ID and Client Secret
![The program Postman, with the Authorization configuration panel open for the collection called "Emarsys - Suite and Sales APIs - V3. There is a large red circle around the parameters for Client ID and Client Secret, which highlights the red text {{OIDC_ClientID}} and {{OIDC_Secret}}, respectively."](./readme-images/postman-oauth-configuration.png)
1. Hover your mouse over the red text for {{OIDC_ClientID}} to see the options of where to store this variable. Click the Environment section to save the variable. If you see text that says "No environment selected", click "Create One" and give it a name like "Emarsys environment"
![The program Postman, with the Authorization configuration panel open for the collection called "Emarsys - Suite and Sales APIs - V3. That page is scrolled to view the parameters for Client ID and Client Secret, with placeholder text of {{OIDC_ClientID}} and {{OIDC_Secret}}. Above those fields is a dialog window that says "add variable to" with options for Environment, Collection, Globals, and Vault. There is a large red circle around the option "Create One" next to the Environment option."](./readme-images/postman-configure-new-environment.png)
1. In the "Enter Value" checkbox, enter the value you saved from the Emarsys API user creation screen. Do this for Client ID and Client Secret. The text for each will turn from red to blue once it's configured correctly
1. Scroll to the bottom of the window and click the Orange "Get New Access Token" button. Postman will take a moment to make sure your credentials work, then report it was successful. Click "Proceed" on this window, then click "Use Token"
1. Your credentials are now configured!