const hyperwaveConfig = {
  debug: true,
  defaultMethod: "GET",
  defaultDebounceDelay: 50,
  defaultLimit: 32,
  defaultTotalItems: 2048,
  logPrefix: "hyperwave:",
};

// Utility functions
const log = (level, ...messages) => {
  if (hyperwaveConfig.debug) {
    console[level](`${hyperwaveConfig.logPrefix}`, ...messages);
  }
};

const createDebouncedFunction = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Content functions
const fetchContent = async (url, fetchOptions = {}) => {
  try {
    const response = await fetch(url, {
      method: fetchOptions.method || hyperwaveConfig.defaultMethod,
      headers: { Accept: "text/html", ...fetchOptions.headers },
      ...fetchOptions,
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const content = await response.text();
    log("log", `Content fetched from ${url}`, content.length);
    return content;
  } catch (error) {
    log("error", `Error fetching from ${url}:`, error);
    return null;
  }
};

const updateTargetElement = (targetElement, content) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  while (tempDiv.firstChild) {
    targetElement.appendChild(tempDiv.firstChild);
  }
  attachHyperwaveHandlers(targetElement);
};

// Pagination functions
const buildPaginationUrl = (triggerElement, offset, limit) => {
  const url = new URL(
    triggerElement.getAttribute("href"),
    window.location.origin,
  );
  url.searchParams.set("offset", offset);
  url.searchParams.set("limit", limit);
  return url.toString();
};

const handlePagination = (triggerElement, fetchOptions) => {
  let offset = parseInt(triggerElement.getAttribute("offset") || "0", 10);
  const limit = parseInt(
    triggerElement.getAttribute("limit") || hyperwaveConfig.defaultLimit,
    10,
  );
  const totalItems = parseInt(
    triggerElement.getAttribute("data-total") ||
      hyperwaveConfig.defaultTotalItems,
    10,
  );

  let isFetching = false;

  return async () => {
    if (isFetching || offset >= totalItems) {
      return;
    }

    isFetching = true;
    const url = buildPaginationUrl(triggerElement, offset, limit);
    const content = await fetchContent(url, fetchOptions);
    if (content) {
      updateTargetElement(
        document.querySelector(triggerElement.getAttribute("target")),
        content,
      );
      offset += limit;
      triggerElement.setAttribute("offset", offset);
      log("log", `Content appended. New offset set: ${offset}`);
    }
    isFetching = false;
  };
};

// Event handlers
const setupEventHandlers = (triggerElement) => {
  const method =
    triggerElement.getAttribute("method") || hyperwaveConfig.defaultMethod;
  const trigger = triggerElement.getAttribute("trigger") || "click";
  const debounceDelay = parseInt(
    triggerElement.getAttribute("debounce") ||
      hyperwaveConfig.defaultDebounceDelay,
    10,
  );
  const scrollThreshold = parseInt(
    triggerElement.getAttribute("data-scroll-threshold") || "300",
    10,
  );
  const fetchOptions = {
    method: method.toUpperCase(),
    headers: { Accept: "text/html" },
  };

  log(
    "log",
    `Setting up event handlers: method=${method}, trigger=${trigger}, debounceDelay=${debounceDelay}, scrollThreshold=${scrollThreshold}`,
  );

  const loadNextPage = handlePagination(triggerElement, fetchOptions);

  const eventHandler = createDebouncedFunction(async (event) => {
    if (trigger !== "scroll") {
      event.preventDefault();
    }
    if (trigger === "scroll") {
      const scrollPosition = window.innerHeight + window.scrollY;
      const nearBottom =
        document.body.offsetHeight - scrollPosition <= scrollThreshold;
      if (!nearBottom) return;
    }
    await loadNextPage();
  }, debounceDelay);

  if (trigger === "DOMContentLoaded") {
    loadNextPage();
  } else {
    const targetElement = trigger === "scroll" ? window : triggerElement;
    targetElement.addEventListener(trigger, eventHandler);
    triggerElement._hyperwaveHandler = eventHandler;

    if (trigger === "scroll") {
      loadNextPage();
    }
  }
};

// Initialization
const attachHyperwaveHandlers = (rootElement) => {
  const elements = Array.from(rootElement.querySelectorAll("[href]")).filter(
    (element) => !["A", "LINK"].includes(element.tagName),
  );
  elements.forEach((element) => {
    setupEventHandlers(element);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  log("log", "DOMContentLoaded event triggered");
  attachHyperwaveHandlers(document);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          log("log", "MutationObserver detected new element:", node);
          attachHyperwaveHandlers(node);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
