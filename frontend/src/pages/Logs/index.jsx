import React from 'react';
import { useLogs } from '../../hooks/useLogs';
import { Terminal, RefreshCw } from 'lucide-react';

const Logs = () => {
  const { data: logs, isLoading, isError, refetch } = useLogs();

  const logList = Array.isArray(logs)
    ? logs
    : Array.isArray(logs?.data)
    ? logs.data
    : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-emerald-400" />
            System Logs
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time distributed cluster event logs</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm transition-colors border border-slate-700"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Logs
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-sm overflow-hidden">
        {isLoading ? (
          <div className="text-slate-400 py-8 text-center">Loading system logs...</div>
        ) : isError ? (
          <div className="text-rose-400 py-8 text-center">Failed to connect to log stream</div>
        ) : logList.length === 0 ? (
          <div className="text-slate-500 py-8 text-center">No log records found</div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {logList.map((log, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2 hover:bg-slate-800/50 rounded border-b border-slate-800/50">
                <span className="text-slate-500 text-xs shrink-0">{log.timestamp || new Date().toISOString()}</span>
                <span className={`px-2 py-0.5 rounded text-xs uppercase font-semibold shrink-0 ${
                  log.level === 'error' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  log.level === 'warn' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {log.level || 'INFO'}
                </span>
                <span className="text-slate-300 break-all">{log.message || JSON.stringify(log)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
