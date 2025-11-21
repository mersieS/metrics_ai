
import React from 'react';
import { Copy, Terminal, CheckCircle, AlertCircle } from 'lucide-react';

export const IntegrationHelper: React.FC = () => {
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Kod kopyalandı!");
  };

  const jsonStructure = `{
  "metrics": [
    { 
      "timestamp": "14:30", 
      "visitors": 1200, 
      "pageViews": 3500, 
      "errors": 2, 
      "latency": 150 
    }
  ],
  "endpoints": [
    { "path": "/api/login", "calls": 120, "avgLatency": 200, "status": 200 }
  ],
  "geoData": [
    { "city": "Istanbul", "country": "Turkey", "lat": 41.0082, "lng": 28.9784, "users": 150 }
  ]
}`;

  const backendExample = `
// Node.js / Express Örneği
const express = require('express');
const cors = require('cors');
const app = express();

// ÖNEMLİ: Panelin veri çekebilmesi için CORS açık olmalı
app.use(cors()); 

// Bu endpointi MetriX paneline tanıtacaksınız
app.get('/api/metrix-data', async (req, res) => {
  
  // Veritabanınızdan gerçek verileri buraya toplayın
  // Örnek statik veri:
  const responseData = ${jsonStructure}

  res.json(responseData);
});

app.listen(3000);
`;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
           <Terminal className="text-indigo-500" />
           Sitenizi Bağlayın
        </h1>
        <p className="text-slate-400 mt-2">
            MetriX AI panelini kendi web sitenize bağlamak için aşağıdaki adımları izleyin. 
            Mantık basittir: Siteniz verileri toplar, MetriX bu verileri çeker ve görselleştirir.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Step 0: JSON Structure */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
             <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">1</div>
                    <h3 className="font-semibold text-white">Beklenen Veri Formatı (JSON)</h3>
                </div>
            </div>
            <div className="p-6">
                <p className="text-slate-400 text-sm mb-4">
                    API Endpoint'iniz tam olarak bu yapıda bir JSON döndürmelidir.
                </p>
                <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-xs text-orange-300 font-mono border border-slate-800">
                    <code>{jsonStructure}</code>
                </pre>
            </div>
        </div>

        {/* Step 1: Backend */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">2</div>
                    <h3 className="font-semibold text-white">Backend API Endpoint Oluşturma</h3>
                </div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-mono">Node.js Example</span>
            </div>
            <div className="p-6">
                <p className="text-slate-400 text-sm mb-4">
                    Mevcut Backend projenizde (Node.js, Python, PHP vb.) panelin veri çekebileceği bir GET endpoint oluşturun.
                </p>
                <div className="relative group">
                    <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => copyToClipboard(backendExample)} className="p-2 bg-slate-700 rounded hover:bg-slate-600 text-white" title="Kodu Kopyala">
                            <Copy size={16} />
                        </button>
                    </div>
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm text-indigo-300 font-mono border border-slate-800">
                        <code>{backendExample}</code>
                    </pre>
                </div>
            </div>
        </div>

        {/* Step 2: Connection */}
        <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/20 rounded-xl p-6 flex flex-col md:flex-row items-start gap-4">
            <div className="p-3 bg-emerald-600/20 rounded-lg text-emerald-400 shrink-0">
                <CheckCircle size={24} />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white">Son Adım: Bağlantıyı Kurun</h3>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                    Backend endpoint'inizi hazırladıktan sonra (örn: <code>https://api.siteniz.com/api/metrix-data</code>), 
                    sol menüden <b>Ayarlar</b> sayfasına gidin ve bu adresi kaydedin. Panel otomatik olarak o adrese istek atacak ve verileri grafiklere dökecektir.
                </p>
                <div className="mt-4 p-3 bg-slate-900/50 rounded border border-slate-700 flex items-start gap-2">
                    <AlertCircle size={16} className="text-yellow-500 mt-0.5" />
                    <p className="text-xs text-slate-400">
                        Not: Google Haritalar (Maps) özelliğinin çalışması için <code>geoData</code> dizisinin içinde şehir, enlem (lat) ve boylam (lng) verilerinin doğru geldiğinden emin olun.
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
