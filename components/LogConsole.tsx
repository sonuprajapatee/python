import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface LogConsoleProps {
  logs: LogEntry[];
}

const LogConsole: React.FC<LogConsoleProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getIcon = (level: string) => {
    switch (level) {
      case 'ERROR': return <AlertCircle className="w-3 h-3 text-binance-red" />;
      case 'WARNING': return <AlertCircle className="w-3 h-3 text-binance-yellow" />;
      case 'INFO': return <CheckCircle className="w-3 h-3 text-binance-green" />;
      default: return <Info className="w-3 h-3 text-blue-400" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-binance-red';
      case 'WARNING': return 'text-binance-yellow';
      case 'INFO': return 'text-binance-green';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1E2329] rounded-lg border border-gray-800 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-[#161a1e]">
        <Terminal className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-200">System Logs</h3>
        <span className="ml-auto text-xs text-gray-500 font-mono">live_tail -f production.log</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar font-mono text-xs">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-600">
            <span>No activity recorded. Ready to process orders.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="group">
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 whitespace-nowrap opacity-60">
                    {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })}
                  </span>
                  <div className="flex items-center gap-2 min-w-[70px]">
                    {getIcon(log.level)}
                    <span className={`font-bold ${getLevelColor(log.level)}`}>{log.level}</span>
                  </div>
                  <span className="text-gray-300 break-all">{log.message}</span>
                </div>
                {log.details && (
                  <div className="ml-[140px] mt-1 p-2 bg-[#0b0e11] rounded border border-gray-800 text-gray-400 whitespace-pre-wrap font-mono text-[10px]">
                    {log.details}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LogConsole;