import Logo from '../components/Logo';
import Navbar from '../components/Navbar';
import SwapCard from '../components/SwapCard';
import ChainComingSoon from '../components/ChainComingSoon';
import { useChain } from '../chains/ChainContext';
import { ACTIVE_CHAIN, explorerAddressUrl } from '../config/chains';
import { TOKENS } from '../config/tokens';
import { useBalances } from '../hooks/useBalances';
import { useWallet } from '../hooks/useWallet';
import { formatAmount, shortAddress } from '../lib/format';

export default function Home() {
  const { chain } = useChain();
  const { account, isConnected, isWrongNetwork } = useWallet();
  const { balances, loading } = useBalances(account, isConnected && !isWrongNetwork);
  const showBalances = isConnected && !isWrongNetwork;

  return (
    <div id="top">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* HERO */}
        <div className="grid items-start gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div className="lg:pt-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
              <span className="h-2 w-2 rounded-full bg-horizon" /> Live on {ACTIVE_CHAIN.name}
            </p>
            <h1 className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Swap Tokens.<br />
              <span className="text-altitude">Fly Decentralized.</span>
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#swap" className="rounded-2xl bg-horizon px-6 py-3.5 font-display font-semibold text-night transition hover:brightness-110 focus-ring">Start Swapping</a>
              <span className="text-sm text-slate-400">Simple. Secure. Decentralized.</span>
            </div>
            <svg className="mt-12 hidden w-full max-w-lg text-horizon/50 lg:block" viewBox="0 0 480 90" fill="none" aria-hidden>
              <path d="M4 80C120 80 150 14 260 24s150 46 216 6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 7" strokeLinecap="round" />
              <path d="M468 22 478 30 466 36z" fill="currentColor" />
            </svg>
          </div>
          {chain.family === 'evm' ? <SwapCard /> : <ChainComingSoon chain={chain} />}
        </div>

        {/* TOKENS */}
        <section id="tokens" className="border-t border-white/5 py-14">
          <h2 className="text-2xl font-semibold">Supported tokens</h2>
          <p className="mt-2 max-w-xl text-slate-400">Testnet tokens only. Check every address on the block explorer before you trust it. To add a token, edit <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">src/config/tokens.ts</code>.</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TOKENS.map((t) => {
              const url = t.address ? explorerAddressUrl(t.address) : null;
              return (
                <li key={t.id} className="glass rounded-2xl p-4">
                  <p className="font-display text-lg font-semibold">{t.symbol}</p>
                  <p className="text-sm text-slate-400">{t.name}</p>
                  <p className="mt-3 text-sm">
                    {t.isNative ? <span className="text-slate-300">Native coin</span>
                      : t.address ? <a href={url ?? '#'} target="_blank" rel="noopener noreferrer" className="font-mono text-horizon hover:underline">{shortAddress(t.address)}</a>
                      : <span className="text-slate-500">Not configured</span>}
                  </p>
                  {showBalances && (t.isNative || t.address) && (
                    <p className="mt-3 border-t border-white/5 pt-3 text-sm text-slate-400">
                      Balance:{' '}
                      <span className="font-medium text-white">
                        {balances[t.id] === undefined
                          ? (loading ? 'Loading…' : '—')
                          : `${formatAmount(balances[t.id], t.decimals)} ${t.symbol}`}
                      </span>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

      </main>

      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-500 sm:flex-row sm:px-6">
          <Logo />
          <p>Testnet software. Do not use real funds.</p>
        </div>
      </footer>
    </div>
  );
}
