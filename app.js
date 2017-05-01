/**
 * Copyright 2016, Google, Inc.
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

// [START app]
'use strict';

require('@google-cloud/debug-agent').start();
const format = require('util').format;
const express = require('express');
// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GCLOUD_PROJECT environment variable. See
// https://googlecloudplatform.github.io/gcloud-node/#/docs/google-cloud/latest/guides/authentication
// These environment variables are set automatically on Google App Engine
const Storage = require('@google-cloud/storage');

// Instantiate a storage client
const storage = Storage();

const app = express();
app.set('view engine', 'pug');
app.use('/views', express.static('views'));


// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
// [END config]

var fs = require('fs');
var remoteReadStream = bucket.file('productsubset.json').createReadStream();
var remoteWriteStream = bucket.file('danieltest.txt').createWriteStream();
//remoteWriteStream.write('This is a GIANT TEST BEGIN - BOOYAKASHA');
remoteReadStream.pipe(remoteWriteStream);
//remoteWriteStream.end('This is a GIANT TEST END - BOOYAKASHA');


// [START form]
// Display a form for uploading files.
app.get('/', (req, res) => {
  res.render('search.pug');
});
// [END form]

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]
