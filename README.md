# I95Drive-In
By: Peter Mooney, Brian Phelps, Fisnik Dimiri

## Getting Started
In order to get the project up and running locally:
- Download and Install [Node](https://nodejs.org/en/download/)
- Download and Install [Yarn](https://yarnpkg.com/lang/en/docs/install/#mac-stable)
- Download and Install [MongoDB](https://www.mongodb.com/download-center#community)
- Download and Install [Postgres](https://www.postgresql.org/download/)
- Ensure MongoDB and Postgres are running in the background on their default ports
- Unzip the source code into a directory and navigate to it using the command line
- In the root directory, run `yarn`
  - This will install all third-party server dependencies
- Navigate to the `client` directory and run `yarn`
  - This will install all third-party client dependencies
- Navigate back to the project's root directory
- Run `yarn dev`
  - This will start the SQL version of the website
  - The application will be built and automatically open a web browser at `localhost:3000`, displaying the application.
  - If the `i95drivein` database is not defined in postgresql, it will automatically be created.
- If you want to run the MongoDB version of the application, run `yarn dev:mongo`
  - This will perform the same actions as the previous step, and also create the
  `i95drivein` database in Mongo if it is not yet defined.

## Fixtures
In order to populate the database with fixtures:
- Navigate to the root directory of the project
- Run the following commands in this order:
  - `yarn fixtures:load:movies`
  - `yarn fixtures:load:showtimes`
  - `yarn fixtures:load:concessions`
  - `yarn fixtures:load:users`
  - `yarn fixtures:load:transactions`
- Each command will populate the respective model with random fixture data for both the postgres and mongodb databases.
