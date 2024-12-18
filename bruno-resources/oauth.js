'use strict';

const https = require('https');

class OAuth {
  async signRequest(sciHost, clientId, clientSecret) {

    sciHost = sciHost ? sciHost : "https://auth.emarsys.net/oauth2/token"

    const date = new Date().getTime();
    let token = bru.getVar('OAUTH_TOKEN_' + clientId);
    let tokenExpiry = bru.getVar('OAUTH_TOKEN_' + clientId + '_EXPIRY');

    if (!token || tokenExpiry < date) {
      const jwt = await this._getToken(sciHost, clientId, clientSecret);

      if (jwt.expires_in && jwt.access_token) {
        const expiryDate = date + (jwt.expires_in - 60) * 1000;

        bru.setVar('OAUTH_TOKEN_' + clientId, jwt.access_token);
        bru.setVar('OAUTH_TOKEN_' + clientId + '_EXPIRY', expiryDate);

        token = bru.getVar('OAUTH_TOKEN_' + clientId);

        console.log('new token fetched');
      } else {
        console.log('token could not be fetched', jwt);
      }
    } else {
      console.log('token reused');
    }

    req.setHeader('Authorization', 'Bearer ' + token);
  }

  async _getToken(sciHost, clientId, clientSecret) {
    return new Promise((resolve, reject) => {
      const url = sciHost;
      const options = {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'authorization':
            'Basic ' +
            Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        },
      };
      const req = https.request(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            console.log('JSON parsing Error while fetching token', data);
            reject();
          }
        });
      });

      req.on('error', (e) => {
        console.log('Request Error while fetching token', e);
        reject();
      });

      req.write('grant_type=client_credentials');
      req.end();
    });
  }

}

module.exports = new OAuth();