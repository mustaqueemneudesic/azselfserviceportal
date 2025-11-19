const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const terraformRoutes = require('./routes/terraform');
const authRoutes = require('./routes/auth');
const db = require('./db');
const validateJwt = require('./middleware/validateJwt');

const app = express();
app.use(bodyParser.json());

// simple health
app.get('/api/health', (req, res)=> res.json({status:'ok'}));

// demo middleware to attach a user (replace with real Azure AD token validation)
// attach JWT validation middleware globally to `whoami` route, keep demo for other dev routes
app.use('/api/auth', authRoutes);
// health route
app.get('/api/health', (req, res)=> res.json({status:'ok'}));
app.use('/api/terraform', terraformRoutes);

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log(`Backend listening ${port}`));
