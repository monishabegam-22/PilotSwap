import { getAddress, isAddress, zeroAddress, type Address } from 'viem';
import { ENV } from './env';

export interface Token {
  /** Unique id used as a React key and balance-map key. */
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  /** null for the native coin (ETH). */
  address: Address | null;
  isNative: boolean;
  /** Icon styling (no remote images needed). */
  color: string;
  glyph: string;
}

/** Returns a checksummed address, or null if the value is empty/invalid/zero. */
export function parseAddress(value?: string): Address | null {
  if (!value || !isAddress(value, { strict: false }) || value.toLowerCase() === zeroAddress) return null;
  return getAddress(value);
}

/**
 * ─────────────────────────────────────────────────────────────
 *  TOKEN LIST  — add new tokens by appending an object below.
 *  Token addresses come from .env so you never hard-code unverified ones.
 *  IMPORTANT: `decimals` must match the on-chain token (USDC is usually 6,
 *  but some testnet "USDC" deployments use 18 — check the explorer!).
 * ─────────────────────────────────────────────────────────────
 */
export const TOKENS: Token[] = [
  { id: 'ETH', symbol: 'ETH', name: 'Ether', decimals: 18, address: null, isNative: true, color: '#8EA2FF', glyph: 'Ξ' },
  { id: 'WETH', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, address: parseAddress(ENV.wethAddress), isNative: false, color: '#B79CFF', glyph: 'W' },
  { id: 'USDC', symbol: 'USDC', name: 'USD Coin', decimals: 6, address: parseAddress(ENV.usdcAddress), isNative: false, color: '#4C8DFF', glyph: '$' },
  { id: 'DAI', symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18, address: parseAddress(ENV.daiAddress), isNative: false, color: '#FFB454', glyph: '◈' },
  // Test Bitcoin: a MockToken you deploy yourself (8 decimals like BTC). NOT real Bitcoin.
  { id: 'TBTC', symbol: 'tBTC', name: 'Test Bitcoin', decimals: 8, address: parseAddress(ENV.tbtcAddress), isNative: false, color: '#F7931A', glyph: '₿' },
];

export const isTokenConfigured = (t: Token): boolean => t.isNative || t.address !== null;
export const getToken = (id: string): Token => TOKENS.find((t) => t.id === id) ?? TOKENS[0];
