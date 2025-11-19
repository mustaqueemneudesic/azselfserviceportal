const express = require('express');
const router = express.Router();
const msal = require('@azure/msal-node');
require('dotenv').config();

// MSAL config
const msalConfig = {
  auth: {
    clientId: process.env.AZ_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZ_TENANT_ID}`,
    clientSecret: process.env.AZ_CLIENT_SECRET
  }
};

const cca = new msal.ConfidentialClientApplication(msalConfig);

router.get('/login', async (req, res) => {
  const redirectUri = (process.env.AZ_REDIRECT_URI || 'http://localhost:4000/api/auth/callback');
  const authCodeUrlParameters = {
    scopes: ['openid','profile','offline_access'],
    redirectUri
  };
  try{
    const authUrl = await cca.getAuthCodeUrl(authCodeUrlParameters);
    res.redirect(authUrl);
  }catch(e){ res.status(500).json({ error: e.message }); }
});

router.get('/callback', async (req, res) => {
  const tokenRequest = {
    code: req.query.code,
    scopes: ['openid','profile','offline_access'],
    redirectUri: (process.env.AZ_REDIRECT_URI || 'http://localhost:4000/api/auth/callback')
  };
  try{
    const response = await cca.acquireTokenByCode(tokenRequest);
    // In production, set a secure cookie or session; here return JSON for demo
    res.json(response);
  }catch(e){ res.status(500).json({ error: e.message }); }
});

router.get('/whoami', (req, res)=>{
  if (!req.user) return res.status(401).json({ error: 'unauthenticated' });
  res.json({ user: req.user });
});

module.exports = router;
