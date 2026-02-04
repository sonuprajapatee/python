import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateMockMarketData } from '../services/mockApi';

interface TradingChartProps {
  symbol: string;
}

const TradingChart: React.FC<TradingChartProps> = ({ symbol }) => {
  // Memoize data to prevent regeneration on every render unless symbol changes
  const data = useMemo(() => {
    const basePrice = symbol.includes('ETH') ? 2200 : 42000;
    return generateMockMarketData(basePrice, 50);
  }, [symbol]);

  const isPositive = data[data.length - 1].price >= data[0].price;
  const color = isPositive ? '#0ECB81' : '#F6465D';

  return (
    <div className="h-64 w-full bg-[#1E2329] rounded-lg p-4 border border-gray-800 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Market Overview</h3>
          <div className="flex items-baseline gap-2">
             <span className="text-xl font-bold text-gray-100">{symbol} Perpetual</span>
             <span className={`text-sm font-medium ${isPositive ? 'text-binance-green' : 'text-binance-red'}`}>
               {data[data.length - 1].price.toLocaleString()}
             </span>
          </div>
        </div>
        <div className="flex gap-2">
           <span className="px-2 py-1 text-xs bg-gray-800 rounded text-gray-400">1H</span>
           <span className="px-2 py-1 text-xs bg-gray-700 rounded text-gray-200">4H</span>
           <span className="px-2 py-1 text-xs bg-gray-800 rounded text-gray-400">1D</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="75%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2B3139" />
          <XAxis 
            dataKey="time" 
            tick={{ fill: '#848E9C', fontSize: 10 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right" 
            tick={{ fill: '#848E9C', fontSize: 10 }} 
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1E2329', borderColor: '#474D57', borderRadius: '4px' }}
            itemStyle={{ color: '#EAECEF' }}
            labelStyle={{ color: '#848E9C', marginBottom: '4px' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TradingChart;