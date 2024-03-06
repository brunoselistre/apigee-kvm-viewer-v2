const path = require('path');
const express = require('express');
const axios = require('axios');

const app = express();
const apigee_api = require('./src/apigee-api');

app.use(express.static(path.join(__dirname, '../public/src')));
app.use(express.json());

const PORT = 8000;

var ORG, TOKEN, ENV, ENVIRONMENTS;

const apigee = axios.create({
    baseURL: "https://apigee.googleapis.com",
    timeout: 2000,
});

/**********  API **********/
app.post('/api/authorize', async (req, res) => {
    try {
      // Populate globals
      const { organization, token } = req.body;
      ORG = organization;
      TOKEN = token;

      // Fetch environments
      const environments = await apigee_api.listEnvironments(apigee, token, organization);

      if(environments !== undefined) {  
        ENV = environments[0];
        ENVIRONMENTS = environments
        res.json({ authorized: true, environments });
      }
      else
        res.status(401).json({ authorized: false, error: 'Failed to fetch data' });
    } catch (error) {
      console.error(error);
      res.status(401).json({ authorized: false, error: 'Failed to fetch data' });
    }
});

app.get('/api/environments', async (req, res) => {  
  res.json(ENVIRONMENTS || []);
});

app.put('/api/environments', async (req, res) => {  
  ENV = req.body.environment;
  res.status(200).send();
});


app.get('/api/kvms', async (req, res) => {  
  const kvms = await apigee_api.listKvms(apigee, TOKEN, ORG, ENV);

  res.json(kvms || []);
});

app.get('/api/kvms/:kvm/entries', async (req, res) => {
  const kvm = req.params.kvm;
  const entries = await apigee_api.listEntries(apigee, TOKEN, ORG, ENV, kvm);

  res.json(entries || {});
})

app.post('/api/kvms/:kvm/entries', async (req, res) => {
  try {
    const kvm = req.params.kvm;
    const body = { name: req.body.name, value: req.body.value };
    await apigee_api.addEntry(apigee, TOKEN, ORG, ENV, kvm, body);    
    res.status(201).send();
  } catch (error) {
    console.error(error);
  }
})

app.delete('/api/kvms/:kvm/entries/:entry', async (req, res) => {
  try {
    const kvm = req.params.kvm;
    const entry = req.params.entry;

    await apigee_api.deleteEntry(apigee, TOKEN, ORG, ENV, kvm, entry);    
    res.status(200).send();
  } catch (error) {
    console.error(error);
  }
})

app.get('/api/health-check', async (req, res) => {
  res.json({ status: "Ok" });
})

/***********  UI ***********/
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/src/views', 'index.html'));
})

app.get('/kvms', async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/src/views', 'kvms.html'));
})

app.get('/kvms/:kvm/entries', async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/src/views', 'entries.html'));
})


// Server
app.listen(PORT, () => {
  console.log('Server running on port 8000');
});
