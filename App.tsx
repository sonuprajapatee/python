import React, { useState, useCallback } from 'react';
import TradingForm from './components/TradingForm';
import LogConsole from './components/LogConsole';
import OrderHistory from './components/OrderHistory';
import TradingChart from './components/TradingChart';
import { OrderRequest, OrderResponse, LogEntry } from './types';
import { placeOrder } from './services/mockApi';
import { Activity, Github, Settings, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      timestamp: new Date(),
      level: 'INFO',
      message: 'System initialized. Connected to Binance Futures Testnet (Simulated).',
    },
    {
      id: 'init-2',
      timestamp: new Date(),
      level: 'DEBUG',
      message: 'Loaded configuration from environment variables.',
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSymbol, setActiveSymbol] = useState('BTCUSDT');

  const addLog = useCallback((level: LogEntry['level'], message: string, details?: any) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      level,
      message,
      details: details ? JSON.stringify(details, null, 2) : undefined
    }]);
  }, []);

  const handleOrderSubmit = async (request: OrderRequest) => {
    setIsProcessing(true);
    setActiveSymbol(request.symbol);
    
    // Log Request
    addLog('INFO', `Sending ${request.side} order for ${request.quantity} ${request.symbol}...`, {
      endpoint: '/fapi/v1/order',
      params: request
    });

    try {
      const response = await placeOrder(request);
      
      // Log Success
      addLog('INFO', `Order placed successfully. ID: ${response.orderId}`, response);
      
      setOrders(prev => [...prev, response]);
    } catch (error: any) {
      // Log Error
      addLog('ERROR', `Order placement failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-binance-yellow selection:text-black">
      {/* Navbar */}
      <header className="bg-[#1E2329] border-b border-gray-800 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-binance-yellow rounded flex items-center justify-center">
            <Activity className="text-black w-5 h-5" />
          </div>
          <div>
            <h1 className="text-gray-100 font-bold text-lg leading-tight">BinanceBot<span className="text-binance-yellow">.py</span></h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Futures Testnet Interface</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
            <a href="#" className="text-gray-100 hover:text-binance-yellow transition-colors">Dashboard</a>
            <a href="#" className="hover:text-binance-yellow transition-colors">API Keys</a>
            <a href="#" className="hover:text-binance-yellow transition-colors">Documentation</a>
          </nav>
          <div className="h-6 w-px bg-gray-700 hidden md:block"></div>
          <div className="flex gap-4 text-gray-400">
            <button className="hover:text-white transition-colors"><Github className="w-5 h-5" /></button>
            <button className="hover:text-white transition-colors"><Settings className="w-5 h-5" /></button>
            <button className="text-binance-yellow"><Moon className="w-5 h-5 fill-current" /></button>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1920px] mx-auto w-full">
        
        {/* Left Column: Form (3 cols) */}
        <div className="lg:col-span-3 min-w-[300px]">
          <TradingForm onSubmit={handleOrderSubmit} isProcessing={isProcessing} />
        </div>

        {/* Middle Column: Chart & History (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <TradingChart symbol={activeSymbol} />
          <div className="flex-1 min-h-[300px]">
            <OrderHistory orders={orders} />
          </div>
        </div>

        {/* Right Column: Logs (3 cols) */}
        <div className="lg:col-span-3 min-w-[300px] h-[500px] lg:h-auto">
          <LogConsole logs={logs} />
        </div>

      </main>

      <footer className="border-t border-gray-800 bg-[#161a1e] py-4 text-center text-xs text-gray-600">
        <p>Binance Futures Testnet Trading Bot • Intern Assignment Submission • React Frontend Mock</p>
      </footer>
    </div>
  );
};

export default App;