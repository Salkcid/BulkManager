mongodb bulk manager, supports only update operation

## Installation
``` bash
$ npm i bulkmanager
```


## Usage
### using mongodb client object
``` js
  const BulkManager = require('bulkmanager');
  const { MongoClient } = require('mongodb');

  const url = 'mongodb://localhost:27017/<db_name>';
  const client = await MongoClient.connect(url, { useNewUrlParser: true });

  //{string} collection name in db
  const collectionName = 'example';
  // {number} threshold, when exceeded 'execute' func automatically called (0 by default, which means no automatic execution)
  const operationsLimit = 50;
  // {boolean} whether bulk ordered or not ('true' by default)
  const isOrdered = false;

  const bulk1 = new BulkManager(client, collectionName, operationsLimit, isOrdered);

  await bulk1.add({ id: 123 }, {
    $set: { updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() },
  }, { upsert: true });

  // you can specify 'isOrdered' for this call like this 'await bulk1.execute(true)'
  await bulk1.execute();

  client.close();
```

### using mongodb connection string
NOTE: call `closeConnection()` method to close conection with mongodb
``` js
  const BulkManager = require('bulkmanager');
  const { MongoClient } = require('mongodb');

  const url = 'mongodb://localhost:27017/<db_name>';

  const bulk2 = new BulkManager(url, 'db_collection_name');

  await bulk2.add({ id: 123 }, {
    $set: { updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() },
  }, { upsert: true });

  await bulk2.execute();

  bulk2.closeConnection();
```
