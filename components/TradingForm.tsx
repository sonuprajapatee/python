import React, { useState } from 'react';
import { OrderRequest, OrderSide, OrderType } from '../types';
import { RefreshCw, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface TradingFormProps {
  onSubmit: (order: OrderRequest) => Promise<void>;
  isProcessing: boolean;
}

const TradingForm: React.FC<TradingFormProps> = ({ onSubmit, isProcessing }) => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<OrderSide>(OrderSide.BUY);
  const [type, setType] = useState<OrderType>(OrderType.LIMIT);
  const [price, setPrice] = useState<string>('42000.50');
  const [quantity, setQuantity] = useState<string>('0.005');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseFloat(quantity);
    const priceNum = parseFloat(price);
    
    // Basic browser-side validation (simulating CLI args validation)
    if (!symbol) return;
    if (isNaN(qtyNum) || qtyNum <= 0) return;
    if (type === OrderType.LIMIT && (isNaN(priceNum) || priceNum <= 0)) return;

    onSubmit({
      symbol: symbol.toUpperCase(),
      side,
      type,
      quantity: qtyNum,
      price: type === OrderType.LIMIT ? priceNum : undefined
    });
  };

  return (
    <div className="bg-[#1E2329] rounded-lg p-5 border border-gray-800 shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-100">Place Order</h2>
        <div className="flex items-center gap-2 text-xs text-gray-500">
           <Wallet className="w-3 h-3" />
           <span>Available: 10,000.00 USDT</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6 p-1 bg-[#0b0e11] rounded-lg">
        <button
          onClick={() => setSide(OrderSide.BUY)}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${
            side === OrderSide.BUY 
              ? 'bg-binance-green text-white shadow-lg' 
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Buy / Long
        </button>
        <button
          onClick={() => setSide(OrderSide.SELL)}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${
            side === OrderSide.SELL 
              ? 'bg-binance-red text-white shadow-lg' 
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          Sell / Short
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 flex-1">
        
        {/* Type Selector */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Order Type</label>
          <div className="flex gap-2 text-xs">
            {[OrderType.LIMIT, OrderType.MARKET].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-4 py-1.5 rounded-full border transition-colors ${
                  type === t 
                    ? 'border-binance-yellow text-binance-yellow bg-binance-yellow/10' 
                    : 'border-gray-700 text-gray-500 hover:border-gray-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Symbol Input */}
        <div className="group">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Symbol</label>
          <div className="relative">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full bg-[#2B3139] border border-gray-700 text-gray-100 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:border-binance-yellow transition-colors placeholder-gray-600"
              placeholder="e.g. BTCUSDT"
            />
            <span className="absolute right-3 top-2.5 text-xs text-gray-500 font-bold pointer-events-none">PERP</span>
          </div>
        </div>

        {/* Price Input (Conditional) */}
        {type === OrderType.LIMIT && (
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Price (USDT)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-[#2B3139] border border-gray-700 text-gray-100 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:border-binance-yellow transition-colors font-mono"
            />
          </div>
        )}

        {/* Quantity Input */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Quantity ({symbol.replace('USDT', '')})</label>
          <input
            type="number"
            step="0.001"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-[#2B3139] border border-gray-700 text-gray-100 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:border-binance-yellow transition-colors font-mono"
          />
        </div>

        {/* Summary (Simulated) */}
        <div className="p-3 bg-[#0b0e11] rounded border border-dashed border-gray-700">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Est. Cost</span>
            <span className="text-gray-300 font-mono">
              {(parseFloat(quantity || '0') * (type === OrderType.LIMIT ? parseFloat(price || '0') : 42000)).toFixed(2)} USDT
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Commission (0.04%)</span>
            <span className="text-gray-300 font-mono">
              {((parseFloat(quantity || '0') * (type === OrderType.LIMIT ? parseFloat(price || '0') : 42000)) * 0.0004).toFixed(4)} USDT
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full py-3 rounded-md font-bold text-sm uppercase tracking-wide transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
            side === OrderSide.BUY 
              ? 'bg-binance-green hover:bg-emerald-400 text-white' 
              : 'bg-binance-red hover:bg-rose-500 text-white'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Processing...
            </div>
          ) : (
            `${side} ${symbol.replace('USDT', '')}`
          )}
        </button>
      </form>
    </div>
  );
};

export default TradingForm;