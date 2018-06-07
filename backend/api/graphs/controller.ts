import { MongoClient, Server, ObjectID } from 'mongodb';

const MONGO_URL = 'mongodb://localhost:27017';

export function getGraphs() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, (err, client) => {
      if (!err) {
        const db = client.db('easygraph');
        const graphsCollection = db.collection('graphs');

        graphsCollection.find({}).limit(20).toArray()
        .then(graphs => {
          resolve(graphs);
        })
        .catch(errorQuery => reject(errorQuery));
      } else {
        reject(err);
      }
    });
  });
}

export function getLikes() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, (err, client) => {
      if (!err) {
        const db = client.db('easygraph');
        const graphsCollection = db.collection('graphs');

        graphsCollection.find({ like: true }).limit(20).toArray()
        .then(graphs => resolve(graphs))
        .catch(err => reject(err));
      } else {
        reject(err);
      }
    });
  });
}

export function getGraph(graphId: number) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, (err, client) => {
      if (!err) {
        const db = client.db('easygraph');
        const graphsCollection = db.collection('graphs');

        graphsCollection.findOne({ _id: new ObjectID(graphId)})
        .then(graph => resolve(graph))
        .catch(errorFind => reject(errorFind));
      } else {
        reject(err);
      }
    });
  });
}

export function postGraph(newGraph) {
  return new Promise((resolve, reject) => {
    const graphToInsert = {...newGraph, created: new Date(), updated: new Date() };
    MongoClient.connect(MONGO_URL, (err, client) => {
      if (!err) {
        const db = client.db('easygraph');
        const graphsCollection = db.collection('graphs');

        graphsCollection.insertOne(graphToInsert)
        .then(() => resolve(graphToInsert))
        .catch(errorInsert => reject(errorInsert));
      } else {
        reject(err);
      }
    });
  });
}

export function putGraph(graphId: number, graphFromBody) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, (err, client) => {
      if (!err) {
        const db = client.db('easygraph');
        const graphsCollection = db.collection('graphs');

        const graphToUpdate = { ...graphFromBody, updated: new Date() };
        const query = { _id: new ObjectID(graphId)};
        const body = { $set: graphToUpdate };
        const options = { returnOrigonal: false, upsert: false };
        graphsCollection.findOneAndUpdate(query, body, options)
          .then(() => resolve())
          .catch(updateError => reject(updateError));
      } else {
        reject(err);
      }
    });
  });
}

export function putLike(graphId: number, likeValue: boolean) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, (err, client) => {
      if (!err) {
        const db = client.db('easygraph');
        const graphsCollection = db.collection('graphs');

        const query = { _id: new ObjectID(graphId) };
        const body = { $set: { like: likeValue, updated: new Date() } };
        const options = { returnOrigonal: false, upsert: false };
        graphsCollection.findOneAndUpdate(query, body, options)
          .then(() => resolve())
          .catch(updateError => reject(updateError));
      } else {
        reject(err);
      }
    });
  });
}

export function deleteGraph(graphId: number) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, (err, client) => {
      const db = client.db('easygraph');
      const graphsCollection = db.collection('graphs');

      const query = { _id: new ObjectID(graphId) };
      graphsCollection.findOneAndDelete(query)
        .then(() => resolve())
        .catch((deleteError => reject(deleteError)));
    });
  });
}