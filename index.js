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
  whoami: whoami,
  data: {
    transactions: []
  }
}

var accessToken, accountId, clientId, baseURL, settings;



app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function () {
  console.log('Example app listening on port' + app.get('port'));
});

// webhook stuff
app.post('')


function init(){
  accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaSI6Im9hdXRoY2xpZW50XzAwMDA5NFB2SU5ER3pUM2s2dHo4anAiLCJleHAiOjE0NTM4NTcyMDIsImlhdCI6MTQ1MzU5ODAwMiwianRpIjoidG9rXzAwMDA5NFN3eDNXdmw1YkZtdjh5NkQiLCJ1aSI6InVzZXJfMDAwMDk0Um82eVl6ekIwbVhDbzNyRiIsInYiOiIxIn0.ekwUwdl30n2NB4fY2RTmF-Eeu9wpaz8caOQOtl8xAwg',
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

  whoami();
  getAccounts();
  getTransactions();
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



