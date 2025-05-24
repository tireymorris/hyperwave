import type { Child, FC } from 'hono/jsx';
import Link from '@/components/Link';
import { logHandler } from '@/middleware/logger';

type NavProps = {
  userEmail: string | null | undefined;
  currentPath?: string;
};

const Navigation: FC<NavProps> = ({ userEmail, currentPath = '/' }) => {
  logHandler.debug('ui', 'Rendering navigation', { userEmail, currentPath });

  const NavLink = ({
    href,
    children,
    isActive,
  }: {
    href: string;
    children: Child;
    isActive: boolean;
  }): ReturnType<FC> => {
    return (
      <a
        href={href}
        class={`relative px-2 py-1 font-medium no-underline transition-colors duration-200 font-primary ${
          isActive
            ? 'text-text-primary'
            : 'text-text-secondary hover:text-text-primary'
        }`}
        hx-on:mouseenter="this.querySelector('.nav-underline').classList.add('w-[105%]', 'opacity-100'); this.querySelector('.nav-underline').classList.remove('w-0', 'opacity-0')"
        hx-on:mouseleave={
          isActive
            ? ''
            : "this.querySelector('.nav-underline').classList.add('w-0', 'opacity-0'); this.querySelector('.nav-underline').classList.remove('w-[105%]', 'opacity-100')"
        }
      >
        <span class="relative z-10">{children}</span>
        <span
          class={`nav-underline absolute bottom-[-3px] left-[50%] h-0.5 -translate-x-1/2 transform bg-border-primary transition-all duration-200 ${
            isActive ? 'w-[105%] opacity-100' : 'w-0 opacity-0'
          }`}
        ></span>
      </a>
    );
  };

  return (
    <nav class="sticky top-0 z-50 mb-2 w-full border-b border-border-primary bg-app-background-alt backdrop-blur-lg">
      <div class="container mx-auto flex items-center justify-between px-4 py-3 md:px-8">
        <div class="flex items-center">
          {userEmail ? (
            <>
              <button
                class="mr-3 flex h-9 w-9 cursor-pointer flex-col items-center justify-center rounded-none border border-border-primary bg-app-background transition-colors hover:bg-app-background-accent md:hidden"
                hx-on="click: document.getElementById('mobile-menu').classList.toggle('hidden')"
              >
                <div class="h-[1.5px] w-5 rounded-none bg-border-primary"></div>
                <div class="mt-[5px] h-[1.5px] w-5 rounded-none bg-border-primary"></div>
                <div class="mt-[5px] h-[1.5px] w-5 rounded-none bg-border-primary"></div>
              </button>
              <Link href="/" class="flex cursor-pointer items-center">
                <div class="text-text-primary font-primary text-xl font-bold">
                  🌊
                </div>
              </Link>
            </>
          ) : (
            <Link href="/" class="flex cursor-pointer items-center">
              <div class="text-text-primary font-primary text-xl font-bold">
                Dashboard
              </div>
            </Link>
          )}

          {userEmail && (
            <div class="hidden items-center ml-8 space-x-8 md:flex">
              <NavLink
                href="/dashboard"
                isActive={currentPath?.startsWith('/dashboard')}
              >
                Dashboard
              </NavLink>
              <NavLink
                href="/profile"
                isActive={currentPath?.startsWith('/profile')}
              >
                Profile
              </NavLink>
              <NavLink
                href="/settings"
                isActive={currentPath?.startsWith('/settings')}
              >
                Settings
              </NavLink>
            </div>
          )}
        </div>

        <div class="flex items-center">
          {userEmail && (
            <div class="relative">
              <div class="group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-none bg-app-background-accent border border-border-primary text-sm font-medium text-text-primary shadow-md font-primary">
                {userEmail[0] ?? 'U'}
                <div class="invisible absolute right-full top-0 z-[1000] mr-1 w-44 rounded-none border border-border-primary bg-app-background text-text-primary shadow-xl backdrop-blur-lg transition-all duration-200 hover:visible group-hover:visible">
                  <div class="border-b border-border-secondary px-4 py-2">
                    <p class="text-xs text-text-secondary font-primary">
                      Logged in as:
                    </p>
                    <p class="truncate text-sm font-medium text-text-primary font-primary">
                      {userEmail}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    active={currentPath === '/profile'}
                    class="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-app-background-accent font-primary"
                  >
                    <span class="text-lg text-status-info">{'>'}</span> Profile
                  </Link>
                  <Link
                    href="/settings"
                    active={currentPath === '/settings'}
                    class="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-app-background-accent font-primary"
                  >
                    <span class="text-lg text-status-info">{'>'}</span> Settings
                  </Link>
                  <Link
                    href="/auth/logout"
                    hx-get="/auth/logout"
                    hx-target="body"
                    class="flex w-full cursor-pointer items-center gap-2 rounded-none px-4 py-2 text-sm text-status-error transition-colors hover:bg-status-error/20 font-primary"
                  >
                    <span class="text-lg text-status-error">{'>'}</span> Logout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {userEmail && (
        <div
          id="mobile-menu"
          class="hidden border-t border-border-secondary md:hidden"
        >
          <div class="flex flex-col space-y-2 px-4 py-3">
            <NavLink
              href="/dashboard"
              isActive={currentPath?.startsWith('/dashboard')}
            >
              Dashboard
            </NavLink>
            <NavLink
              href="/profile"
              isActive={currentPath?.startsWith('/profile')}
            >
              Profile
            </NavLink>
            <NavLink
              href="/settings"
              isActive={currentPath?.startsWith('/settings')}
            >
              Settings
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
