"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck, FileText, ArrowRight, Activity, Info, AlertTriangle } from "lucide-react";
import LogStream, { LogMessage } from "@/components/LogStream";
type Lang = "English" | "Hindi" | "Telugu";

const translations = {
  English: {
    subtitle: "Secure, zero-hallucination access to government schemes powered by Multi-Agent AI.",
    profile: "Your Profile",
    income: "Annual Income (₹)",
    age: "Age",
    language: "Language",
    location: "Location / State",
    findSchemes: "Find Schemes",
    selectScheme: "Select a Government Scheme",
    analyze: "Analyze Eligibility",
    processing: "Agents Processing...",
    actionableSteps: "Actionable Steps"
  },
  Hindi: {
    subtitle: "मल्टी-एजेंट एआई द्वारा संचालित सरकारी योजनाओं तक सुरक्षित और सटीक पहुंच।",
    profile: "आपकी प्रोफ़ाइल",
    income: "वार्षिक आय (₹)",
    age: "आयु",
    language: "भाषा",
    location: "स्थान / राज्य",
    findSchemes: "योजनाएं खोजें",
    selectScheme: "एक सरकारी योजना चुनें",
    analyze: "पात्रता का विश्लेषण करें",
    processing: "एजेंट्स काम कर रहे हैं...",
    actionableSteps: "कार्रवाई योग्य कदम"
  },
  Telugu: {
    subtitle: "మల్టీ-ఏజెంట్ AI ద్వారా ఆధారితమైన ప్రభుత్వ పథకాలకు సురక్షిత ప్రాప్యత.",
    profile: "మీ ప్రొఫైల్",
    income: "వార్షిక ఆదాయం (₹)",
    age: "వయస్సు",
    language: "భాష",
    location: "స్థానం / రాష్ట్రం",
    findSchemes: "పథకాలను కనుగొనండి",
    selectScheme: "ప్రభుత్వ పథకాన్ని ఎంచుకోండి",
    analyze: "అర్హతను విశ్లేషించండి",
    processing: "ఏజెంట్లు పని చేస్తున్నారు...",
    actionableSteps: "ఆచరణాత్మక దశలు"
  }
};

