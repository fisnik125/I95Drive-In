const postgresCommands = {
  moviesByProfit: `
    SELECT movies.title AS name, SUM(showtimes.price * transactions.quantity)::double precision AS value
    FROM transactions
    INNER JOIN showtimes ON transactions.transactionable_id = showtimes.id
    INNER JOIN movies ON showtimes.movie_id = movies.id
    WHERE showtimes.start_date BETWEEN $1 AND $2
    GROUP BY name
    ORDER BY value DESC`,
  transactionsByDayOfWeek: `
    SELECT to_char(start_date, 'Day') AS name, CAST(count(transactions) AS INTEGER) AS value
    FROM transactions
    INNER JOIN showtimes ON transactions.transactionable_id = showtimes.id
    GROUP BY name
    ORDER BY value DESC;`,
}

const mongoCommands = {
  moviesByProfit: async (db, params) => {
    const startDate = params[0];
    const endDate = params[1];

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
       $match: {
         "showtimes.startDate": {$gte: new Date(startDate), $lt: new Date(endDate) }
       }
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
  transactionsByDayOfWeek: async (db, params) => {
    const ifFri = { $cond: [ {$eq:[6,"$_id"]}, "Friday", "Saturday"] };
    const ifThu = { $cond: [ {$eq:[5,"$_id"]}, "Thursday", ifFri] };
    const ifWed = { $cond: [ {$eq:[4,"$_id"]}, "Wednesday", ifThu] };
    const ifTue = { $cond: [ {$eq:[3,"$_id"]}, "Tuesday", ifWed] };
    const ifMon = { $cond: [ {$eq:[2,"$_id"]}, "Monday", ifTue] };
    const dayOfWeek = { $cond: [ {$eq:[1,"$_id"]}, "Sunday", ifMon] };

    return db.collection('transactions').aggregate([{
         $lookup: {
            from: 'showtimes',
            localField: 'transactionableId',
            foreignField: '_id',
            as: 'showtimes'
          }
        }, {
         $unwind: '$showtimes'
        }, {
          $project: {
             name: { $dayOfWeek: '$showtimes.startDate' }
          }
        }, {
          $group: {
             _id: "$name",
             value: { $sum: 1 }
          }
        }, {
          $project: {
             _id: 0, name: dayOfWeek, value: 1
          }
        }, {
          $sort: { value: -1 }
        }
     ]).toArray();
  }
}

const commands = process.env.MONGO === 'true' ? mongoCommands : postgresCommands;

module.exports = commands;
