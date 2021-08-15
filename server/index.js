const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const { Client } = require('pg')
require('dotenv').config();

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());
let client;
async function connectToDb(){
    client = new Client({
        user: '',
        host: 'hackfs2.cs8be8jo1f2g.us-east-1.rds.amazonaws.com',
        database: 'hackfs2',
        password: '',
        port: 5432,
    })
    await client.connect()
    console.log('connected');
}
connectToDb();

app.get('/cids/:owner', (req, res) => {
  const {owner} = req.params;
  client.query('SELECT cid FROM cids WHERE owner LIKE $1', [owner], (err, response) => {
    if(err){
        console.log(err);
    }
    const cids = response.rows;
    res.send(cids);
  })
});

app.post('/send/:owner/:cid', (req, response) => {
  const {owner, cid} = req.params;
  console.log(owner);
  console.log(cid);
  const text = 'INSERT INTO cids VALUES($1, $2)'
  const values = [cid, owner]
  // callback
  client.query(text, values, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res.rows)
      // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    }
  })
  response.send('success');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});