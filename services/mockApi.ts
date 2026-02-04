import { OrderRequest, OrderResponse, OrderStatus, OrderType, OrderSide } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const placeOrder = async (request: OrderRequest): Promise<OrderResponse> => {
  await delay(800 + Math.random() * 1000); // Random delay between 800ms and 1800ms

  // Basic validation simulation
  if (request.quantity <= 0) {
    throw new Error("APIError: Quantity must be greater than 0");
  }
  if (request.type === OrderType.LIMIT && (!request.price || request.price <= 0)) {
    throw new Error("APIError: Price is required for LIMIT orders");
  }

  // Mock response generation
  const isFilledImmediately = Math.random() > 0.3;
  const avgPrice = request.type === OrderType.MARKET 
    ? (Math.random() * 100 + 40000).toFixed(2) // Random execution price for Market
    : request.price?.toFixed(2) || "0.00";

  return {
    orderId: Math.floor(Math.random() * 1000000000),
    symbol: request.symbol.toUpperCase(),
    status: isFilledImmediately ? OrderStatus.FILLED : OrderStatus.NEW,
    clientOrderId: `web_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    price: request.price ? request.price.toFixed(2) : "0.00",
    avgPrice: isFilledImmediately ? avgPrice : "0.00",
    origQty: request.quantity.toFixed(3),
    executedQty: isFilledImmediately ? request.quantity.toFixed(3) : "0.000",
    cumQuote: isFilledImmediately ? (parseFloat(avgPrice) * request.quantity).toFixed(2) : "0.00",
    timeInForce: "GTC",
    type: request.type,
    side: request.side,
    updateTime: Date.now(),
  };
};

export const generateMockMarketData = (basePrice: number, points: number) => {
  const data = [];
  let currentPrice = basePrice;
  const now = new Date();
  
  for (let i = 0; i < points; i++) {
    const time = new Date(now.getTime() - (points - i) * 60000);
    const change = (Math.random() - 0.5) * (basePrice * 0.005);
    currentPrice += change;
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: parseFloat(currentPrice.toFixed(2))
    });
  }
  return data;
};