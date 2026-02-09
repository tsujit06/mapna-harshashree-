'use client';

import { Phone } from 'lucide-react';

type SafeContact = {
  id: string;
  name: string;
  relation: string;
  phone: string;
};

interface EmergencyContactActionsProps {
  guardianPhone: string | null;
  secondaryPhone: string | null;
  contacts: SafeContact[];
}

export function EmergencyContactActions({
  guardianPhone,
  secondaryPhone,
  contacts,
}: EmergencyContactActionsProps) {
  const triggerGuardian = () => {
    if (!guardianPhone) return;
    window.location.href = `tel:${guardianPhone}`;
  };

  const triggerSecondary = () => {
    if (!secondaryPhone) return;
    window.location.href = `tel:${secondaryPhone}`;
  };

  return (
    <div className="space-y-3">
      {guardianPhone && (
        <button
          type="button"
          onClick={triggerGuardian}
          className="block w-full py-4 px-4 rounded-2xl bg-zinc-900/90 border border-zinc-700 hover:border-red-500 hover:bg-zinc-900 transition-colors active:scale-[0.98] text-left"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className="text-sm font-semibold">Call Guardian</div>
                <div className="text-[11px] text-zinc-400 uppercase tracking-[0.18em]">
                  Primary emergency contact
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-400">Tap to call (number hidden)</div>
            </div>
          </div>
        </button>
      )}

      {secondaryPhone && (
        <button
          type="button"
          onClick={triggerSecondary}
          className="block w-full py-4 px-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-red-400 hover:bg-zinc-900 transition-colors active:scale-[0.98] text-left"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center">
                <Phone className="w-5 h-5 text-zinc-200" />
              </div>
              <div>
                <div className="text-sm font-semibold">Call Emergency Contact</div>
                <div className="text-[11px] text-zinc-400 uppercase tracking-[0.18em]">
                  Backup / secondary
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-400">Tap to call (number hidden)</div>
            </div>
          </div>
        </button>
      )}

      {contacts.length > 1 && (
        <div className="pt-1 space-y-1">
          {contacts.slice(0, 3).map((contact) => (
            <a
              key={contact.id}
              href={`tel:${contact.phone}`}
              className="block w-full py-3 px-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-600 transition-colors active:scale-[0.98]"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-left">
                  <div className="text-xs font-semibold">{contact.name}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-[0.16em]">
                    {contact.relation}
                  </div>
                </div>
                <div className="text-right text-[11px] text-zinc-400 font-mono">
                  {contact.phone}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

