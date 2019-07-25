module.exports = function BulkUpdateManager(client, collectionName, operationsLimit = 0, isOrdered = true) {
  if (typeof collectionName !== 'string') throw new Error('collectionName must be string');
  if (typeof operationsLimit !== 'number') throw new Error('operationsLimit must be number');
  if (typeof isOrdered !== 'boolean') throw new Error('isOrdered must be boolean');

  const db = client.db();
  const collName = collectionName;
  const operations = [];
  const limit = operationsLimit;
  const ordered = isOrdered;

  this.execute = async (isOrdered = ordered) => {
    if (operations.length === 0) {
      return { error: new Error('no operations to execute') };
    }

    const res = await db.collection(collName).bulkWrite(operations, { isOrdered });

    operations.length = 0;

    return res;
  }
  executeIfLimitReached = async () => {
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
}
