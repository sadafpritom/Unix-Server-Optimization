const express = require('express');
const WebSocket = require('ws');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Server metrics simulation
class ServerMonitor {
  constructor() {
    this.metrics = {
      cpu: { usage: 0, cores: 8, temperature: 45 },
      memory: { used: 0, total: 16384, available: 16384 },
      disk: { used: 0, total: 500000, read: 0, write: 0 },
      network: { bytesIn: 0, bytesOut: 0, connections: 0 },
      processes: []
    };
    this.alerts = [];
    this.logs = [];
    this.thresholds = {
      cpu: 80,
      memory: 85,
      disk: 90,
      temperature: 75
    };
    this.history = {
      cpu: [],
      memory: [],
      disk: [],
      network: []
    };
    this.startMonitoring();
  }

  generateRealisticMetrics() {
    const time = Date.now();
    
    // CPU simulation with realistic patterns
    const baseLoad = 15 + Math.sin(time / 60000) * 10; // Base load with daily pattern
    this.metrics.cpu.usage = Math.max(5, Math.min(95, baseLoad + (Math.random() - 0.5) * 20));
    this.metrics.cpu.temperature = 40 + (this.metrics.cpu.usage / 100) * 35 + (Math.random() - 0.5) * 5;

    // Memory simulation
    const memoryTrend = 40 + Math.sin(time / 120000) * 15;
    this.metrics.memory.used = Math.max(1000, Math.min(15000, memoryTrend + (Math.random() - 0.5) * 1000));
    this.metrics.memory.available = this.metrics.memory.total - this.metrics.memory.used;

    // Disk simulation
    this.metrics.disk.used += Math.random() * 10;
    this.metrics.disk.read = Math.random() * 100;
    this.metrics.disk.write = Math.random() * 50;

    // Network simulation
    this.metrics.network.bytesIn += Math.random() * 1000000;
    this.metrics.network.bytesOut += Math.random() * 500000;
    this.metrics.network.connections = Math.floor(50 + Math.random() * 200);

    // Generate processes
    this.metrics.processes = this.generateProcesses();

    // Store history
    this.updateHistory();

    // Check thresholds and generate alerts
    this.checkThresholds();
  }

  generateProcesses() {
    const processNames = ['nginx', 'mysql', 'redis', 'nodejs', 'apache', 'docker', 'systemd', 'ssh'];
    const processes = [];
    
    for (let i = 0; i < 8; i++) {
      processes.push({
        pid: 1000 + i,
        name: processNames[i],
        cpu: Math.random() * 15,
        memory: Math.random() * 500,
        status: Math.random() > 0.95 ? 'warning' : 'running'
      });
    }
    
    return processes;
  }

  updateHistory() {
    const now = Date.now();
    const maxHistory = 50;

    this.history.cpu.push({ time: now, value: this.metrics.cpu.usage });
    this.history.memory.push({ time: now, value: (this.metrics.memory.used / this.metrics.memory.total) * 100 });
    this.history.disk.push({ time: now, value: (this.metrics.disk.used / this.metrics.disk.total) * 100 });
    this.history.network.push({ time: now, in: this.metrics.network.bytesIn, out: this.metrics.network.bytesOut });

    // Keep only last 50 points
    Object.keys(this.history).forEach(key => {
      if (this.history[key].length > maxHistory) {
        this.history[key] = this.history[key].slice(-maxHistory);
      }
    });
  }

  checkThresholds() {
    const now = new Date().toISOString();
    
    if (this.metrics.cpu.usage > this.thresholds.cpu) {
      this.createAlert('High CPU Usage', `CPU usage is ${this.metrics.cpu.usage.toFixed(1)}%`, 'warning');
      this.executeOptimization('cpu');
    }

    if ((this.metrics.memory.used / this.metrics.memory.total) * 100 > this.thresholds.memory) {
      this.createAlert('High Memory Usage', `Memory usage is ${((this.metrics.memory.used / this.metrics.memory.total) * 100).toFixed(1)}%`, 'warning');
      this.executeOptimization('memory');
    }

    if (this.metrics.cpu.temperature > this.thresholds.temperature) {
      this.createAlert('High Temperature', `CPU temperature is ${this.metrics.cpu.temperature.toFixed(1)}°C`, 'error');
    }
  }

  createAlert(title, message, severity) {
    const alert = {
      id: Date.now(),
      title,
      message,
      severity,
      timestamp: new Date().toISOString(),
      acknowledged: false
    };
    
    this.alerts.unshift(alert);
    this.alerts = this.alerts.slice(0, 100); // Keep only last 100 alerts
    
    this.addLog(`ALERT: ${title} - ${message}`, severity.toUpperCase());
  }

