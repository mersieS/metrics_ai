import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { MetricData, EndpointStat } from '../types';

interface TrafficChartProps {
  data: MetricData[];
}

export const TrafficChart: React.FC<TrafficChartProps> = ({ data }) => {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
            itemStyle={{ color: '#e2e8f0' }}
          />
          <Area type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" name="Ziyaretçiler" />
          <Area type="monotone" dataKey="pageViews" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" name="Sayfa Gösterimi" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface EndpointChartProps {
  data: EndpointStat[];
}

export const EndpointChart: React.FC<EndpointChartProps> = ({ data }) => {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
          <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis dataKey="path" type="category" width={100} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip 
             cursor={{fill: '#334155', opacity: 0.2}}
             contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
          />
          <Bar dataKey="calls" name="İstek Sayısı" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#6366f1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};