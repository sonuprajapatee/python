import React from 'react';
import { OrderResponse, OrderStatus, OrderSide } from '../types';

interface OrderHistoryProps {
  orders: OrderResponse[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  return (
    <div className="bg-[#1E2329] rounded-lg border border-gray-800 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-gray-200">Order History</h3>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#161a1e] text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Symbol</th>
              <th className="px-4 py-3 font-medium">Side</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500 text-xs">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.slice().reverse().map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(order.updateTime).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-200">
                    {order.symbol}
                  </td>
                  <td className={`px-4 py-3 font-medium ${order.side === OrderSide.BUY ? 'text-binance-green' : 'text-binance-red'}`}>
                    {order.side}
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-xs">
                    {order.type}
                  </td>
                  <td className="px-4 py-3 text-gray-300 font-mono text-xs">
                    {order.avgPrice && parseFloat(order.avgPrice) > 0 ? order.avgPrice : order.price}
                  </td>
                  <td className="px-4 py-3 text-gray-300 font-mono text-xs">
                    {order.origQty}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === OrderStatus.FILLED ? 'bg-binance-green/10 text-binance-green' :
                      order.status === OrderStatus.NEW ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;