  executeOptimization(type) {
    const actions = {
      cpu: ['Clearing system caches', 'Restarting high-CPU processes', 'Adjusting CPU governor'],
      memory: ['Clearing page cache', 'Restarting memory-intensive services', 'Running garbage collection'],
      disk: ['Cleaning temporary files', 'Compressing logs', 'Defragmenting disk']
    };

    const action = actions[type] ? actions[type][Math.floor(Math.random() * actions[type].length)] : 'Generic optimization';
    this.addLog(`OPTIMIZATION: ${action} for ${type} threshold breach`, 'INFO');
    
    // Simulate optimization effect
    setTimeout(() => {
      if (type === 'cpu') {
        this.metrics.cpu.usage *= 0.8; // Reduce CPU usage by 20%
      } else if (type === 'memory') {
        this.metrics.memory.used *= 0.9; // Reduce memory usage by 10%
      }
    }, 2000);
  }

  addLog(message, level = 'INFO') {
    const log = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      level,
      message
    };
    
    this.logs.unshift(log);
    this.logs = this.logs.slice(0, 1000); // Keep only last 1000 logs
  }

  startMonitoring() {
    // Update metrics every 2 seconds
    setInterval(() => {
      this.generateRealisticMetrics();
      this.broadcastMetrics();
    }, 2000);

    // Generate periodic logs
    setInterval(() => {
      const messages = [
        'System health check completed',
        'Backup process started',
        'Log rotation completed',
        'Security scan finished',
        'Database optimization complete'
      ];
      this.addLog(messages[Math.floor(Math.random() * messages.length)]);
    }, 10000);
  }

  broadcastMetrics() {
    if (global.wss) {
      const data = {
        metrics: this.metrics,
        history: this.history,
        alerts: this.alerts.slice(0, 10),
        logs: this.logs.slice(0, 50)
      };
      
      global.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  }

  getOptimizationSuggestions() {
    const suggestions = [];
    
    if (this.metrics.cpu.usage > 70) {
      suggestions.push({
        type: 'cpu',
        priority: 'high',
        title: 'Optimize CPU Usage',
        description: 'Consider upgrading CPU or optimizing high-usage processes',
        actions: ['Enable CPU scaling', 'Optimize process priorities', 'Add CPU cores']
      });
    }

    if ((this.metrics.memory.used / this.metrics.memory.total) * 100 > 75) {
      suggestions.push({
        type: 'memory',
        priority: 'medium',
        title: 'Memory Optimization',
        description: 'Memory usage is approaching limits',
        actions: ['Increase swap space', 'Add more RAM', 'Optimize memory-heavy applications']
      });
    }

    if (this.metrics.cpu.temperature > 65) {
      suggestions.push({
        type: 'cooling',
        priority: 'high',
        title: 'Temperature Management',
        description: 'CPU temperature is elevated',
        actions: ['Check cooling system', 'Clean dust from fans', 'Improve airflow']
      });
    }

    return suggestions;
  }
}

const monitor = new ServerMonitor();

// API Routes
app.get('/api/metrics', (req, res) => {
  res.json({
    metrics: monitor.metrics,
    history: monitor.history,
    alerts: monitor.alerts.slice(0, 10),
    logs: monitor.logs.slice(0, 50)
  });
});

app.get('/api/alerts', (req, res) => {
  res.json(monitor.alerts);
});

app.post('/api/alerts/:id/acknowledge', (req, res) => {
  const alertId = parseInt(req.params.id);
  const alert = monitor.alerts.find(a => a.id === alertId);
  if (alert) {
    alert.acknowledged = true;
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Alert not found' });
  }
});

app.get('/api/logs', (req, res) => {
  const { level, limit = 100 } = req.query;
  let logs = monitor.logs;
  
  if (level) {
    logs = logs.filter(log => log.level === level.toUpperCase());
  }
  
  res.json(logs.slice(0, parseInt(limit)));
});

app.get('/api/optimization-suggestions', (req, res) => {
  res.json(monitor.getOptimizationSuggestions());
});

app.post('/api/thresholds', (req, res) => {
  const { cpu, memory, disk, temperature } = req.body;
  
  if (cpu !== undefined) monitor.thresholds.cpu = cpu;
  if (memory !== undefined) monitor.thresholds.memory = memory;
  if (disk !== undefined) monitor.thresholds.disk = disk;
  if (temperature !== undefined) monitor.thresholds.temperature = temperature;
  
  res.json({ success: true, thresholds: monitor.thresholds });
});

app.get('/api/thresholds', (req, res) => {
  res.json(monitor.thresholds);
});

// WebSocket server
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });
global.wss = wss;

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  // Send initial data
  ws.send(JSON.stringify({
    metrics: monitor.metrics,
    history: monitor.history,
    alerts: monitor.alerts.slice(0, 10),
    logs: monitor.logs.slice(0, 50)
  }));

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

server.listen(port, () => {
  console.log(`Server monitoring system running on port ${port}`);
});