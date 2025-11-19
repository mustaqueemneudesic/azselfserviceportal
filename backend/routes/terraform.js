const express = require('express');
const router = express.Router();
const path = require('path');
const { runTerraform } = require('../terraformRunner');
const db = require('../db');
const validateJwt = require('../middleware/validateJwt');
const requireRole = require('../middleware/rbac');

const TERRAFORM_DIR = process.env.TERRAFORM_DIR || path.join(__dirname, '../../terraform');

router.post('/init', validateJwt, async (req, res) => {
  const workdir = path.join(TERRAFORM_DIR, req.body.provider || 'azure');
  try{
    await runTerraform('init', workdir, {}, (out)=> console.log(out));
    res.json({status:'ok'});
  }catch(e){ res.status(500).json({error: e.message}); }
});

router.post('/plan', validateJwt, async (req, res) => {
  const workdir = path.join(TERRAFORM_DIR, req.body.provider || 'azure');
  const vars = req.body.vars || {};
  try{
    let outBuffer = '';
    await runTerraform('plan', workdir, vars, (out)=> outBuffer += out);
    res.json({status:'planned', output: outBuffer});
  }catch(e){ res.status(500).json({error: e.message}); }
});

router.post('/apply', validateJwt, requireRole(['admin']), async (req, res) => {
  const workdir = path.join(TERRAFORM_DIR, req.body.provider || 'azure');
  const vars = req.body.vars || {};
  try{
    let outBuffer = '';
    await runTerraform('apply', workdir, vars, (out)=> outBuffer += out);
    // store audit log
    await db.query('INSERT INTO audit_logs(id, action, details) VALUES (gen_random_uuid(), $1, $2)', ['apply', outBuffer]).catch(()=>{});
    res.json({status:'applied', output: outBuffer});
  }catch(e){ res.status(500).json({error: e.message}); }
});

router.post('/destroy', validateJwt, requireRole(['admin']), async (req, res) => {
  const workdir = path.join(TERRAFORM_DIR, req.body.provider || 'azure');
  const vars = req.body.vars || {};
  try{
    let outBuffer = '';
    await runTerraform('destroy', workdir, vars, (out)=> outBuffer += out);
    await db.query('INSERT INTO audit_logs(id, action, details) VALUES (gen_random_uuid(), $1, $2)', ['destroy', outBuffer]).catch(()=>{});
    res.json({status:'destroyed', output: outBuffer});
  }catch(e){ res.status(500).json({error: e.message}); }
});

// SSE streaming endpoint: run terraform command and stream stdout/stderr
// POST streaming endpoint (keeps existing behavior for clients that prefer POST)
router.post('/stream', validateJwt, async (req, res) => {
  const { cmd = 'plan', provider = 'azure', vars = {} } = req.body;
  const workdir = path.join(TERRAFORM_DIR, provider);
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.write('\n');
  try{
    await runTerraform(cmd, workdir, vars, (out)=>{
      res.write(`data: ${out.replace(/\n/g,'\\n')}\n\n`);
    });
    res.write('event: done\ndata: ok\n\n');
    res.end();
  }catch(e){ res.write(`event: error\ndata: ${e.message}\n\n`); res.end(); }
});

// GET streaming endpoint allowing EventSource clients (query params)
router.get('/stream', validateJwt, async (req, res) => {
  const cmd = req.query.cmd || 'plan';
  const provider = req.query.provider || 'azure';
  // NOTE: vars passed as JSON-encoded `vars` query param (optional)
  let vars = {};
  if (req.query.vars) {
    try { vars = JSON.parse(req.query.vars); } catch(e) { vars = {}; }
  }

  const workdir = path.join(TERRAFORM_DIR, provider);
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.write('\n');

  try{
    await runTerraform(cmd, workdir, vars, (out)=>{
      // EventSource expects UTF-8 text with `data:` lines
      res.write(`data: ${out.replace(/\n/g,'\\n')}\n\n`);
    });
    res.write('event: done\ndata: ok\n\n');
    res.end();
  }catch(e){ res.write(`event: error\ndata: ${e.message}\n\n`); res.end(); }
});

module.exports = router;
