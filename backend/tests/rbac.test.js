const request = require('supertest');
const express = require('express');
const rbac = require('../middleware/rbac');

describe('RBAC middleware', ()=>{
  let app;
  beforeAll(()=>{
    app = express();
    app.get('/open', rbac([]), (req,res)=> res.json({ok:true}));
    app.get('/admin', (req,res,next)=>{ req.user={roles:['user']}; next(); }, rbac(['admin']), (req,res)=> res.json({ok:true}));
  });

  test('open route allowed', async ()=>{
    const res = await request(app).get('/open');
    expect(res.status).toBe(200);
  });

  test('admin route forbidden for non-admin', async ()=>{
    const res = await request(app).get('/admin');
    expect(res.status).toBe(403);
  });
});
