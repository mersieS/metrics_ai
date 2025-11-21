
import React, { useState, useEffect, useCallback } from 'react';
import { fetchDashboardData } from '../services/dataService';
import { analyzeMetrics } from '../services/geminiService';
import { MetricData, EndpointStat, AIInsight } from '../types';
import { TrafficChart, EndpointChart } from './MetricsCharts';
import { Activity, Users, Clock, AlertTriangle, Sparkles, RefreshCw, ServerOff, Wifi, PlugZap } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [endpointStats, setEndpointStats] = useState<EndpointStat[]>([]);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'mock' | 'disconnected'>('mock');

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
        const { data, isMock, isConnected } = await fetchDashboardData();
        
        if (isConnected) {
            setConnectionStatus('connected');
            setMetrics(data.metrics);
            setEndpointStats(data.endpoints);
        } else if (isMock) {
            setConnectionStatus('mock');
            setMetrics(data.metrics); // Show mock data only if absolutely no config
            setEndpointStats(data.endpoints);
        } else {
            setConnectionStatus('disconnected');
            setMetrics([]);
            setEndpointStats([]);
        }
        
        setLastUpdate(new Date());
    } catch (error) {
        console.error("Data refresh failed", error);
        setConnectionStatus('disconnected');
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 60000); // Auto refresh every minute
    return () => clearInterval(interval);
  }, [refreshData]);

  const handleAnalyze = async () => {
    if (metrics.length === 0) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeMetrics(metrics, endpointStats);
      setInsight(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Calculate totals
  const totalVisitors = metrics.reduce((acc, curr) => acc + curr.visitors, 0);
  const avgLatency = metrics.length > 0 
    ? Math.round(metrics.reduce((acc, curr) => acc + curr.latency, 0) / metrics.length)
    : 0;
  const totalErrors = metrics.reduce((acc, curr) => acc + curr.errors, 0);
  const liveVisitors = metrics.length > 0 ? metrics[metrics.length-1].visitors : 0;

  if (connectionStatus === 'disconnected') {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-red-500/10 p-6 rounded-full mb-6">
                  <ServerOff size={64} className="text-red-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Veri Bağlantısı Yok</h2>
              <p className="text-slate-400 max-w-md mb-8">
                  Yapılandırılmış API adresine ulaşılamadı veya geçersiz veri döndü. Lütfen entegrasyon ayarlarını kontrol edin.
              </p>
              <div className="flex gap-4">
                <button onClick={refreshData} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
                    Tekrar Dene
                </button>
                {/* Note: Navigation happens in parent, button here is decorative/state reset */}
              </div>
          </div>
      );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Sistem Genel Bakış
            {connectionStatus === 'mock' ? (
               <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1 font-mono">
                 <PlugZap size={12} /> DEMO MODU
               </span>
            ) : (
               <span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
                 <Wifi size={12} /> CANLI BAĞLANTI
               </span>
            )}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
              {connectionStatus === 'mock' 
                ? 'Şu an örnek veriler gösteriliyor. Gerçek veriler için Entegrasyon sayfasını ziyaret edin.' 
                : `Son güncelleme: ${lastUpdate.toLocaleTimeString()}`
              }
          </p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600 transition-colors text-sm font-medium disabled:opacity-50"
            >
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                {isLoading ? 'Yükleniyor...' : 'Yenile'}
            </button>
            <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || metrics.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isAnalyzing ? (
                   <span className="animate-pulse">Analiz Ediliyor...</span>
                ) : (
                   <>
                     <Sparkles size={16} />
                     Gemini AI Analizi
                   </>
                )}
            </button>
        </div>
      </div>

      {/* AI Insight Box */}
      {insight && (
        <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-6 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
              <Sparkles size={24} />
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-semibold text-white">Yapay Zeka Analiz Raporu</h3>
              <p className="text-slate-200 leading-relaxed">{insight.summary}</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {insight.anomalies.length > 0 && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                        <h4 className="text-red-300 text-sm font-bold mb-2 flex items-center gap-2">
                            <AlertTriangle size={14} /> Tespit Edilen Sorunlar
                        </h4>
                        <ul className="list-disc list-inside text-xs text-red-200/80 space-y-1">
                            {insight.anomalies.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                    </div>
                )}
                {insight.recommendations.length > 0 && (
                    <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3">
                        <h4 className="text-emerald-300 text-sm font-bold mb-2 flex items-center gap-2">
                            <Activity size={14} /> İyileştirme Önerileri
                        </h4>
                        <ul className="list-disc list-inside text-xs text-emerald-200/80 space-y-1">
                            {insight.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Toplam Ziyaretçi" value={totalVisitors.toLocaleString()} icon={Users} color="text-indigo-400" trend="+12.5%" />
        <StatCard title="Ort. Latency" value={`${avgLatency}ms`} icon={Clock} color="text-emerald-400" trend="-5ms" />
        <StatCard title="Toplam Hata" value={totalErrors.toString()} icon={AlertTriangle} color="text-red-400" trend="+2" />
        <StatCard title="Canlı Trafik" value={liveVisitors.toString()} icon={Activity} color="text-blue-400" trend="Stabil" />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-sm min-h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-4">Trafik Analizi (24s)</h3>
          {metrics.length > 0 ? <TrafficChart data={metrics} /> : <div className="h-full flex items-center justify-center text-slate-500">Veri yok</div>}
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-sm min-h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-4">Endpoint Performansı</h3>
           {endpointStats.length > 0 ? <EndpointChart data={endpointStats} /> : <div className="h-full flex items-center justify-center text-slate-500">Veri yok</div>}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-sm hover:border-slate-600 transition-all group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-white">{value}</h4>
      </div>
      <div className={`p-2 rounded-lg bg-slate-700/50 group-hover:bg-slate-700 transition-colors ${color}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs">
      <span className={`font-medium ${trend.includes('+') ? 'text-emerald-400' : trend.includes('-') ? 'text-red-400' : 'text-slate-400'}`}>
        {trend}
      </span>
      <span className="text-slate-500 ml-2">geçen saate göre</span>
    </div>
  </div>
);
