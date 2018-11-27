# Serverless web app in Azure

This is a note about Azure serverless web app. I followed [the tutorial on MSDN](https://docs.microsoft.com/en-us/azure/functions/tutorial-static-website-serverless-api-with-database) and wrote some comments and breadcrumbs here.

1. Blob Storage: serving static contents
1. Azure Functions: managing contents
1. Cosmos DB: storing metadata of contents
1. Logic Apps: for Computer Vision API
1. Azure AD: auth

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
```
