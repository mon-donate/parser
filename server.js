var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');


var app = express();
app.use(bodyParser.json())

var charities = [
  {
    "name": "Against Malaria Foundation",
    "mondoDescription": "AGAINST MALARIA FO".replace(/['"]+/g, '').toLowerCase(),
    "merchantId": "merch_000094S7XUBOwkTnV5P1RB",
    "info": "Since its founding in 2004, the Against Malaria Foundation has distributed over 5.7 million insecticide nets around the world. These nets provide effective and long lasting protection against malaria, a debilitating and life threatening disease, enabling people to live happier, healthier and more productive lives",
    "multiple": 1.77,
    "funds": "insecticide treated malaria nets"
  },
  {
    "name": "War Child",
    "mondoDescription": "WWW.WARCHILD.ORG.UK".replace(/['"]+/g, '').toLowerCase(),
    "merchantId": "merch_000094U3dsVDQdMJ6cxK8v",
    "info": "War Child support children in some of the world's most conflict ridden areas.  Since 1993, they’ve helped millions of children affected by conflict, providing everything from school uniforms to anti-malarial treatments, and working to uphold children’s rights: the right to an education, the right to live free from violence, and ultimately, the right to a childhood.  ",
    "multiple": 3,
    "funds": "blankets to keep a child from Khabul warm during Afghanistan's freezing winters"
  },
  {
    "name": "Schistosomiasis Control Initiative",
    "mondoDescription": "SHORT COURSES".replace(/['"]+/g, '').toLowerCase(),
    "merchantId": "merch_000094U2y5ktlSKRUt5DV3",
    "info": "The Schistosomiasis Control Initiative supports the governments of African nations treat schistosomiasis, a neglected tropic disease caused by parasitic worms. Since its founding, SCI have delivered over 100 million treatments, allowing people to eliminate the parasite, and live happier, healthier and more productive lives.",
    "multiple": 0.37,
    "funds": "treatment courses to combat schistosomiasis for an entire year"
  }
];

module.exports = {
  init: init,
  registerWebhook: registerWebhook,
  whoami: whoami,
  data: {
    transactions: []
  }
}

var accessToken, accountId, clientId, baseURL, settings, newTransactions;


app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), '0.0.0.0', function () {
  console.log('Example app listening on port' + app.get('port'));
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

newTransactions = [];

// webhook stuff
app.post('/new_transaction', function(req, res){
  accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaSI6Im9hdXRoY2xpZW50XzAwMDA5NFB2SU5ER3pUM2s2dHo4anAiLCJleHAiOjE0NTM4OTkxMTMsImlhdCI6MTQ1MzYzOTkxMywianRpIjoidG9rXzAwMDA5NFR4STRGMlZGT2R4TFpDVHAiLCJ1aSI6InVzZXJfMDAwMDk0Um82eVl6ekIwbVhDbzNyRiIsInYiOiIxIn0.XOdbfp4iWon8TbKPkCV-dyVP5Nf0GhdJAF7Kvvt5g0M',
  accountId = 'acc_000094Ro6z7NvKW8FqtWSH';
  baseURL = 'https://staging-api.getmondo.co.uk';
  settings = {
    'auth': {
      'bearer': accessToken
    }
  };

  newTransactions.push(JSON.stringify(transaction));
  console.log('new transaction recognised');
  var transaction = req.body.data;
  var merchant = transaction.merchant.id;
  var name = transaction.description.replace(/['"]+/g, '').toLowerCase();


  charities.forEach(function(charity){
    if(charity.mondoDescription === name){
      addFeedItem(transaction, charity);
    }
  });

  function addFeedItem(transaction, charity){
    var title = "Impact statement for " + charity.name;

    var impact = Math.ceil(Math.abs(transaction.amount / 100) / charity.multiple);
    var itFunds = "Your donation allows " + charity.name + " to fund " + impact + " " + charity.funds; 
    var body = itFunds + ". " + charity.info; 

    request.post(baseURL + '/feed?account_id=' + accountId + '&type=basic', settings, feedItemParser).form({
      params: {
        title: title,
        body: body,
        image_url: 'https://wallofhands.com.au/Images/Home/DonateIcon.png'
      }
    });

    function feedItemParser(e, r, b){
      console.log('feed res');
      console.log(e);
      console.log(b);
    }
  }



  newTransactions.push(String(req.body));
  res.send(200);
});

app.get('/transactions', function(req, res){
  res.send(String(newTransactions))
});


function init(){
  accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaSI6Im9hdXRoY2xpZW50XzAwMDA5NFB2SU5ER3pUM2s2dHo4anAiLCJleHAiOjE0NTM4OTkxMTMsImlhdCI6MTQ1MzYzOTkxMywianRpIjoidG9rXzAwMDA5NFR4STRGMlZGT2R4TFpDVHAiLCJ1aSI6InVzZXJfMDAwMDk0Um82eVl6ekIwbVhDbzNyRiIsInYiOiIxIn0.XOdbfp4iWon8TbKPkCV-dyVP5Nf0GhdJAF7Kvvt5g0M',
  accountId = 'acc_000094Ro6z7NvKW8FqtWSH';
  baseURL = 'https://staging-api.getmondo.co.uk';
  settings = {
    'auth': {
      'bearer': accessToken
    }
  };

  module.exports.accessToken = accessToken;
  module.exports.accountId = accountId;

  registerWebhook();
}

function listWebhooks(){
  request.get(baseURL + '/webhooks?account_id=' + accountId, settings, function(e, p, b){ console.log(b); });
}

function registerWebhook(){
  request.post(baseURL + '/webhooks?account_id=' + accountId, settings, p).form({
    account_id: "acc_000094Ro6z7NvKW8FqtWSH",
    url: "http://requestb.in/1i0no4w1"
  });

  function p(e, r, b){
    console.log('webhook:');
    console.log(b);
  }
}

function whoami(){
  request.get(baseURL + '/ping/whoami', settings, parser);
}

function getAccounts(){
  request.get(baseURL + '/accounts', settings, parser);
}



function parser(error, res, body){}



