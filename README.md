mongodb bulk manager, supports only update operation

## Installation
``` bash
$ npm i bulkmanager
```

## Usage
### Using mongodb db instance
``` js
  const BulkManager = require('bulkmanager');
  const { MongoClient } = require('mongodb');

  const url = 'mongodb://localhost:27017';
  const client = await MongoClient.connect(url, { useNewUrlParser: true });
  const db = client.db('<db_name>');

  //{string} collection name in db
  const collectionName = 'example';
  // {number} threshold, when exceeded 'execute' func automatically called (0 by default, which means no automatic execution)
  const operationsLimit = 50;
  // {boolean} whether bulk ordered or not ('true' by default)
  const isOrdered = false;

  const bulk = new BulkManager(db, collectionName, operationsLimit, isOrdered);

  await bulk.add({ id: 123 }, {
    $set: { updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() },
  }, { upsert: true });

  // you can specify 'isOrdered' for this call like this 'await bulk.execute(true)'
  await bulk.execute();

  client.close();
```

### Using mongodb connection string
NOTE: call `closeConnection()` method to close conection with mongodb
``` js
  const BulkManager = require('bulkmanager');
  const { MongoClient } = require('mongodb');

  const url = 'mongodb://localhost:27017/<db_name>';

  const bulk = new BulkManager(url, 'db_collection_name');

  await bulk.add({ id: 123 }, {
    $set: { updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() },
  }, { upsert: true });

  await bulk.execute();

  bulk.closeConnection();
```
