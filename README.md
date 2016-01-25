Mon-Donate
===

This little node.js script listens calls to an endpoint via a webhook from mondo.

The script parsers the transaction and checks if we have an impact statement relating to that donation.
If we have that information we insert a feed item above the transaction giving the user an impact statement for their donaiton.

App is deployed on heroku, written in node.js, uses express.js, request and body-parser (so thanks to those guys)
