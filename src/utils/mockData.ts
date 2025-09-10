// Mock data generator for portfolio showcase
export interface Metrics {
  cpu: { usage: number; cores: number; temperature: number };
  memory: { used: number; total: number; available: number };
  disk: { used: number; total: number; read: number; write: number };
  network: { bytesIn: number; bytesOut: number; connections: number };
  processes: Array<{ pid: number; name: string; cpu: number; memory: number; status: string }>;
}

export interface Alert {
  id: number;
  title: string;
  message: string;
  severity: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  message: string;
}

export interface ServerData {
  metrics: Metrics;
  history: any;
  alerts: Alert[];
  logs: LogEntry[];
}

class MockDataGenerator {
  private metrics: Metrics;
  private history: any;
  private alerts: Alert[];
  private logs: LogEntry[];
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
    this.metrics = this.generateInitialMetrics();
    this.history = {
      cpu: [],
      memory: [],
      disk: [],
      network: []
    };
    this.alerts = this.generateInitialAlerts();
    this.logs = this.generateInitialLogs();
    
    // Initialize history with some data points
    for (let i = 0; i < 50; i++) {
      this.updateHistory();
    }
  }

  private generateInitialMetrics(): Metrics {
    return {
      cpu: { usage: 45, cores: 8, temperature: 52 },
      memory: { used: 8192, total: 16384, available: 8192 },
      disk: { used: 250000, total: 500000, read: 25, write: 15 },
      network: { bytesIn: 1500000, bytesOut: 800000, connections: 127 },
      processes: this.generateProcesses()
    };
  }

  private generateProcesses() {
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

  private generateInitialAlerts(): Alert[] {
    const alerts = [];
    const alertTypes = [
      { title: 'High CPU Usage', message: 'CPU usage exceeded 80%', severity: 'warning' },
      { title: 'Memory Warning', message: 'Memory usage is approaching limits', severity: 'warning' },
      { title: 'Disk Space Low', message: 'Disk usage is above 85%', severity: 'error' },
      { title: 'Service Restart', message: 'MySQL service was automatically restarted', severity: 'info' },
      { title: 'Security Alert', message: 'Multiple failed login attempts detected', severity: 'error' }
    ];

    for (let i = 0; i < 12; i++) {
      const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      alerts.push({
        id: Date.now() + i,
        title: alertType.title,
        message: alertType.message,
        severity: alertType.severity,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        acknowledged: Math.random() > 0.6
      });
    }

    return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  private generateInitialLogs(): LogEntry[] {
    const logs = [];
    const logMessages = [
      'System health check completed successfully',
      'Backup process started for database',
      'Log rotation completed',
      'Security scan finished - no threats detected',
      'Database optimization complete',
      'Cache cleared successfully',
      'Service nginx reloaded',
      'Disk cleanup completed',
      'Memory optimization performed',
      'Network interface eth0 status: UP',
      'Firewall rules updated',
      'SSL certificate renewed',
      'User authentication successful',
      'Failed login attempt from 192.168.1.100',
      'System update available',
      'Monitoring agent started',
      'Performance metrics collected',
      'Alert threshold updated'
    ];

    const levels = ['INFO', 'WARNING', 'ERROR', 'DEBUG'];

    for (let i = 0; i < 200; i++) {
      const level = levels[Math.floor(Math.random() * levels.length)];
      const message = logMessages[Math.floor(Math.random() * logMessages.length)];
      
      logs.push({
        id: Date.now() + i,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
        level,
        message
      });
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  private updateHistory() {
    const now = Date.now();
    
    this.history.cpu.push({ time: now, value: this.metrics.cpu.usage });
    this.history.memory.push({ 
      time: now, 
      value: (this.metrics.memory.used / this.metrics.memory.total) * 100 
    });
    this.history.disk.push({ 
      time: now, 
      value: (this.metrics.disk.used / this.metrics.disk.total) * 100 
    });
    this.history.network.push({ 
      time: now, 
      in: this.metrics.network.bytesIn, 
      out: this.metrics.network.bytesOut 
    });

    // Keep only last 50 points
    Object.keys(this.history).forEach(key => {
      if (this.history[key].length > 50) {
        this.history[key] = this.history[key].slice(-50);
      }
    });
  }

  public generateRealisticMetrics(): ServerData {
    const time = Date.now();
    
    // CPU simulation with realistic patterns
    const baseLoad = 25 + Math.sin(time / 60000) * 15;
    this.metrics.cpu.usage = Math.max(5, Math.min(95, baseLoad + (Math.random() - 0.5) * 20));
    this.metrics.cpu.temperature = 45 + (this.metrics.cpu.usage / 100) * 30 + (Math.random() - 0.5) * 5;

    // Memory simulation
    const memoryTrend = 50 + Math.sin(time / 120000) * 20;
    this.metrics.memory.used = Math.max(2000, Math.min(15000, memoryTrend * 100 + (Math.random() - 0.5) * 1000));
    this.metrics.memory.available = this.metrics.memory.total - this.metrics.memory.used;

    // Disk simulation
    this.metrics.disk.used += Math.random() * 5;
    this.metrics.disk.read = Math.random() * 100;
    this.metrics.disk.write = Math.random() * 50;

    // Network simulation
    this.metrics.network.bytesIn += Math.random() * 1000000;
    this.metrics.network.bytesOut += Math.random() * 500000;
    this.metrics.network.connections = Math.floor(80 + Math.random() * 100);

    // Update processes
    this.metrics.processes = this.generateProcesses();

    // Update history
    this.updateHistory();

    // Occasionally add new alerts and logs
    if (Math.random() > 0.98) {
      this.addRandomAlert();
    }

    if (Math.random() > 0.95) {
      this.addRandomLog();
    }

    return {
      metrics: this.metrics,
      history: this.history,
      alerts: this.alerts.slice(0, 20),
      logs: this.logs.slice(0, 100)
    };
  }

  private addRandomAlert() {
    const alertTypes = [
      { title: 'Performance Alert', message: 'System performance degraded', severity: 'warning' },
      { title: 'Resource Usage', message: 'High resource utilization detected', severity: 'warning' },
      { title: 'Service Status', message: 'Service health check completed', severity: 'info' }
    ];

    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const newAlert = {
      id: Date.now() + Math.random(),
      title: alertType.title,
      message: alertType.message,
      severity: alertType.severity,
      timestamp: new Date().toISOString(),
      acknowledged: false
    };

    this.alerts.unshift(newAlert);
    this.alerts = this.alerts.slice(0, 50);
  }

  private addRandomLog() {
    const messages = [
      'System monitoring update completed',
      'Performance metrics collected',
      'Cache optimization performed',
      'Network connectivity verified'
    ];

    const levels = ['INFO', 'DEBUG'];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];

    const newLog = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      level,
      message
    };

    this.logs.unshift(newLog);
    this.logs = this.logs.slice(0, 500);
  }

  public acknowledgeAlert(alertId: number): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  public getOptimizationSuggestions() {
    const suggestions = [];
    
    if (this.metrics.cpu.usage > 70) {
      suggestions.push({
        type: 'cpu',
        priority: 'high',
        title: 'Optimize CPU Usage',
        description: 'CPU usage is elevated. Consider optimizing processes.',
        actions: ['Enable CPU scaling', 'Optimize process priorities', 'Review running services']
      });
    }

    if ((this.metrics.memory.used / this.metrics.memory.total) * 100 > 75) {
      suggestions.push({
        type: 'memory',
        priority: 'medium',
        title: 'Memory Optimization',
        description: 'Memory usage is approaching limits',
        actions: ['Clear system caches', 'Restart memory-intensive services', 'Consider adding more RAM']
      });
    }

    if (this.metrics.cpu.temperature > 65) {
      suggestions.push({
        type: 'cooling',
        priority: 'high',
        title: 'Temperature Management',
        description: 'CPU temperature is elevated',
        actions: ['Check cooling system', 'Clean dust from fans', 'Improve server room airflow']
      });
    }

    // Always show at least one suggestion for demo purposes
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'performance',
        priority: 'low',
        title: 'System Optimization',
        description: 'Your system is running well. Consider these improvements.',
        actions: ['Update system packages', 'Optimize startup services', 'Review security settings']
      });
    }

    return suggestions;
  }

  public updateThresholds(thresholds: any) {
    // Mock implementation - in real system this would update monitoring thresholds
    return { success: true, thresholds };
  }

  public getThresholds() {
    return {
      cpu: 80,
      memory: 85,
      disk: 90,
      temperature: 75
    };
  }
}

export const mockDataGenerator = new MockDataGenerator();