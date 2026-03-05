
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ShieldAlert, ShieldCheck, Info, Activity, Database, Lock, Unlock, Eye, EyeOff, AlertTriangle, CheckCircle2, XCircle, Search, RefreshCw, BookOpen, Microscope, Target, Lightbulb, Wand2, ArrowRight, Copy } from 'lucide-react';
import { analyzePassword, checkHIBP, strengthenPassword, AnalysisResult } from '../utils/analyzer';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [breachStatus, setBreachStatus] = useState<{ isBreached: boolean; count: number; loading: boolean } | null>(null);
  const [isCheckingBreach, setIsCheckingBreach] = useState(false);
  const [activeTab, setActiveTab] = useState<'analyzer' | 'research'>('analyzer');
  const [strengthened, setStrengthened] = useState<{ suggestions: string[]; strongerVersion: string } | null>(null);

  useEffect(() => {
    const result = analyzePassword(password);
    setAnalysis(result);
    setBreachStatus(null);
    setStrengthened(null);
  }, [password]);

  const handleCheckBreach = async () => {
    if (!password) return;
    setIsCheckingBreach(true);
    const result = await checkHIBP(password);
    setBreachStatus({ ...result, loading: false });
    setIsCheckingBreach(false);
  };

  const handleStrengthen = () => {
    const result = strengthenPassword(password);
    setStrengthened(result);
  };

  const getScoreColor = (score: number) => {
    if (score > 75) return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
    if (score > 50) return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    if (score > 25) return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
    return 'text-rose-400 border-rose-400/30 bg-rose-400/10';
  };

  const getScoreBarColor = (score: number) => {
    if (score > 75) return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]';
    if (score > 50) return 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]';
    if (score > 25) return 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
    return 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E3E0] font-mono selection:bg-emerald-500/30 p-4 md:p-8">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-5" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Science Fair Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1A1A1C] pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight uppercase">Password <span className="text-emerald-400">Strengthener</span></h1>
                <p className="text-[10px] text-[#8E9299] uppercase tracking-[0.2em] font-bold">Our Lady of Mt. Carmel Maryhill Girls High School</p>
              </div>
            </div>
          </div>
          
          <nav className="flex bg-[#151619] border border-[#1A1A1C] p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('analyzer')}
              className={cn(
                "px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-md transition-all flex items-center gap-2",
                activeTab === 'analyzer' ? "bg-emerald-500 text-black" : "text-[#8E9299] hover:text-[#E4E3E0]"
              )}
            >
              <Activity className="w-3 h-3" />
              Analyzer
            </button>
            <button 
              onClick={() => setActiveTab('research')}
              className={cn(
                "px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-md transition-all flex items-center gap-2",
                activeTab === 'research' ? "bg-emerald-500 text-black" : "text-[#8E9299] hover:text-[#E4E3E0]"
              )}
            >
              <BookOpen className="w-3 h-3" />
              Research
            </button>
          </nav>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'analyzer' ? (
            <motion.div 
              key="analyzer"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              {/* Main Input Card */}
              <section className="bg-[#151619] border border-[#1A1A1C] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Lock className="w-32 h-32" />
                </div>

                <div className="relative z-10">
                  <div className="relative mb-8">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Type a password to analyze..."
                      className="w-full bg-[#0A0A0B] border border-[#1A1A1C] rounded-xl py-5 px-6 pr-24 text-2xl tracking-wider focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-[#3A3A3C]"
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-2 bg-[#151619] border border-[#1A1A1C] rounded-lg text-[10px] font-bold uppercase tracking-widest text-[#8E9299] hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                    >
                      {showPassword ? (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" />
                          Show
                        </>
                      )}
                    </button>
                  </div>

                  {/* Strength Visualization */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-widest text-[#8E9299]">Security Score</span>
                      <div className={cn("text-3xl font-bold", analysis ? getScoreColor(analysis.score).split(' ')[0] : "text-[#8E9299]")}>
                        {analysis ? Math.round(analysis.score) : 0}%
                      </div>
                      <div className="h-1.5 w-full bg-[#0A0A0B] rounded-full overflow-hidden border border-[#1A1A1C]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${analysis?.score || 0}%` }}
                          className={cn("h-full transition-all duration-500", analysis ? getScoreBarColor(analysis.score) : "bg-[#1A1A1C]")}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-widest text-[#8E9299]">Entropy (Math)</span>
                      <div className="text-3xl font-bold text-blue-400">{analysis?.entropy.toFixed(1) || '0.0'}</div>
                      <p className="text-[10px] text-[#3A3A3C] uppercase">Bits of Randomness</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-widest text-[#8E9299]">Cracking Time</span>
                      <div className="text-3xl font-bold text-amber-400">{analysis?.crackTime || 'N/A'}</div>
                      <p className="text-[10px] text-[#3A3A3C] uppercase">Brute Force Estimate</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <button
                      onClick={handleStrengthen}
                      disabled={!password}
                      className="flex-1 py-4 bg-emerald-500 text-black rounded-xl font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Wand2 className="w-5 h-5" />
                      Strengthen Password
                    </button>
                    <button
                      onClick={handleCheckBreach}
                      disabled={!password || isCheckingBreach}
                      className="flex-1 py-4 bg-[#0A0A0B] border border-[#1A1A1C] text-rose-400 rounded-xl font-bold uppercase tracking-widest hover:bg-rose-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isCheckingBreach ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
                      Check Data Breaches
                    </button>
                  </div>
                </div>
              </section>

              {/* Results Section */}
              <AnimatePresence>
                {(strengthened || breachStatus || (analysis && analysis.patterns.length > 0)) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    {/* Strengthening Results */}
                    {strengthened && (
                      <section className="bg-[#151619] border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                          <Wand2 className="w-4 h-4 text-emerald-400" />
                          <h3 className="text-[10px] uppercase tracking-widest text-[#8E9299] font-bold">Strengthening Suggestions</h3>
                        </div>
                        <div className="space-y-4">
                          {strengthened.suggestions.map((s, i) => (
                            <div key={i} className="flex items-start gap-3 text-xs text-[#8E9299]">
                              <ArrowRight className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                              {s}
                            </div>
                          ))}
                          <div className="mt-6 p-4 bg-[#0A0A0B] border border-emerald-500/20 rounded-xl">
                            <span className="text-[10px] uppercase tracking-widest text-[#3A3A3C] mb-2 block">Stronger Version</span>
                            <div className="flex items-center justify-between gap-4">
                              <code className="text-emerald-400 text-lg break-all">{strengthened.strongerVersion}</code>
                              <button 
                                onClick={() => navigator.clipboard.writeText(strengthened.strongerVersion)}
                                className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors text-emerald-400"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </section>
                    )}

                    {/* Security Alerts */}
                    {(breachStatus || (analysis && analysis.patterns.length > 0)) && (
                      <section className="bg-[#151619] border border-rose-500/20 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                          <h3 className="text-[10px] uppercase tracking-widest text-[#8E9299] font-bold">Security Vulnerabilities</h3>
                        </div>
                        <div className="space-y-4">
                          {breachStatus?.isBreached && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-3">
                              <Database className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                              <p className="text-xs text-rose-400">Found in {breachStatus.count.toLocaleString()} data breaches. <strong>Stop using this!</strong></p>
                            </div>
                          )}
                          {analysis?.patterns.map((p, i) => (
                            <div key={i} className="flex items-start gap-3 text-xs text-rose-400/70">
                              <XCircle className="w-3 h-3 shrink-0 mt-0.5" />
                              {p}
                            </div>
                          ))}
                          {!breachStatus?.isBreached && analysis?.patterns.length === 0 && (
                            <div className="flex items-center gap-3 text-xs text-emerald-400/70">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              No structural weaknesses or breaches detected.
                            </div>
                          )}
                        </div>
                      </section>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              key="research"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Fundamental Principles */}
              <section className="bg-[#151619] border border-emerald-500/20 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-sm font-bold uppercase tracking-widest">Fundamental Principles</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Information Theory</h3>
                    <p className="text-[11px] text-[#8E9299] leading-relaxed">The study of quantifying, storing, and communicating digital information.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Cryptography</h3>
                    <p className="text-[11px] text-[#8E9299] leading-relaxed">The practice of secure communication in the presence of third parties.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">Pattern Recognition</h3>
                    <p className="text-[11px] text-[#8E9299] leading-relaxed">Identifying human-made sequences that reduce password complexity.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[10px] uppercase tracking-widest text-rose-400 font-bold">Shannon Entropy</h3>
                    <p className="text-[11px] text-[#8E9299] leading-relaxed">A mathematical measure that <strong>ensures unpredictability</strong> in data.</p>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Hypothesis */}
                <section className="bg-[#151619] border border-[#1A1A1C] rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-sm font-bold uppercase tracking-widest">Hypothesis</h2>
                  </div>
                  <p className="text-xs text-[#8E9299] leading-relaxed text-justify">
                    "Integrating <strong>Shannon Entropy</strong> calculations with <strong>Pattern Recognition</strong> heuristic penalties and hashed <strong>Cryptography</strong> verification will provide more accurate and realistic strength assessments than conventional entropy-only approaches."
                  </p>
                  <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                    <p className="text-[10px] text-emerald-400/80 leading-relaxed italic">
                      Translation: We believe that true security comes from combining mathematical randomness with an understanding of human behavior and known data breaches.
                    </p>
                  </div>
                </section>

                {/* Methodology */}
                <section className="bg-[#151619] border border-[#1A1A1C] rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Microscope className="w-5 h-5 text-blue-400" />
                    <h2 className="text-sm font-bold uppercase tracking-widest">Methodology</h2>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold shrink-0">1</div>
                      <p className="text-xs text-[#8E9299]">Calculate <strong>Shannon Entropy</strong> to measure bits of unpredictability.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold shrink-0">2</div>
                      <p className="text-xs text-[#8E9299]">Apply <strong>Pattern Recognition</strong> to detect common human sequences.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold shrink-0">3</div>
                      <p className="text-xs text-[#8E9299]">Use <strong>Cryptography</strong> (SHA-1 Hashing) for secure breach verification.</p>
                    </li>
                  </ul>
                </section>
              </div>

              {/* Results & Conclusion */}
              <section className="bg-[#151619] border border-[#1A1A1C] rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  <h2 className="text-sm font-bold uppercase tracking-widest">Results & Conclusion</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                  <div className="space-y-2">
                    <h3 className="text-[10px] uppercase tracking-widest text-[#E4E3E0] font-bold">Observation</h3>
                    <p className="text-xs text-[#8E9299] leading-relaxed">
                      Entropy-only models misclassified passwords like "1234567890" as strong.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[10px] uppercase tracking-widest text-[#E4E3E0] font-bold">Correction</h3>
                    <p className="text-xs text-[#8E9299] leading-relaxed">
                      Our algorithm effectively penalized these patterns, giving them a "Weak" score.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[10px] uppercase tracking-widest text-[#E4E3E0] font-bold">Final Verdict</h3>
                    <p className="text-xs text-[#8E9299] leading-relaxed">
                      Combining math with human behavior analysis creates a more reliable security tool.
                    </p>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[#1A1A1C] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-[#3A3A3C] uppercase tracking-[0.2em] font-bold">Our Lady of Mt. Carmel Maryhill Girls High School</span>
          </div>
          <div className="text-[10px] text-[#3A3A3C] uppercase tracking-widest">
            Science Fair 2026 • Cyber-Security Research
          </div>
        </footer>
      </div>
    </div>
  );
}
