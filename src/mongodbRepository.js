const { MongoClient, ObjectId } = require('mongodb');
const Movie = require('../src/Movie');

const url = process.env.MONGODB_URL;

const client = new MongoClient(url);

async function run() {
    await client.connect();
    return 'Connected to the MongoDB server...';
}

run().then(console.log).catch(console.error);

const repo = {
    findAll: async () => {
        let movies = [];
        const moviesColl = client.db('moviesDBmongodb').collection('movies');
        const cursor = moviesColl.find({});
        for await (const doc of cursor) {
            const aMovie = new Movie(doc._id.toString(), doc.title, doc.director, doc.year, doc.notes);
            movies.push(aMovie);
        }
        return movies;
    },
    findById: async (uuid) => {
        const moviesColl = client.db('moviesDBmongodb').collection('movies');
        const filter = {_id: new ObjectId(uuid)};
        const doc = await moviesColl.findOne(filter);
        return new Movie(doc._id.toString(), doc.title, doc.director, doc.year, doc.notes);
    },
    create: async (movie) => {
        const doc = {title: movie.title, director: movie.director, year: movie.year, notes: movie.notes};
        const moviesColl = client.db('moviesDBmongodb').collection('movies');
        const result = await moviesColl.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    },
    deleteById: async (uuid) => {
        const moviesColl = client.db('moviesDBmongodb').collection('movies');
        const filter = {_id: new ObjectId(uuid)};
        const result = await moviesColl
        .deleteOne(filter);
        if (result.deletedCount === 1) {
            console.log('Successfully delted one document');
        } else {
            console.log('No documents matched the query. Deleted 0 documents');
        }
    },
    update: async (movie) => {
        const moviesColl = client.db('moviesDBmongodb').collection('movies');
        const filter = {_id: new ObjectId(movie.id)};
        const updateDoc = {
            $set: {
                title: movie.title, 
                director: movie.director, 
                year: movie.year, 
                notes: movie.notes,
            }
        };
        const result = await moviesColl.updateOne(filter, updateDoc);
        console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
    },

};

module.exports = repo;