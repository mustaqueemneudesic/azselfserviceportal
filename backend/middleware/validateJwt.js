const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const tenant = process.env.AZ_TENANT_ID;
const audience = process.env.AZ_CLIENT_ID;

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${tenant}/discovery/v2.0/keys`
});

function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key){
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

module.exports = function(req, res, next){
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'missing_token' });
  const token = auth.slice(7);
  jwt.verify(token, getKey, { audience, issuer: `https://login.microsoftonline.com/${tenant}/v2.0` }, (err, decoded)=>{
    if (err) return res.status(401).json({ error: 'invalid_token', detail: err.message });
    req.user = req.user || {};
    // map common fields
    req.user.id = decoded.oid || decoded.sub;
    req.user.name = decoded.name || decoded.preferred_username;
    req.user.roles = decoded.roles || decoded['wids'] || [];
    req.auth = { token, decoded };
    next();
  });
};
