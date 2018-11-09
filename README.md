# salvai-app

## Installation

```
cd salvai-app
npm install
```

## Running

```
react-native run-android
``` 

Depends on ```react-native-select-all-images``` library that has no iOS implementation (yet).

## Node.js Server

```
git clone salvai-srv
cd salvai-srv
node salvai.js
```

## Usage

First of all grab the server's IP (your local PC running Node.js http server)

```
ifconfig
```

Write the IP down for later use

Run the App

Type server's IP in the text field.

Click the 'Select Image' or 'Select All Images' buttons to choose images that will be uploaded to server.

Finally tap the 'Process images' button to start the upload process.