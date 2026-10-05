import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import AuthLayout from '../layouts/AuthLayout';

const SignUpPage = () => {
  return (
    <AuthLayout>
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        appearance={{
          variables: {
            colorPrimary: '#2563eb',
            colorBackground: '#1e293b',
            colorText: '#ffffff',
            colorInputBackground: '#0f172a',
            colorInputText: '#ffffff',
            colorTextSecondary: '#94a3b8',
          },
          elements: {
            card: 'bg-transparent border-0 shadow-none p-0',
            headerTitle: 'text-white font-bold text-2xl',
            headerSubtitle: 'text-slate-400 text-xs',
            socialButtonsBlockButton: 'bg-slate-800 hover:bg-slate-750 text-white border border-slate-700',
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 text-xs py-2.5 rounded-xl',
            footerActionLink: 'text-blue-400 hover:text-blue-300 font-semibold',
            formFieldLabel: 'text-xs font-semibold text-slate-400',
            formFieldInput: 'bg-slate-950 border-slate-800 rounded-xl text-xs py-2.5',
            dividerText: 'text-slate-500 text-[10px]',
            dividerLine: 'bg-slate-800',
          }
        }}
      />
    </AuthLayout>
  );
};

export default SignUpPage;
