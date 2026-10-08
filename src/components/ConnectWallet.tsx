import { useEffect, useRef, useState } from 'react';
import { ACTIVE_CHAIN, chainName } from '../config/chains';
import { METAMASK_MISSING, useWallet, type NonEvmFamily } from '../hooks/useWallet';
import { shortAddress } from '../lib/format';

export const METAMASK_DOWNLOAD = 'https://metamask.io/download/';

export default function ConnectWallet() {
  const {
    account, chainId, isConnecting, isWrongNetwork, connect, disconnect, isInstalled,
    evmAccounts, solanaAccounts, bitcoinAccounts, activeSolana, activeBitcoin,
    solanaAvailable, bitcoinAvailable, connectingFamily, isSwitching, connectFamily, switchAccount,
  } = useWallet();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (addr: string) => {
    void navigator.clipboard.writeText(addr);
    setCopied(addr);
    window.setTimeout(() => setCopied((c) => (c === addr ? null : c)), 1500);
  };

  const sections: {
    id: 'evm' | NonEvmFamily;
    label: string;
    badge: string;
    badgeClass: string;
    list: string[];
    active: string | null;
    available: boolean;
  }[] = [
    { id: 'evm', label: 'Ethereum', badge: 'ETH', badgeClass: 'bg-altitude/20 text-altitude', list: evmAccounts, active: account, available: true },
    { id: 'solana', label: 'Solana', badge: 'SOL', badgeClass: 'bg-emerald-400/15 text-emerald-300', list: solanaAccounts, active: activeSolana, available: solanaAvailable },
    { id: 'bitcoin', label: 'Bitcoin', badge: 'BTC', badgeClass: 'bg-horizon/20 text-horizon', list: bitcoinAccounts, active: activeBitcoin, available: bitcoinAvailable },
  ];
  const [open, setOpen] = useState(false);
  const [showMissing, setShowMissing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && (setOpen(false), setShowMissing(false));
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!account) {
    return (
      <div className="relative" ref={ref}>
        <button
          className="rounded-xl bg-horizon px-4 py-2.5 text-sm font-semibold text-night transition hover:brightness-110 disabled:opacity-60 focus-ring"
          disabled={isConnecting}
          onClick={() => void connect()}
        >
          {isConnecting ? 'Check your wallet…' : 'Connect Wallet'}
        </button>
        {showMissing && !isInstalled && (
          <div role="alert" className="glass absolute right-0 top-12 z-50 w-72 rounded-xl p-3.5 text-sm">
            <p className="text-slate-200">{METAMASK_MISSING}</p>
            <a className="mt-2 inline-block font-medium text-horizon hover:underline" href={METAMASK_DOWNLOAD} target="_blank" rel="noopener noreferrer">
              Get MetaMask
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-2" ref={ref}>
      <span
        className={`hidden items-center gap-2 rounded-xl border px-3 py-2 text-sm sm:inline-flex ${isWrongNetwork ? 'border-rose-400/40 text-rose-200' : 'border-white/10 text-slate-200'}`}
        title={isWrongNetwork ? `Expected ${ACTIVE_CHAIN.name}` : undefined}
      >
        <span className={`h-2 w-2 rounded-full ${isWrongNetwork ? 'bg-rose-400' : 'bg-emerald-400'}`} />
        {chainId ? chainName(chainId) : 'Unknown network'}
      </span>
      <button className="btn-ghost focus-ring font-mono" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu">
        {shortAddress(account)}
      </button>
      {open && (
        <div role="menu" className="glass absolute right-0 top-12 z-50 w-[min(92vw,22rem)] rounded-2xl p-2 text-sm">
          <p className="px-2.5 pb-1.5 pt-1 text-xs uppercase tracking-wider text-slate-400">Your addresses</p>

          {sections.map((sec) => (
            <div key={sec.id} className="mb-1 rounded-xl bg-black/20 p-1.5">
              <div className="flex items-center gap-2 px-1.5 py-1">
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${sec.badgeClass}`}>{sec.badge}</span>
                <span className="font-medium text-slate-100">{sec.label}</span>
              </div>

              {sec.list.length > 0 ? (
                sec.list.map((addr) => {
                  const isActive = addr === sec.active;
                  return (
                    <div key={addr} className={`flex items-center gap-1 rounded-lg ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                      <button
                        role="menuitemradio"
                        aria-checked={isActive}
                        disabled={isSwitching}
                        title={isActive ? 'Active in your wallet' : 'Switch to this address in your wallet'}
                        className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2 text-left disabled:opacity-60 focus-ring"
                        onClick={() => { if (!isActive) void switchAccount(sec.id, addr); }}
                      >
                        <span className={`h-2 w-2 shrink-0 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-white/20'}`} />
                        <span className="truncate font-mono text-slate-100">{shortAddress(addr)}</span>
                        {isActive && <span className="ml-auto text-[11px] text-emerald-300">Active</span>}
                      </button>
                      <button
                        className="shrink-0 rounded-lg px-2 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white focus-ring"
                        onClick={() => copy(addr)}
                        aria-label={`Copy ${sec.label} address`}
                      >
                        {copied === addr ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  );
                })
              ) : sec.id === 'evm' ? (
                <p className="px-2 py-2 text-slate-400">No Ethereum address shared.</p>
              ) : sec.available ? (
                <button
                  className="w-full rounded-lg px-2 py-2 text-left text-horizon hover:bg-white/5 disabled:opacity-60 focus-ring"
                  disabled={connectingFamily === sec.id}
                  onClick={() => void connectFamily(sec.id as NonEvmFamily)}
                >
                  {connectingFamily === sec.id ? 'Check your wallet…' : `Connect ${sec.label} account`}
                </button>
              ) : (
                <p className="px-2 py-2 text-slate-500">Not available in this wallet yet</p>
              )}
            </div>
          ))}

          <p className="px-2.5 pb-1 pt-1.5 text-xs leading-relaxed text-slate-500">
            Click an address to switch it in your wallet. Swaps run on {ACTIVE_CHAIN.name} (Ethereum) only.
          </p>
          <div className="mt-1 border-t border-white/10 pt-1">
            <button className="w-full rounded-lg px-3 py-2 text-left text-rose-300 hover:bg-white/10" onClick={() => { void disconnect(); setOpen(false); }}>
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
