import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 8080;

// Priority serve any static files.
app.use(express.static('client/build'));
app.use(bodyParser.json());

app.post('/api/user', (req, res) => {
  console.log('req.body.email', req.body.email);
  console.log('req.body.password', req.body.password);
  res.send({ express: 'Hello From Express' });
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', (req, res) => {
  res.sendFile('client/build/index.html', { root: '.' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
