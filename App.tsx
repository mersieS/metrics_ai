
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MapVisualization } from './components/MapVisualization';
import { Auth } from './components/Auth';
import { IntegrationHelper } from './components/IntegrationHelper';
import { ViewMode, MapRegion } from './types';
import { fetchDashboardData } from './services/dataService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [mapRegion, setMapRegion] = useState<MapRegion>(MapRegion.WORLD);
  const [geoData, setGeoData] = useState<any[]>([]);
  
  // Settings State
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  // Check auth on mount
  useEffect(() => {
    const user = localStorage.getItem('METRIX_USER');
    if (user) {
      setIsAuthenticated(true);
    }

    // Load settings
    setApiUrl(localStorage.getItem('METRIX_API_URL') || '');
    setApiKey(localStorage.getItem('METRIX_API_KEY') || '');

    // Fetch initial data for map
    const loadData = async () => {
        const { data } = await fetchDashboardData();
        setGeoData(data.geoData);
    };
    loadData();
  }, [isAuthenticated]); // Reload map data when auth changes/settings might change

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('METRIX_USER');
    setIsAuthenticated(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('METRIX_API_URL', apiUrl);
    localStorage.setItem('METRIX_API_KEY', apiKey);
    alert("Ayarlar kaydedildi! Panel şimdi bu adresten veri çekmeyi deneyecek.");
    window.location.reload(); // Reload to refresh services
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewMode.DASHBOARD:
        return <Dashboard />;
      case ViewMode.MAPS:
        return (
          <div className="p-6 h-screen flex flex-col animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Canlı Coğrafi İzleme</h1>
                <p className="text-slate-400 text-sm">Kullanıcıların anlık coğrafi dağılımı</p>
              </div>
              <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button
                  onClick={() => setMapRegion(MapRegion.WORLD)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    mapRegion === MapRegion.WORLD 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dünya
                </button>
                <button
                  onClick={() => setMapRegion(MapRegion.TURKEY)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    mapRegion === MapRegion.TURKEY 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Türkiye
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
               {/* Map Component with Error Handling or Loading State if needed internally */}
               <MapVisualization region={mapRegion} data={geoData} />
            </div>
          </div>
        );
      case ViewMode.INTEGRATION:
          return <IntegrationHelper />;
      case ViewMode.SETTINGS:
        return (
          <div className="p-6 max-w-2xl mx-auto animate-in fade-in duration-500">
             <h1 className="text-2xl font-bold text-white mb-6">Bağlantı Ayarları</h1>
             <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-6 shadow-xl">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Veri Kaynağı URL (API Endpoint)</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                            placeholder="https://api.siteniz.com/api/metrix-data" 
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Entegrasyon sayfasında oluşturduğunuz backend endpoint adresi.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">API Gizli Anahtarı (Opsiyonel)</label>
                    <input 
                        type="password" 
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                        placeholder="Sisteminizin Bearer token'ı" 
                    />
                    <p className="text-xs text-slate-500 mt-2">Eğer API'niz yetkilendirme gerektiriyorsa buraya girin.</p>
                </div>
                <div className="pt-4">
                    <button 
                        onClick={handleSaveSettings}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
                    >
                        Ayarları Kaydet ve Bağlan
                    </button>
                </div>
             </div>
             
             <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <h4 className="text-yellow-500 font-semibold mb-1 text-sm">Sorun Giderme</h4>
                <p className="text-sm text-yellow-200/70 leading-relaxed">
                    Verileri çekerken hata alıyorsanız:
                    <br/>1. API adresinizin doğru olduğundan emin olun.
                    <br/>2. Backend tarafında <b>CORS</b> izinlerinin verildiğinden emin olun.
                    <br/>3. Entegrasyon sayfasındaki JSON formatına sadık kalın.
                </p>
             </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-sans">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto bg-slate-900/50 relative">
        {/* Top Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50"></div>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
