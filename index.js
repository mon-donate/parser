mondo = require('./node_modules/Mondojs/config.js');

module.exports = {
  init: init
}
var accessToken, accountId, clientId, mondoAPI;

function init(){
  accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaSI6Im9hdXRoY2xpZW50XzAwMDA5NFB2SU5ER3pUM2s2dHo4anAiLCJleHAiOjE0NTM3MzUxODEsImlhdCI6MTQ1MzU2MjM4MSwianRpIjoidG9rXzAwMDA5NFM1eHpUNzM5cEkyUXRKR2oiLCJ1aSI6InVzZXJfMDAwMDk0Um82eVl6ekIwbVhDbzNyRiIsInYiOiIxIn0.kLqN_9TNTvjWfm1o4Dh8phrWhXDCsjrArofcbT8Xy5Y',
  clientId = 'oauthclient_000094S742udG4wwsJy2G9',
  clientSecret = 'g4YaRe5SR1P+iGKRrPboEQ27hGmPlH1sKb4dSp/AD+PnkDLR3IKTo+waE9dgr6R/bs7Dy38a6tWu5IiPTMea'
  accountId = 'acc_000094Ro6z7NvKW8FqtWSH';

  module.exports.accessToken = accessToken;
  module.exports.accountId = accountId;
  mondo.API = 'https://staging-developers.getmondo.co.uk';
  mondoAPI = new Mondo(clientId, clientSecret);
  module.exports.client = mondoAPI;
  
  mondoAPI.accounts().then(function(res){
    console.log(res);      
  }); 
}

function getTransactions(){
}

init();


