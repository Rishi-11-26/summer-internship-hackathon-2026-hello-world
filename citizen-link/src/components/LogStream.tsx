"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";

export type LogMessage = {
  id: string;
  agent: "Scrutinizer" | "Eligibility Auditor" | "Red-Teamer" | "Accessibility Architect" | "System";
  message: string;
  status: "pending" | "success" | "error" | "info";
};

export default function LogStream({ logs }: { logs: LogMessage[] }) {
  const getStatusColor = (status: LogMessage["status"]) => {
    switch (status) {
      case "success": return "text-green-400";
      case "error": return "text-red-400";
      case "pending": return "text-yellow-400 animate-pulse";
      default: return "text-blue-400";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      <div className="flex items-center px-4 py-3 bg-slate-800 border-b border-slate-700">
        <Terminal className="w-5 h-5 text-slate-400 mr-2" />
        <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Live Agent Stream</h3>
      </div>
      <div className="p-4 h-64 overflow-y-auto font-mono text-sm">
        <AnimatePresence>
          {logs.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-500 italic"
            >
              Waiting for agent orchestration to begin...
            </motion.p>
          ) : (
            logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-3"
              >
                <span className="font-bold text-slate-300">[{log.agent}]</span>
                <span className="mx-2 text-slate-500">›</span>
                <span className={`${getStatusColor(log.status)}`}>{log.message}</span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
