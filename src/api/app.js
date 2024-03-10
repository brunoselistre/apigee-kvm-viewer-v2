const path = require('path');
const express = require('express');

const app = express();
const apigee_api = require('./src/apigee-api');

app.use(express.static('public'));
app.use(express.json());

const PORT = 8000;

var ORG, TOKEN, ENV, ENVIRONMENTS;


/**********  API **********/
app.post('/api/authorize', async (req, res) => {
    // Populate globals
    const { organization, token } = req.body;
    ORG = organization;
    TOKEN = token;

    try {
      // Fetch environments
      const environments = await apigee_api.listEnvironments(TOKEN, ORG);
      ENV = environments[0];
      ENVIRONMENTS = environments
      res.json({ authorized: true, environments });
    } catch (error) {
      res.status(401).json({ authorized: false, error: 'Failed to fetch data' });
    }
});

app.get('/api/environments', async (req, res) => {
  res.json(ENVIRONMENTS || []);
});

app.put('/api/environments', async (req, res) => { 
  let env =  req.body.environment;
  if(!env || ENVIRONMENTS.indexOf(env) === -1) 
    res.status(400).json({"error": "Environment does not exist"});

  ENV = req.body.environment;
  res.status(200).send();    

});

app.get('/api/kvms', async (req, res) => {  
  try {
    const kvms = await apigee_api.listKvms(TOKEN, ORG, ENV);
    res.json(kvms);
  } catch (error) {
    res.status(400).json({"error": error});
  }
});

app.post('/api/kvms/:kvm', async (req, res) => {  
  const kvm = req.params.kvm;
  try {
    const newKvm = await apigee_api.createKvm(TOKEN, ORG, ENV, kvm);
    res.status(201).send();
  } catch (error) {
    res.status(400).json({"error": error});
  }
});

app.get('/api/kvms/:kvm/entries', async (req, res) => {
  const kvm = req.params.kvm;
  try {
    const entries = await apigee_api.listEntries(TOKEN, ORG, ENV, kvm);
    res.json(entries);
  } catch (error) {
    res.status(400).json({"error": error});
  }
})

app.post('/api/kvms/:kvm/entries', async (req, res) => {
  try {
    const kvm = req.params.kvm;
    const body = { name: req.body.name, value: req.body.value };
    await apigee_api.addEntry(TOKEN, ORG, ENV, kvm, body);    
    res.status(201).send();
  } catch (error) {
    res.status(400).json({"error": error});
  }
})

app.delete('/api/kvms/:kvm/entries/:entry', async (req, res) => {
  try {
    const kvm = req.params.kvm;
    const entry = req.params.entry;

    await apigee_api.deleteEntry(TOKEN, ORG, ENV, kvm, entry);    
    res.status(200).send();
  } catch (error) {
    res.status(400).json({"error": error});
  }
})

app.get('/api/health-check', async (req, res) => {
  res.json({ status: "Ok" });
})

/***********  UI ***********/
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'), );
})

app.get('/kvms', async (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'kvms.html'));
})

app.get('/kvms/:kvm/entries', async (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'entries.html'));
})


// Server
app.listen(PORT, () => {
  console.log('Server running on port 8000');
});
