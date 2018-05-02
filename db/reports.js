const postgresCommands = {
  moviesByProfit: `
    SELECT movies.title AS name, SUM(showtimes.price * transactions.quantity)::double precision AS value
    FROM transactions
    INNER JOIN showtimes ON transactions.transactionable_id = showtimes.id
    INNER JOIN movies ON showtimes.movie_id = movies.id
    GROUP BY name
    ORDER BY value DESC`,
}

const mongoCommands = {
  moviesByProfit: async (db, params) => {
    return db.collection('transactions').aggregate([{
      $lookup: {
        from: 'showtimes',
        localField: 'transactionableId',
        foreignField: '_id',
        as: 'showtimes'
      }
    }, {
      $lookup: {
        from: 'movies',
        localField: 'showtimes.0.movieId',
        foreignField: '_id',
        as: 'movie'
      }
    }, {
      $unwind: "$showtimes"
    }, {
      $group: {
        _id: "$movie.title",
        value: { $sum: { $multiply: [ "$quantity", "$showtimes.price" ] } }
      }
    }, {
      $sort: { value: -1 }
    }, {
      $unwind: "$_id"
    }, {
      $project: { name: "$_id", value: 1, _id: 0 }
    }]).toArray();
  },
}

const commands = process.env.MONGO === 'true' ? mongoCommands : postgresCommands;

module.exports = commands;
