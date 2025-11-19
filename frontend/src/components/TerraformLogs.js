import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';

export default function TerraformLogs(){
  const [logs, setLogs] = React.useState('');
  const [running, setRunning] = React.useState(false);
  const esRef = React.useRef(null);

  function startStream(cmd = 'plan'){
    // Close existing
    stopStream();
    setLogs('');
    setRunning(true);
    // EventSource GET to backend stream endpoint
    const url = `/api/terraform/stream?cmd=${encodeURIComponent(cmd)}&provider=azure`;
    const es = new EventSource(url);
    esRef.current = es;
    es.onmessage = (e) => {
      // server sends newline-escaped data
      const text = e.data.replace(/\\n/g,'\n');
      setLogs(prev => prev + text);
    };
    es.addEventListener('done', ()=>{ setRunning(false); es.close(); });
    es.onerror = (err)=>{ setRunning(false); es.close(); setLogs(prev => prev + '\n[stream error]\n'); };
  }

  function stopStream(){
    if (esRef.current){ esRef.current.close(); esRef.current = null; }
    setRunning(false);
  }

  return (
    <Paper sx={{ p:2 }}>
      <Box sx={{ display:'flex', alignItems:'center', gap:2, mb:1 }}>
        <Typography variant="h6">Terraform Logs</Typography>
        <Button variant="contained" onClick={()=> startStream('plan')} disabled={running}>Start Plan</Button>
        <Button variant="contained" color="error" onClick={()=> startStream('destroy')} disabled={running}>Start Destroy</Button>
        <Button variant="outlined" onClick={stopStream} disabled={!running}>Stop</Button>
      </Box>
      <Box sx={{ whiteSpace:'pre-wrap', fontFamily:'monospace', maxHeight:300, overflow:'auto', background:'#0f1724', color:'#d1d5db', p:1 }}>
        {logs || 'No logs yet.'}
      </Box>
    </Paper>
  );
}
