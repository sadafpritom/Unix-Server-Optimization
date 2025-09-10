import React, { useEffect, useRef } from 'react';

interface ChartProps {
  data: any;
  metrics: string[];
  height: number;
  theme: string;
}

const Chart: React.FC<ChartProps> = ({ data, metrics, height, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const chartHeight = height - 60;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    
    // Clear canvas
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, width, height);

    const colors = {
      cpu: '#3B82F6',
      memory: '#10B981',
      disk: '#8B5CF6',
      network: '#F59E0B'
    };

    const metricLabels = {
      cpu: 'CPU %',
      memory: 'Memory %',
      disk: 'Disk %',
      network: 'Network KB/s'
    };

    // Draw grid
    ctx.strokeStyle = theme === 'dark' ? '#374151' : '#E5E7EB';
    ctx.lineWidth = 0.5;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight * i) / 5;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      
      // Y-axis labels
      ctx.fillStyle = theme === 'dark' ? '#9CA3AF' : '#6B7280';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${100 - (i * 20)}%`, padding.left - 10, y + 4);
    }

    // Draw metrics
    metrics.forEach((metric) => {
      if (!data[metric] || data[metric].length === 0) return;

      const points = data[metric];
      const color = colors[metric as keyof typeof colors];

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      points.forEach((point: any, index: number) => {
        let value = 0;
        
        if (metric === 'cpu') {
          value = point.value;
        } else if (metric === 'memory') {
          value = point.value;
        } else if (metric === 'disk') {
          value = point.value;
        } else if (metric === 'network') {
          value = Math.min(100, (point.in / 1000000) * 10); // Scale network data
        }

        const x = padding.left + ((width - padding.left - padding.right) * index) / (points.length - 1);
        const y = padding.top + chartHeight - (chartHeight * value) / 100;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Fill area under curve
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = color;
      ctx.lineTo(width - padding.right, padding.top + chartHeight);
      ctx.lineTo(padding.left, padding.top + chartHeight);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw legend
    const legendY = height - 25;
    let legendX = padding.left;
    
    metrics.forEach((metric) => {
      const color = colors[metric as keyof typeof colors];
      const label = metricLabels[metric as keyof typeof metricLabels];

      // Legend color box
      ctx.fillStyle = color;
      ctx.fillRect(legendX, legendY, 12, 12);

      // Legend text
      ctx.fillStyle = theme === 'dark' ? '#D1D5DB' : '#374151';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, legendX + 18, legendY + 9);

      legendX += ctx.measureText(label).width + 40;
    });

  }, [data, metrics, height, theme]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={height}
      className="w-full"
      style={{ height: `${height}px` }}
    />
  );
};

export default Chart;