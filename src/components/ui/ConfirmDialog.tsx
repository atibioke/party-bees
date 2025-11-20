'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialog {
  id: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ConfirmContextType {
  confirm: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  }) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [dialogs, setDialogs] = useState<ConfirmDialog[]>([]);

  const confirm = useCallback((options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      const id = Math.random().toString(36).substring(7);
      
      const dialog: ConfirmDialog = {
        id,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        onConfirm: () => {
          setDialogs((prev) => prev.filter((d) => d.id !== id));
          resolve(true);
        },
        onCancel: () => {
          setDialogs((prev) => prev.filter((d) => d.id !== id));
          resolve(false);
        },
      };

      setDialogs((prev) => [...prev, dialog]);
    });
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialogs.map((dialog) => (
        <ConfirmDialogItem key={dialog.id} dialog={dialog} />
      ))}
    </ConfirmContext.Provider>
  );
}

function ConfirmDialogItem({ dialog }: { dialog: ConfirmDialog }) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-full bg-yellow-500/10 border border-yellow-500/20 shrink-0">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">{dialog.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{dialog.message}</p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={dialog.onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors"
            >
              {dialog.cancelText}
            </button>
            <button
              onClick={dialog.onConfirm}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
            >
              {dialog.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return context;
}
