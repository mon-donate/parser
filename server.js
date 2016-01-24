var request = require('request');
var express = require('express');
var app = express();

var charities = {
  "AGAINST MALARIA FOUNDATION": {
    "merchantId": "merch_000094S7XUBOwkTnV5P1RB"
  },
  "WAR CHILD": {
    "merchantId": "merch_WARCHILDISTHEBESTCHARITY"
  },
  "OXFAM": {
    "merchantId": "merch_OXFAM"
  }
};

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
  console.log(req.body);
  newTransactions.push(String(req.body));
  res.send(200);
});

app.get('/transactions', function(req, res){
  res.send(String(newTransactions))
});


function init(){
  accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaSI6Im9hdXRoY2xpZW50XzAwMDA5NFB2SU5ER3pUM2s2dHo4anAiLCJleHAiOjE0NTM4OTkxMTMsImlhdCI6MTQ1MzYzOTkxMywianRpIjoidG9rXzAwMDA5NFR4STRGMlZGT2R4TFpDVHAiLCJ1aSI6InVzZXJfMDAwMDk0Um82eVl6ekIwbVhDbzNyRiIsInYiOiIxIn0.XOdbfp4iWon8TbKPkCV-dyVP5Nf0GhdJAF7Kvvt5g0M',
  clientId = 'oauthclient_000094S742udG4wwsJy2G9',
  clientSecret = 'g4YaRe5SR1P+iGKRrPboEQ27hGmPlH1sKb4dSp/AD+PnkDLR3IKTo+waE9dgr6R/bs7Dy38a6tWu5IiPTMea'
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

function registerWebhook(){
  request.post(baseURL + '/webhooks?account_id=' + accountId + '&url=https://agile-lowlands-61737.herokuapp.com/new_transaction', settings, p).form({
    account_id: "acc_000094Ro6z7NvKW8FqtWSH",
    url: "https://agile-lowlands-61737.herokuapp.com/new_transaction"
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

function getTransactions(){
  request.get(baseURL + '/transactions?account_id=' + accountId, settings, storeTransactions);

  function storeTransactions(err, res, body){
    if(!err){
      module.exports.data.transactions = JSON.parse(body).transactions;

      for(var charity in charities){
        if(charities.hasOwnProperty(charity)){
          module.exports.data.transactions.forEach(function(transaction){
            if(transaction.merchant === charities[charity].merchantId){
              addFeedItem(transaction);
            }
          })
        }
      }
    }else{
      console.log(err);
    }
  }
}

function addFeedItem(transaction){
  var title = "Info about your donation to " + transaction.description;
  var body = "Your donation of " + Math.abs(transaction.amount / 100) + " allows " + transaction.description + " to buy 5 mosquito nets";

  request.post(baseURL + '/feed?account_id=' + accountId + '&type=basic&params[title]=' + title + '&params[body]=' + body, settings, feedItemParser).form({
    params: {
      title: title,
      body: body,
      image_url: 'https://wallofhands.com.au/Images/Home/DonateIcon.png'
    }
  });

  function feedItemParser(e, r, b){
    console.log(b);
  }
}





function parser(error, res, body){
}



