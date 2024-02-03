const express = require('express');
const cors = require('cors');
const queryString = require('querystring');
const translate = require('google-translate-api-x');
const { langs } = require('./node_modules/google-translate-api-x/lib/languages.cjs');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/getlanguages', (req, res) => {
  res.send(langs);
});

app.post('/translate', async (req, res) => {
  params = queryString.parse(String(req.url).slice(11));

  const translation = await translate(params.text, { from: String(params.from), to: String(params.to) });

  res.send(JSON.stringify(translation.text));
});

app.listen(port, () => {
  console.log(`Сервер запущен и слушает порт ${port}`);
})
