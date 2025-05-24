import { raw } from 'hono/html';

export const createScriptLoader = (id: string): string => {
  return `
    (function() {
      const script = document.createElement('script');
      script.id = "${id}";
      document.head.appendChild(script);
      return script;
    })()
  `;
};

export const loadExternalScript = (id: string, src?: string): string => {
  const scriptSrc = src || deriveScriptPath(id);

  return `
    (function() {
      const script = document.createElement('script');
      script.id = "${id}";
      script.src = "${scriptSrc}";
      script.async = true;
      document.head.appendChild(script);
      return script;
    })()
  `;
};

export const createRawScriptLoader = (
  id: string,
  scriptId?: string,
): ReturnType<typeof raw> => {
  const content = createScriptLoader(id);
  return raw(
    `<script id="${scriptId || `${id}-loader`}" type="text/javascript">${content}</script>`,
  );
};

export const loadRawExternalScript = (
  id: string,
  src?: string,
  scriptId?: string,
): ReturnType<typeof raw> => {
  const content = loadExternalScript(id, src);
  return raw(
    `<script id="${scriptId || `${id}-loader`}" type="text/javascript">${content}</script>`,
  );
};

export const createRawInlineScript = (
  id: string,
  content: string,
): ReturnType<typeof raw> => {
  return raw(`<script id="${id}" type="text/javascript">${content}</script>`);
};

function deriveScriptPath(id: string): string {
  const baseName = id
    .replace(/-?(js|script|init)$/, '')
    .replace(/^(js-|script-)/, '');

  const fileName = baseName
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');

  return `/js/${fileName}.js`;
}

export const createToastDismissal = (
  id: string,
  delay: number,
  animationDuration: number,
): string => {
  return `
    (function() {
      setTimeout(() => {
        const toast = document.getElementById('${id}');
        if (toast) {
          toast.style.opacity = '0';
          setTimeout(() => {
            toast.remove();
          }, ${animationDuration});
        }
      }, ${delay});
    })()
  `;
};

export const createRawToastDismissal = (
  id: string,
  delay: number,
  animationDuration: number,
  scriptId?: string,
): ReturnType<typeof raw> => {
  const content = createToastDismissal(id, delay, animationDuration);
  return raw(
    `<script id="${scriptId || `dismiss-${id}`}" type="text/javascript">${content}</script>`,
  );
};
