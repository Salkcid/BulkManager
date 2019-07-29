'use strict';

const { MongoClient } = require('mongodb');

/**
 * @param {object|string} clientOrUrl mongodb client or connection URL string in both cases db name must be specified
 * @param {string} collectionName collection name in db
 * @param {number} [operationsLimit=0] threshold, when exceeded 'execute' func automatically called
 * @param {boolean} [isOrdered=true] whether bulk ordered or not
 */
function BulkUpdateManager(clientOrUrl, collectionName, operationsLimit = 0, isOrdered = true) {
  if (typeof collectionName !== 'string') throw new Error('collectionName must be string');
  if (typeof operationsLimit !== 'number') throw new Error('operationsLimit must be number');
  if (typeof isOrdered !== 'boolean') throw new Error('isOrdered must be boolean');

  let _client;
  let db;
  let mustConnect = false;
  if (typeof clientOrUrl === 'string') {
    _client = MongoClient.connect(clientOrUrl, { useNewUrlParser: true });
    mustConnect = true;
  } else {
    db = clientOrUrl.db();
  }

  const collName = collectionName;
  const operations = [];
  const limit = operationsLimit;
  const ordered = isOrdered;

  this.execute = async (isOrdered = ordered) => {
    if (operations.length === 0) {
      return { error: new Error('no operations to execute') };
    }

    if (mustConnect) {
      _client = await _client;
      db = _client.db();
    }

    const res = await db.collection(collName).bulkWrite(operations, { isOrdered });

    operations.length = 0;

    return res;
  }
  const executeIfLimitReached = async () => {
    if (!limit) {
      return;
    }

    if (operations.length > limit) {
      return await this.execute();
    }
  }
  this.add = async (filterObj, updateObj, additionalParameters) => {
    operations.push({
      updateOne : {
        'filter': filterObj,
        'update': updateObj,
        ...additionalParameters,
      }
    });
    return await executeIfLimitReached();
  }
  this.closeConnection = () => {
    if (_client && _client.close) {
      _client.close();
    }
  };
}

module.exports = BulkUpdateManager;