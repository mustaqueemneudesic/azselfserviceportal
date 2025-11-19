import React from 'react';
import { Box, Grid, Paper, Typography, List, ListItem } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import TerraformLogs from './TerraformLogs';

const donutData = [ {name:'DEV', value:40}, {name:'PROD', value:35}, {name:'UAT', value:25} ];
const barData = [ {name:'Jan', projects:3},{name:'Feb', projects:5},{name:'Mar', projects:2} ];
const COLORS = ['#8884d8','#82ca9d','#ffc658'];

function StatCard({title, subtitle}){
  return (
    <Paper sx={{ p:2 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2">{subtitle}</Typography>
    </Paper>
  );
}

export default function Dashboard(){
  return (
    <Box sx={{ p:3, overflow:'auto' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}><StatCard title="Projects" subtitle="12 active"/></Grid>
        <Grid item xs={12} md={3}><StatCard title="GCP" subtitle="$1,200"/></Grid>
        <Grid item xs={12} md={3}><StatCard title="Azure" subtitle="$4,200"/></Grid>
        <Grid item xs={12} md={3}><StatCard title="AWS" subtitle="$2,800"/></Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p:2, height:300 }}>
            <Typography variant="h6">Donut: Environments</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={donutData} dataKey="value" innerRadius={50} outerRadius={80} label>
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p:2, height:300 }}>
            <Typography variant="h6">Projects Created</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="projects" fill="#1976d2"/></BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p:2 }}>
            <Typography variant="h6">Pending Approvals</Typography>
            <List>
              <ListItem>Approval: Project Alpha</ListItem>
              <ListItem>Approval: Project Beta</ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <TerraformLogs />
        </Grid>
      </Grid>
    </Box>
  );
}
