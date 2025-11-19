import React from 'react';
function parseFragment(hash){
  if (!hash) return {};
  const frag = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(frag.replace(/&+/g,'&'));
  const out = {};
  for (const [k,v] of params.entries()) out[k]=v;
  return out;
}

export default function AuthCallback(){
  React.useEffect(()=>{
    const data = parseFragment(window.location.hash);
    if (data.id_token) localStorage.setItem('id_token', data.id_token);
    if (data.access_token) localStorage.setItem('access_token', data.access_token);
    if (data.name) localStorage.setItem('user_name', decodeURIComponent(data.name));
    // simple redirect home after storing tokens
    window.location.href = '/';
  }, []);
  return (<div>Signing you in...</div>);
}
