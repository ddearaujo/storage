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

const format = require('util').format;
const express = require('express');
const Storage = require('@google-cloud/storage');
const mysql = require('mysql');

// Instantiate a storage client
const storage = Storage();

const app = express();

// [START connect]
const config = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

if (process.env.INSTANCE_CONNECTION_NAME) {
  config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}

// Connect to the database
const connection = mysql.createConnection(config);
// [END connect]

// [START getentries]
const SQL_STRING = `SELECT list_name
FROM productsubset
LIMIT 10;`;

/**
 * Retrieve the latest 10 visit records from the database.
 *
 * @param {function} callback The callback function.
 */
function getVisits (callback) {
  connection.query(SQL_STRING, (err, results) => {
    if (err) {
      callback(err);
      return;
    }

    for (var i = 0; i < results.length; i++) {
      console.log(results[i].list_name);
    };

//    console.log("Results: " + results);
    callback(null, results);
  });
}
//Render the search view
app.get('/search', function (req, res, next) {
  getVisits((err, visits) => {
     if (err) {
        next(err);
        return(err);
     }
     res.status(200)
       .set('Content-Type', 'test/plain')
       .send(`Data is:\n${visits.join('\n')}`)
       .end();
   });
  
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]

//connectionName: autocomplete-164808:us-central1:productdata

//local
//cloud_sql_proxy.exe -instances=autocomplete-164808:us-central1:productdata=tcp:3306

//created a private key for a SQL client (proxy)
