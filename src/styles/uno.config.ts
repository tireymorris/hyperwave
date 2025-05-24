import { defineConfig, presetAttributify, presetWind } from 'unocss';
import presetWebFonts from '@unocss/preset-web-fonts';

export default defineConfig({
  presets: [
    presetAttributify(),
    presetWind({
      dark: 'class',
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        primary: [
          {
            name: 'Inter',
            weights: ['400', '500', '600', '700'],
            italic: true,
          },
        ],
        mono: [
          {
            name: 'Fira Code',
            weights: ['300', '400', '500', '600', '700'],
          },
          {
            name: 'JetBrains Mono',
            weights: ['300', '400', '500', '600', '700'],
          },
          {
            name: 'Source Code Pro',
            weights: ['300', '400', '500', '600', '700'],
          },
        ],
      },
    }),
  ],
  theme: {
    colors: {
      'app-background': '#0c0a14',
      'app-background-alt': '#161421',
      'app-background-accent': '#201e2a',
      'app-background-overlay': 'rgba(12, 10, 20, 0.95)',
      'app-surface': '#2a2735',
      'app-surface-hover': 'rgba(139, 92, 246, 0.15)',
      'app-surface-dim': 'rgba(255, 255, 255, 0.06)',
      'app-surface-card': 'rgba(42, 39, 53, 0.9)',
      'text-primary': '#fafafa',
      'text-secondary': '#e5e5e5',
      'text-tertiary': '#a3a3a3',
      'text-disabled': '#737373',
      'text-inverse': '#0c0a14',
      'text-white': '#ffffff',
      'text-white-dim': 'rgba(255, 255, 255, 0.85)',
      'border-primary': '#8b5cf6',
      'border-primary-hover': '#7c3aed',
      'border-secondary': '#a3a3a3',
      'border-accent': '#a855f7',
      'border-danger': '#f87171',
      'border-warning': '#fbbf24',
      'border-info': '#38bdf8',
      'border-subtle': 'rgba(255, 255, 255, 0.1)',
      'status-success': '#34d399',
      'status-warning': '#fbbf24',
      'status-error': '#f87171',
      'status-info': '#38bdf8',
      'interactive-primary': '#8b5cf6',
      'interactive-primary-hover': '#7c3aed',
      'interactive-secondary': '#a855f7',
      'interactive-secondary-hover': '#9333ea',
      'interactive-danger': '#f87171',
      'interactive-danger-hover': '#ef4444',
    },
  },
  variants: [
    (
      matcher: string,
    ): { matcher: string; selector: (s: string) => string } | undefined => {
      if (matcher.startsWith('htmx-request:')) {
        return {
          matcher: matcher.slice('htmx-request:'.length),
          selector: (s: string): string =>
            `.htmx-request ${s}, ${s}.htmx-request`,
        };
      }
      if (matcher.startsWith('htmx-settling:')) {
        return {
          matcher: matcher.slice('htmx-settling:'.length),
          selector: (s: string): string =>
            `.htmx-settling ${s}, ${s}.htmx-settling`,
        };
      }
      if (matcher.startsWith('htmx-swapping:')) {
        return {
          matcher: matcher.slice('htmx-swapping:'.length),
          selector: (s: string): string =>
            `.htmx-swapping ${s}, ${s}.htmx-swapping`,
        };
      }
      if (matcher.startsWith('htmx-added:')) {
        return {
          matcher: matcher.slice('htmx-added:'.length),
          selector: (s: string): string => `.htmx-added ${s}, ${s}.htmx-added`,
        };
      }
      return undefined;
    },
  ],
});
