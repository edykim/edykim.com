---
title: Serverless web app in Azure
type: note
date: 2018-11-27T13:17:00-08:00
---

# Serverless web app in Azure

This is a note about Azure serverless web app. I followed [the tutorial on MSDN](https://docs.microsoft.com/en-us/azure/functions/tutorial-static-website-serverless-api-with-database) and wrote some comments and breadcrumbs here.

1. Blob Storage: serving static contents
1. Azure Functions: managing contents
1. Cosmos DB: storing metadata of contents
1. Logic Apps: for Computer Vision API
1. Azure AD: auth

## What I've Learned

- Creating API with Azure Functions are super easy.
- Blob Storage, Cosmos DB, Logic Apps are easy to integrate with functions.
- Platform fetures are also powerful. Most of feature supports via the portal by one click.
- Azure CLI is awesome, easily create new resources via command line. CAUTION: Some of parts are out of date.
- Function CLI is working perfactly.

## Follow Ups

- I can setup the local testing environment for unit testing, but how to test all integrated parts?
- How much cost for all this simple services?
- Check other authentications e.g. twitter, google.
  - It called [Azure App Service Authentication a.k.a. EasyAuth](https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-overview)
- Is it slow generally? Sometimes it spent few seconds for the loading.

----

## Before start

### Azure CLI

Azrue CLI is useful when you follow the tutorial. I installed on my mac via homebrew.

```bash
$ brew update && brew install azure-cli
$ az login # Follow login steps
```

[Others can find here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest). Also, you can use Azure Cloud Shell from your browser.

### Azure Function Core Tools

```bash
$ brew tap azure/functions
$ brew install azure-functions-core-tools
```

[Others are here](https://github.com/Azure/azure-functions-core-tools).

## Add Azure Blob Storage

### Create a storage account for static page

Create a resource group.

```bash
$ az group create -n first-serverless-app -l westcentralus
```

Create a Blob storage for static files. The name should be unique, 3~24 chars, alphanumeric, and lowercase.

```bash
$ az storage account create -n <storage account name> \
    -g first-serverless-app \
    -l westcentralus \
    --kind StorageV2 \
    --https-only true \
    --sku Standard_LRS
```

Enable **Static website (preview)** from Azure web portal, Or, via cli.

```bash
$ az extension add --name storage-preview
$ az storage blog service-properties update \
    --account-name <storage account name> \
    --static-website \
    --index-document index.html
```

This configuration will create a blob container named `$web`.

Clone the example web project from Github. This project is written by vue.

```bash
$ git clone https://github.com/Azure-Samples/functions-first-serverless-web-application
$ cd functions-first-serverless-web-application
$ npm install && npm run generate
```

It generates static pages in `dist` directory via nuxt. Upload the build.

```bash
$ cd dist
$ az storage blob upload-batch -s . -d \$web --account-name <storage account name>
```

You can find the static website on primary endpoint URL. If you don't want to access the portal, the below command is helpful.

```bash
$ az storage account show -n <storage account name> --query "primaryEndpoints.web"
```

### Create a blob storage container for images

Create a blog storage for images.

```bash
$ az storage container create -n images --account-name <storage account name> \
    --public-access blob
```

## Azure Functions

### Create an Azure function app

```bash
$ az functionapp create -n <function app name> \
    -g first-serverless-app \
    -s <storage account name> \
    -c westcentralus
```

The provided code from the tutorial is using v1 runtime. The default version is v2 now. If you want to use v1 code, you need to set the runtime version.

```bash
# change the runtime version
$ az functionapp config appsettings set --name <function app name> \
    --resource-group first-serverless-app \
    --settings FUNCTIONS_EXTENSION_VERSION=~1

# check the current runtime version
$ az functionapp config appsettings list --name <function app name> \
    --resource-group first-serverless-app \
    --query "[?name=='FUNCTIONS_EXTENSION_VERSION'] | [0] | value"
```

I will use JavaScript so that I need to setup a nodejs version as well.

```bash
$ az functionapp config appsettings set \
    --resource-group first-serverless-app \
    --name <function app name> \
    --settings WEBSITE_NODE_DEFAULT_VERSION=10.6.0
```

### Create a new function in Azure function app

```bash
$ mkdir first-func-app && cd first-func-app
$ func init --worker-runtime node
$ func new --name GetUploadUrl \
    --language JavaScript \
    --template "HTTP trigger"
$ cd GetUploadUrl
$ npm init -y
```

Then, add `"private": true` in `package.json` file.

Also, update `authLevel` as `anonymous` from `function` in `function.json` file.

```bash
$ npm install --save azure-storage
```

Update `GetUploadUrl/index.js` file based on [this file](https://raw.githubusercontent.com/Azure-Samples/functions-first-serverless-web-application/master/javascript/GetUploadUrl/index.js).

```bash
$ cd first-func-app
$ func azure functionapp publish <function app name>
```

This new function requires a connection string for storage account.

```bash
$ export STORAGE_CONNECTION_STRING=$(
    az storage account show-connection-string -n <storage account name> \
        -g first-serverless-app \
        --query "connectionString" \
        --output tsv)
$ echo $STORAGE_CONNECTION_STRING # check the string
```

Update the connection setting in the our function app.

```bash
$ az functionapp config appsettings set -n <function app name> \
    -g first-serverless-app \
    --settings AZURE_STORAGE_CONNECTION_STRING=$STORAGE_CONNECTION_STRING \
    --output table
```

Open the logstream via func cli.

```bash
$ func azure functionapp logstream <function app name>
```

Endpoint of the API is now available.

```bash
$ curl -G https://<function app name>.azurewebsites.net/api/GetUploadUrl \
    -d name=image1.jpg
```

## Change CORS configuration

### Azure Functions

It requires adding a blob storage url for cross-origin resource sharing.

```bash
$ az functionapp cors add \
    --name <function app name> \
    --resource-group first-serverless-app \
    --allowed-origins $( \
        az storage account show \
            -n <storage account name> \
            --query "primaryEndpoints.web" \
            --output tsv \
    | sed 's/\/$//')
```

Check the changes.

```bash
$ az functionapp cors show \
    --name <function app name> \
    --resource-group first-serverless-app
```

### Storage account

```bash
$ az storage cors add --methods OPTIONS PUT \
    --origins '*' \
    --exposed-headers '*' \
    --allowed-headers '*' \
    --services b \
    --account-name <storage account name>
```

 

Note: `b` in `services` means blob.

## Modify the web app to upload images

```bash
$ cd /path/to/functions-first-serverless-web-application/www/dist
$ export FUNCTION_APP_URL="https://"$(az functionapp show \
    -n <function app name> \
    -g first-serverless-app \
    --query "defaultHostName" \
    --output tsv)
$ export BLOB_BASE_URL=$(az storage account show \
    -n <storage account name> \
    --query "primaryEndpoints.blob" \
    --output tsv \
    | sed 's/\/$//')
$ echo "window.apiBaseUrl = '$FUNCTION_APP_URL';\\n\
window.blobBaseUrl = '$BLOB_BASE_URL';" > settings.js
```

Check the result.

```bash
$ cat settings.json
```

Upload the changes.

```bash
$ az storage blob upload -c \$web \
    --account-name <storage account name> \
    -f settings.js \
    -n settings.js
```

Open the web app from the browser and upload any images. You should be able to upload the file then stuck at "Analyzing image..." step.

Also, you can find the uploaded files from the storage. Check the file using the command below.

```bash
$ az storage blob list --account-name <storage account name> \
    -c images \
    -o table
```

If you want to clean up, you can use this command.

```bash
$ az storage blob delete-batch -s images \
    --account-name <storage account name>
```

## Resize images with Azure Functions

Create a blob storage container for thumbnails.

```bash
$ az storage container create -n thumbnails \
    --account-name <storage account name> \
    --public-access \
    blob
```

Create a function for thumbnails. This function will be triggered by blob.

```bash
$ func new --name ResizeImage \
    --language JavaScript \
    --template "Azure Blob Storage trigger"
```

Update `ResizeImage/function.json` like below.

```json
{
  "disabled": false,
  "bindings": [
    {
      "name": "myBlob",
      "type": "blobTrigger",
      "direction": "in",
      "path": "images/{name}",
      "connection": "AZURE_STORAGE_CONNECTION_STRING"
    },
    {
      "name": "thumbnail",
      "type": "blob",
      "direction": "out",
      "path": "thumbnails/{name}",
      "connection": "AZURE_STORAGE_CONNECTION_STRING"
    }
  ]
}
```

`jimp` package gives a resizing image feature. Add `jimp` as a dependency in the project.

```bash
$ cd first-func-app/ResizeImage
$ npm init -y
$ npm install --save jimp
```

Update `ResizeImage/index.js` file based on [this file](https://raw.githubusercontent.com/Azure-Samples/functions-first-serverless-web-application/master/javascript/ResizeImage/index.js).

```bash
$ cd first-func-app
$ func azure functionapp publish <function app name>
```

Upload new images and check the thumbnails from the storage.

```bash
$ az storage blob list --account-name <storage account name> -c images -o table
$ az storage blob list --account-name <storage account name> -c thumbnails -o table
```

Find out what the thumbnail url is and test it on the browser.

```bash
$ az storage blob url \
    --account-name <storage account name> \
    -c thumbnails \
    -n <file name> \
    --output tsv
```

Remove all test images after all testing.

```bash
$ az storage blob delete-batch -s images --account-name <storage account name>
$ az storage blob delete-batch -s thumbnails --account-name <storage account name>
```

## Store image metadata with Azure Cosmos DB

Note: Azure CLI is unreliable on Cosmos DB right now so you should do all process via the portal rather than these commands.

Create DB account first.

```bash
$ az cosmosdb create -g first-serverless-app \
    -n <cosmos db account name>
```

Note: Creating new cosmosdb via azure cli is [not working](https://github.com/Azure/azure-cli/issues/7079) right now. You should manually create the cosmosdb from the portal.

Create a new database named **imagesdb** and a new collection named **images**.

```bash
$ az cosmosdb database create -g first-serverless-app \
    -n <cosmos db account name> \
    --db-name imagesdb
$ az cosmosdb collection create -g first-serverless-app \
    -n <cosmos db account name> \
    --db-name imagesdb \
    --collection-name images \
    --throughput 400
```

Get connection string from cosmos db and add into function app.

```bash
$ export COSMOSDB_ACCOUNT_ENDPOINT=$(az cosmosdb show \
    --name <cosmos db account name> \
    --resource-group first-serverless-app \
    --query documentEndpoint \
    --output tsv)
$ export COSMOSDB_PRIMARY_KEY=$(az cosmosdb list-keys \
    --name <cosmos db account name> \
    --resource-group first-serverless-app \
    --query primaryMasterKey \
    --output tsv)
$ export COSMOSDB_CONNECTION_STRING="AccountEndpoint=$COSMOSDB_ACCOUNT_ENDPOINT;AccountKey=$COSMOSDB_PRIMARY_KEY;"
$ az functionapp config appsettings set --name <function app name> \
    --resource-group first-serverless-app \
    --settings <cosmos db account name>_DOCUMENTDB=$COSMOSDB_CONNECTION_STRING
```

Update `function.json` in `ResizeImage`.

```json
{
    //...
    "bindings": [
        //...
        {
            "type": "cosmosDB",
            "name": "$return",
            "databaseName": "imagesdb",
            "collectionName": "images",
            "createIfNotExists": false,
            "connectionStringSetting": "<cosmos db account name>_DOCUMENTDB",
            "direction": "out"
        }
        //...
    ]
}
```

Check `ResizeImage/index.js`. The example file already cares return value with a image path.

Create new function called `GetImages`.

```bash
$ cd first-func-app
$ func new --name GetImages \
    --language JavaScript \
    --template "HTTP trigger"
$ cd GetImages
```

Change `authLevel` as `anonymous` from `function` in `function.json` file.

Add a new input in `function.json`.

```json
{
    //...
    "bindings": [
        //...
        {
        "type": "cosmosDB",
        "name": "documents",
        "databaseName": "imagesdb",
        "collectionName": "images",
        "connectionStringSetting": "<cosmos db account name>_DOCUMENTDB",
        "sqlQuery": "select * from c order by c._ts desc",
        "direction": "in"
        }
        //...
    ]
}
```

Update `GetImages/index.js` file like the code below:

```js
module.exports = function (context, _, documents) {
    context.res = {
        body: documents
    };
    context.done();
};
```

Run extension install for cosmosdb and publish it.

```bash
$ cd first-func-app
$ func extensions install
$ func azure functionapp publish <function app name>
```

Check the web app, and upload new images. Also, check the data from Cosmos DB Data Explorer in the portal.

## Computer Vision for image captions

Note: Computer Vision API has a free tier that provides up to 5k API calls per month. `F0` means the free tier.

```bash
$ az cognitiveservices account create -g first-serverless-app \
    -n <computer vision account name> \
    --kind ComputerVision \
    --sku F0 \
    -l westcentralus
```

Fetch the key and the URL, then set as variables in function app.

```bash
$ export COMP_VISION_KEY=$(az cognitiveservices account keys list \
    -g first-serverless-app \
    -n <computer vision account name> \
    --query key1 \
    --output tsv)
$ export COMP_VISION_URL=$(az cognitiveservices account show \
    -g first-serverless-app \
    -n <computer vision account name> \
    --query endpoint \
    --output tsv)
$ az functionapp config appsettings set \
    -n <function app name> \
    -g first-serverless-app \
    --settings \
        COMP_VISION_KEY=$COMP_VISION_KEY \
        COMP_VISION_URL=$COMP_VISION_URL \
    -o table
```

Update `ResizeImage` for Computer Vision API. It requires `axios`.

```bash
$ cd first-func-app/ResizeImage
$ npm install --save axios
```

Update `ResizeImage/index.js` file based on [this file](https://raw.githubusercontent.com/Azure-Samples/functions-first-serverless-web-application/master/javascript/ResizeImage/index-module5.js). Note: API url is slightly incorrect. It should start with `/vision/v2.0/analyze`.

Publish funcs and test it.

## Add authentication

The tutorial comes with AD Authentication code. Set the platform features from the portal. [Steps are here](https://docs.microsoft.com/en-us/azure/functions/tutorial-static-website-serverless-api-with-database?tutorial-step=6).


## Clean Up Resources

```bash
$ az group delete --name first-serverless-app
```
