const { spawn } = require('child_process');
const path = require('path');

function runTerraform(cmd, workDir, vars = {}, onOutput = ()=>{}){
  return new Promise((resolve, reject)=>{
    const args = [cmd];
    if (cmd === 'apply' || cmd === 'destroy') args.push('-auto-approve');
    Object.entries(vars).forEach(([k,v])=> args.push('-var', `${k}=${v}`));

    const proc = spawn('terraform', args, { cwd: workDir });
    proc.stdout.on('data', d=> onOutput(d.toString()));
    proc.stderr.on('data', d=> onOutput(d.toString()));
    proc.on('close', code => {
      if (code === 0) resolve({ code }); else reject(new Error(`terraform ${cmd} exited ${code}`));
    });
  });
}

module.exports = { runTerraform };
