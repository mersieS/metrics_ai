
import { MetricData, EndpointStat, GeoLocation, DashboardData } from "../types";

// Mock Generators (Fallback - Only used if no API is connected to show demo)
const generateTimeSeriesData = (points: number): MetricData[] => {
  const data: MetricData[] = [];
  const now = new Date();
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const baseVisitors = 500 + Math.random() * 1000;
    const spike = Math.random() > 0.9 ? 2000 : 0;
    data.push({
      timestamp: time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      visitors: Math.floor(baseVisitors + spike),
      pageViews: Math.floor((baseVisitors + spike) * (1.5 + Math.random())),
      errors: Math.floor(Math.random() * 15),
      latency: Math.floor(100 + Math.random() * 200 + (spike ? 300 : 0)),
    });
  }
  return data;
};

const generateEndpointStats = (): EndpointStat[] => {
  return [
    { path: '/api/demo/users', calls: 120, avgLatency: 120, status: 200 },
    { path: '/api/demo/products', calls: 89, avgLatency: 145, status: 200 },
  ];
};

const generateGeoData = (): GeoLocation[] => {
  return [
    { city: 'Demo City', country: 'Turkey', lat: 41.0082, lng: 28.9784, users: 10 },
  ];
};

// Real Data Fetcher
export const fetchDashboardData = async (): Promise<{ data: DashboardData, isMock: boolean, isConnected: boolean }> => {
  const apiUrl = localStorage.getItem('METRIX_API_URL');
  const apiKey = localStorage.getItem('METRIX_API_KEY');

  if (apiUrl) {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      // Add a timestamp to prevent caching
      const safeUrl = apiUrl.includes('?') ? `${apiUrl}&_t=${Date.now()}` : `${apiUrl}?_t=${Date.now()}`;

      const response = await fetch(safeUrl, { headers });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const realData: DashboardData = await response.json();
      
      // Basic validation to ensure structure matches
      if (realData && Array.isArray(realData.metrics)) {
         return { data: realData, isMock: false, isConnected: true };
      } else {
        console.warn("API response structure is invalid (missing metrics array).");
        throw new Error("Invalid JSON structure");
      }
    } catch (error) {
      console.error("Failed to fetch from API:", error);
      // API configured but failed
      return {
        data: { metrics: [], endpoints: [], geoData: [] },
        isMock: false,
        isConnected: false 
      };
    }
  }

  // No API configured, return demo data for visual structure
  return {
    data: {
      metrics: generateTimeSeriesData(24),
      endpoints: generateEndpointStats(),
      geoData: generateGeoData()
    },
    isMock: true,
    isConnected: false
  };
};
