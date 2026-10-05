import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Visual branding left column (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 dark:bg-slate-950 flex-col justify-between p-12 overflow-hidden border-r border-slate-200 dark:border-slate-800 text-white">
        {/* Subtle grid lines in background */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="flex items-center gap-2 relative z-10">
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Business AI</span>
        </div>

        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Enterprise Suite
          </span>
          <h2 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight">
            Empower Your Enterprise <br />
            With <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Agentic AI</span>.
          </h2>
          <p className="text-slate-455 dark:text-slate-400 text-sm leading-relaxed">
            Seamlessly orchestrate inventory predictions, automatic tax invoice filing, expense categories, and smart multi-agent support bots.
          </p>
          <div className="flex gap-6 pt-4 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Saves 25+ Hours Weekly</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>GST Compliance Ready</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Business AI Assistant for Enterprises. All rights reserved.
        </div>
      </div>

      {/* Action right column (contains Clerk sign-in/up form) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-slate-50 dark:bg-slate-900/40 relative">
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Business AI</span>
        </div>

        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
