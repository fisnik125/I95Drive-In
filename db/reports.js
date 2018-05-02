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
  moviesByProfit: async (db, params) => (
    null
  ),
}

const commands = process.env.MONGO === 'true' ? mongoCommands : postgresCommands;

module.exports = commands;
