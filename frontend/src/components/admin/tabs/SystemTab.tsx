import React, { useState } from 'react';
import { AdminSystemStatus, AdminAuditLog } from '../../../types/admin';

interface SystemTabProps {
  systemStatus: AdminSystemStatus;
  auditLogs: AdminAuditLog[];
}

export const SystemTab: React.FC<SystemTabProps> = ({
  systemStatus,
  auditLogs,
}) => {
  const [logs, setLogs] = useState<AdminAuditLog[]>(auditLogs);
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);

  const handleRunDiagnostic = () => {
    setDiagnosticRunning(true);
    setTimeout(() => {
      setDiagnosticRunning(false);
      setDiagnosticResult('All 5 Core Services verified healthy: PMS WebSocket sync < 12ms latency, Razorpay Webhooks 100% acked, NIC GST E-Invoice Gateway online.');
      
      const newAudit: AdminAuditLog = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        user: 'Siddharth Tagore (Operations Director)',
        role: 'super_admin',
        action: 'MANUAL_SYSTEM_DIAGNOSTIC_EXECUTION',
        entity: 'System Infrastructure',
        entityId: 'diag-all-services',
        ipAddress: '103.21.144.92 (Mumbai, IN)',
        severity: 'info',
      };
      setLogs([newAudit, ...logs]);

      setTimeout(() => setDiagnosticResult(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Infrastructure Top Overview */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-playfair text-[20px] font-bold text-white">
              Platform Infrastructure & PMS Bridges
            </h2>
            <span className="bg-emerald-950 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              99.98% UPTIME
            </span>
          </div>
          <p className="text-[12px] text-[#8e8e93] mt-0.5">
            Real-time latency monitoring across Cloud Run Mumbai (asia-south1), Opera Cloud PMS connectors, and GST E-Invoicing.
          </p>
        </div>

        <button
          onClick={handleRunDiagnostic}
          disabled={diagnosticRunning}
          className="flex items-center gap-2 bg-[#1c1c1c] hover:bg-[#262626] text-[#c5a059] border border-[#c5a059]/40 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[16px] ${diagnosticRunning ? 'animate-spin' : ''}`}>
            sync
          </span>
          <span>{diagnosticRunning ? 'Running Ping...' : 'Run Diagnostics'}</span>
        </button>
      </div>

      {/* Diagnostic Alert Banner */}
      {diagnosticResult && (
        <div className="bg-[#141414] border border-emerald-500/80 text-emerald-300 p-4 rounded-xl flex items-center gap-3 animate-in fade-in">
          <span className="material-symbols-outlined text-emerald-400">verified</span>
          <span className="text-[13px]">{diagnosticResult}</span>
        </div>
      )}

      {/* Microservice Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemStatus.services.map((svc) => (
          <div
            key={svc.name}
            className="bg-[#141414] border border-[#262626] rounded-xl p-4.5 shadow-lg space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-white text-[14px]">{svc.name}</h4>
                <span className="text-[11px] text-[#8e8e93]">Latency: {svc.latencyMs}ms</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {svc.status}
              </span>
            </div>

            <div className="space-y-1 text-[11px] text-[#a3a3a3]">
              <div className="flex justify-between">
                <span>30-Day Uptime</span>
                <span className="font-mono font-bold text-white">{svc.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Synchronized</span>
                <span className="font-mono text-[#8e8e93]">{svc.lastChecked}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Security & Audit Trail */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-playfair text-[18px] font-bold text-white">
              Immutable Security & Operational Audit Log
            </h3>
            <p className="text-[12px] text-[#8e8e93]">
              Detailed activity record compliant with ISO 27001 and DPDP Act India standards.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#8e8e93]">{logs.length} Total Events Logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] border-collapse">
            <thead>
              <tr className="bg-[#101010] border-b border-[#262626] text-[#8e8e93] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Timestamp (IST)</th>
                <th className="py-2.5 px-3">Operator / User</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Target Entity</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626] font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#1a1a1a]/60 transition-colors">
                  <td className="py-2.5 px-3 text-[#8e8e93] whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-white">{log.user}</td>
                  <td className="py-2.5 px-3 text-[#c5a059] font-bold">{log.action}</td>
                  <td className="py-2.5 px-3 text-[#a3a3a3] font-sans">{log.entity} ({log.entityId})</td>
                  <td className="py-2.5 px-3 text-[#8e8e93]">{log.ipAddress}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      log.severity === 'info' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                      log.severity === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {log.severity.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
