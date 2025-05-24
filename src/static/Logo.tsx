import type { FC } from 'hono/jsx';

type LogoProps = {
  variant?: 'default' | 'compact';
};

const Logo: FC<LogoProps> = ({ variant = 'default' }) => {
  return (
    <div class="flex items-center space-x-2">
      <span class="text-lg font-bold text-status-info">🌊</span>
    </div>
  );
};

export default Logo;