export default function Home() {
  const [profile, setProfile] = useState({ income: "", age: "", location: "Telangana" });
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<Lang>("English");
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [result, setResult] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const t = translations[language];

  const startAnalysis = async () => {
    if (!query) return;
    setIsProcessing(true);
    setResult([]);
    setLogs([
      { id: "1", agent: "System", message: "Initializing multi-agent pipeline...", status: "info" }
    ]);

    try {
      const response = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, query, language }),
      });

      if (!response.body) throw new Error("No response body");
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          
          buffer = parts.pop() || "";
          
          for (const part of parts) {
            if (part.startsWith("data: ")) {
              const dataStr = part.replace("data: ", "").trim();
              if (!dataStr) continue;
              
              try {
                const data = JSON.parse(dataStr);
                if (data.type === "log") {
                  setLogs((prev) => [...prev, data.log]);
                } else if (data.type === "result") {
                  setResult(data.steps);
                }
              } catch (e) {
                console.error("Error parsing stream chunk", e, dataStr);
              }
            }
          }
        }
    } catch (error) {
      setLogs((prev) => [
        ...prev,
        { id: Date.now().toString(), agent: "System", message: "Failed to connect to backend APIs.", status: "error" }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Removed unused DocumentUpload handler

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col">

      {/* ═══════ HERO SECTION ═══════ */}
      <section id="hero" className="relative overflow-hidden">
        {/* Subtle gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/[0.07] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-10 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 mb-6 bg-blue-500/10 rounded-2xl ring-1 ring-blue-500/20"
          >
            <ShieldCheck className="w-8 h-8 text-blue-400 mr-2" />
            <span className="text-2xl font-bold tracking-tight text-white sm:text-3xl">T-Sahaya</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white max-w-3xl mx-auto"
          >
            Find Telangana Government Services in Seconds&mdash;
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> all in one place.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto"
          >
            No confusion, no waiting.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-3 text-sm text-slate-500 tracking-wide"
          >
            Built for Telangana citizens
          </motion.p>
        </div>
      </section>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 pb-12 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-400" />
                {t.profile}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">{t.income}</label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={profile.income}
                    onChange={(e) => setProfile({ ...profile, income: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t.age}</label>
                    <input
                      type="number"
                      placeholder="e.g. 25"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t.language}</label>
                    <select
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as Lang)}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Telugu">Telugu</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">{t.location}</label>
                  <input
                    type="text"
                    readOnly
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed outline-none transition-all"
                    value={profile.location}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2 text-blue-400" />
                {t.findSchemes}
              </h2>
              <div className="space-y-4">
                <select
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                >
                  <option value="" disabled>{t.selectScheme}</option>
                  <option value="Maha Lakshmi Scheme">Maha Lakshmi Scheme (Women/Free Bus)</option>
                  <option value="Rythu Bandhu">Rythu Bharosa / Rythu Bandhu (Farmers)</option>
                  <option value="Gruha Jyothi Scheme">Gruha Jyothi Scheme (Free Electricity)</option>
                  <option value="Telangana ePASS">Telangana ePASS (Inter, B.Tech, Degree Scholarships)</option>
                  <option value="Aasara Pensions">Aasara Pensions (Elderly/Widow/Disability)</option>
                  <option value="Kalyana Lakshmi">Kalyana Lakshmi / Shaadi Mubarak (Marriage)</option>
                  <option value="Aarogyasri">Rajiv Aarogyasri Scheme (Health Insurance)</option>
                  <option value="Dalit Bandhu">Telangana Dalit Bandhu (Dalit Empowerment)</option>
                  <option value="KCR Kit">KCR Kit / Amma Vodi (Maternity Support)</option>
                  <option value="Indiramma Indlu">Indiramma Indlu (Housing Scheme)</option>
                  <option value="Kanti Velugu">Kanti Velugu (Free Eye Checkups & Surgeries)</option>
                  <option value="CM Overseas Scholarship Scheme">CM Overseas Scholarship (Study Abroad for Minorities)</option>
                  <option value="Sheep Distribution Scheme (Golla Kuruma)">Golla Kuruma Sheep Distribution Scheme</option>
                  <option value="Nethannaku Cheyutha (Handloom Weavers)">Nethannaku Cheyutha (Handloom Weavers Saving Scheme)</option>
                </select>
                <button
                  onClick={startAnalysis}
                  disabled={isProcessing || !query}
                  className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
                >
                  {isProcessing ? t.processing : t.analyze}
                  {!isProcessing && <ArrowRight className="w-4 h-4 ml-2" />}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Results & Logs */}
          <div className="md:col-span-7 flex flex-col space-y-6">
            
            {/* Agent Logs */}
            <LogStream logs={logs} />

            {/* Final Results */}
            {result.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-b from-blue-900/40 to-slate-900 border border-blue-500/30 p-6 rounded-2xl shadow-2xl"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-blue-400" />
                  {t.actionableSteps}
                </h2>
                <div className="space-y-4 text-slate-300">
                  {result.map((step, idx) => (
                    <div key={idx} className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold mr-4 border border-blue-500/30">
                        {idx + 1}
                      </div>
                      <p className="pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>

      {/* ═══════ ABOUT / TRUST SECTION ═══════ */}
      <section id="about" className="max-w-4xl mx-auto w-full px-4 pt-10 pb-14 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8"
        >
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-400" />
            About This Website
          </h2>
          <p className="text-slate-400 leading-relaxed text-[15px]">
            This is a free, independent tool created to help Telangana citizens easily find government services. We are not affiliated with any government authority.
          </p>
          <p className="mt-3 text-slate-500 text-sm italic">
            Always verify details on official government websites.
          </p>
        </motion.div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8 text-center space-y-5">
          {/* Brand */}
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span className="text-lg font-bold text-white tracking-tight">T-Sahaya</span>
            <span className="text-slate-500 text-sm hidden sm:inline">— Telangana Services Navigator</span>
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Helping citizens quickly find government services without confusion.
          </p>

          {/* Disclaimer */}
          <div className="max-w-lg mx-auto bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-5 py-4 text-left">
            <p className="text-yellow-400/90 text-xs font-semibold flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Disclaimer
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              This is not an official government website. We do not provide any services directly. We only help you discover and navigate official resources.
            </p>
          </div>

          {/* Bottom line */}
          <div className="pt-3 border-t border-slate-800/60 space-y-1">
            <p className="text-slate-600 text-xs">
              Made for Telangana citizens
            </p>
            <p className="text-slate-600 text-xs">
              &copy; {new Date().getFullYear()} T-Sahaya. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
