const postgresCommands = {
  moviesByProfit: `
    SELECT movies.title AS name, SUM(showtimes.price * transactions.quantity)::double precision AS value
    FROM transactions
    INNER JOIN showtimes ON transactions.transactionable_id = showtimes.id
    INNER JOIN movies ON showtimes.movie_id = movies.id
    WHERE showtimes.start_date BETWEEN $1 AND $2
    AND transactions.transactionable_type = 'showtimes'
    GROUP BY name
    ORDER BY value DESC`,
  moviesByPopularity: `
    SELECT movies.title AS name, SUM(transactions.quantity)::double precision AS value
    FROM transactions
    INNER JOIN showtimes ON transactions.transactionable_id = showtimes.id
    INNER JOIN movies ON showtimes.movie_id = movies.id
    WHERE showtimes.start_date BETWEEN $1 AND $2
    AND transactions.transactionable_type = 'showtimes'
    GROUP BY name
    ORDER BY value DESC`,
  transactionsByDayOfWeek: `
    SELECT to_char(start_date, 'Day') AS name, CAST(count(transactions) AS INTEGER) AS value
    FROM transactions
    INNER JOIN showtimes ON transactions.transactionable_id = showtimes.id
    WHERE showtimes.start_date BETWEEN $1 AND $2
    AND transactions.transactionable_type = 'showtimes'
    GROUP BY name
    ORDER BY value DESC;`,
  concessionsByPopularity: `
    SELECT concessions.type AS name, SUM(transactions.quantity)::double precision AS value
    FROM transactions
    INNER JOIN concessions ON transactions.transactionable_id = concessions.id
    AND transactions.transactionable_type = 'concessions'
    GROUP BY name
    ORDER BY value DESC`,
  ticketsVsConcessionProfits: `
    WITH showtime_sales AS (
      SELECT SUM(showtimes.price * transactions.quantity)::double precision AS showtime_profit
      FROM transactions
      INNER JOIN showtimes ON transactions.transactionable_id = showtimes.id
      INNER JOIN movies ON showtimes.movie_id = movies.id
      AND transactions.transactionable_type = 'showtimes'
      ORDER BY showtime_profit DESC
    ),

    concession_sales AS (
      SELECT SUM(concessions.price * transactions.quantity)::double precision AS concession_profit
      FROM transactions
      INNER JOIN concessions ON transactions.transactionable_id = concessions.id
      WHERE transactions.transactionable_type = 'concessions'
      ORDER BY concession_profit DESC
    )

    SELECT * FROM showtime_sales, concession_sales`,
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
         "showtimes.startDate": {$gte: new Date(startDate), $lt: new Date(endDate) },
         "transactionableType": "showtimes"
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
  moviesByPopularity: async (db, params) => {
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
         "showtimes.startDate": {$gte: new Date(startDate), $lt: new Date(endDate) },
         "transactionableType": "showtimes"
       }
    }, {
      $group: {
        _id: "$movie.title",
        value: { $sum: '$quantity' }
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
    const startDate = params[0];
    const endDate = params[1];

    const ifFri = { $cond: [ {$eq:[6,"$_id"]}, "Friday", "Saturday"] };
    const ifThu = { $cond: [ {$eq:[5,"$_id"]}, "Thursday", ifFri] };
    const ifWed = { $cond: [ {$eq:[4,"$_id"]}, "Wednesday", ifThu] };
    const ifTue = { $cond: [ {$eq:[3,"$_id"]}, "Tuesday", ifWed] };
    const ifMon = { $cond: [ {$eq:[2,"$_id"]}, "Monday", ifTue] };
    const dayOfWeek = { $cond: [ {$eq:[1,"$_id"]}, "Sunday", ifMon] };

    return db.collection('transactions').aggregate([{
         $match: { "transactionableType": "showtimes" }
        }, {
         $lookup: {
            from: 'showtimes',
            localField: 'transactionableId',
            foreignField: '_id',
            as: 'showtimes'
          }
        }, {
         $unwind: '$showtimes'
        }, {
           $match: {
             "showtimes.startDate": {$gte: new Date(startDate), $lt: new Date(endDate) }
           }
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
  },
  concessionsByPopularity: async (db, params) => {
    return db.collection('transactions').aggregate([{
       $match: {
         "transactionableType": "concessions"
       }
    }, {
      $lookup: {
        from: 'concessions',
        localField: 'transactionableId',
        foreignField: '_id',
        as: 'concessions'
      }
    }, {
      $unwind: "$concessions"
    }, {
      $group: {
        _id: "$concessions.type",
        value: { $sum: '$quantity' }
      }
    }, {
      $sort: { value: -1 }
    }, {
      $unwind: "$_id"
    }, {
      $project: { name: "$_id", value: 1, _id: 0 }
    }]).toArray();
  },
  ticketsVsConcessionProfits: async (db, params) => {
    return db.collection('transactions').aggregate([{
      $lookup: {
        from: 'concessions',
        localField: 'transactionableId',
        foreignField: '_id',
        as: 'concessions'
      }
    }, {
      $lookup: {
        from: 'showtimes',
        localField: 'transactionableId',
        foreignField: '_id',
        as: 'showtimes'
      }
    }, {
      $unwind: {
        path: "$concessions",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $unwind: {
        path: "$showtimes",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $group: {
        _id: "null",
        concession_profit: { $sum: { $multiply: [ "$quantity", "$concessions.price" ] } },
        showtime_profit: { $sum: { $multiply: ["$quantity", "$showtimes.price"] } }
      }
    }, {
      $project: { _id: 0, concession_profit: 1, showtime_profit: 1 }
    }]).toArray();
  }
}

const commands = process.env.MONGO === 'true' ? mongoCommands : postgresCommands;

module.exports = commands;
