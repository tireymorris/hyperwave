/**
 * Configuration object for hyperwave.
 * @typedef {Object} HyperwaveConfig
 * @property {boolean} debug - If true, enables debug mode which logs additional information.
 * @property {string} defaultMethod - The default HTTP method used for fetching content.
 * @property {number} defaultDebounceDelay - The default delay in milliseconds for debouncing events.
 * @property {number} defaultLimit - The default number of items to fetch per pagination request.
 * @property {number} defaultTotalItems - The default total number of items available for pagination.
 * @property {string} logPrefix - Prefix to use for log messages to distinguish them.
 */

/** @type {HyperwaveConfig} */
const hyperwaveConfig = {
  debug: true,
  defaultMethod: "GET",
  defaultDebounceDelay: 50,
  defaultLimit: 32,
  defaultTotalItems: 2048,
  logPrefix: "hyperwave:",
};

/**
 * Logs messages to the console if debug mode is enabled.
 * @param {string} level - The log level, e.g., "log" or "error".
 * @param {...any} messages - The messages or objects to log.
 */
const log = (level, ...messages) => {
  if (hyperwaveConfig.debug) {
    console[level](`${hyperwaveConfig.logPrefix}`, ...messages);
  }
};

/**
 * Creates a debounced version of the provided function.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds to wait before invoking the function.
 * @returns {Function} - The debounced function.
 */
const createDebouncedFunction = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Fetches content from a specified URL using the provided options.
 * @param {string} url - The URL to fetch content from.
 * @param {Object} [fetchOptions={}] - Options to customize the fetch request.
 * @param {string} [fetchOptions.method] - The HTTP method to use.
 * @param {Object} [fetchOptions.headers] - Headers to include in the request.
 * @returns {Promise<string|null>} - A promise that resolves to the fetched content or null if an error occurs.
 */
const fetchContent = async (url, fetchOptions = {}) => {
  const options = {
    method: fetchOptions.method || hyperwaveConfig.defaultMethod,
    headers: { Accept: "text/html", ...fetchOptions.headers },
    ...fetchOptions,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const content = await response.text();
    log("log", `Content fetched from ${url}`, content.length);
    return content;
  } catch (error) {
    log("error", `Error fetching from ${url}:`, error);
    return null;
  }
};

/**
 * Updates a target element with new content, either replacing or appending based on mode.
 * @param {HTMLElement} targetElement - The element to update with new content.
 * @param {string} content - The HTML content to update.
 * @param {string} mode - The mode of updating, either "replace" or "append".
 */
const updateTargetElement = (targetElement, content, mode = "replace") => {
  if (mode === "replace") {
    targetElement.innerHTML = content;
  } else if (mode === "append") {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    while (tempDiv.firstChild) {
      targetElement.appendChild(tempDiv.firstChild);
    }
  }
  attachHyperwaveHandlers(targetElement);
};

/**
 * Constructs a URL for pagination with the given offset and limit.
 * @param {HTMLElement} triggerElement - The element that triggered the pagination.
 * @param {number} offset - The offset for pagination.
 * @param {number} limit - The limit for pagination.
 * @returns {string} - The constructed URL for pagination.
 */
const buildPaginationUrl = (triggerElement, offset, limit) => {
  const url = new URL(
    triggerElement.getAttribute("href"),
    window.location.origin,
  );
  url.searchParams.set("offset", offset);
  url.searchParams.set("limit", limit);
  return url.toString();
};

/**
 * Handles pagination by fetching the next set of content and updating the target element.
 * @param {HTMLElement} triggerElement - The element that triggered the pagination.
 * @param {Object} fetchOptions - Options to customize the fetch request.
 * @returns {Function} - A function to handle fetching the next page of content.
 */
const handlePagination = (triggerElement, fetchOptions) => {
  let offset = parseInt(triggerElement.getAttribute("offset") || "0", 10);
  const limit = parseInt(
    triggerElement.getAttribute("limit") || hyperwaveConfig.defaultLimit,
    10,
  );
  const totalItems = parseInt(
    triggerElement.getAttribute("total") || hyperwaveConfig.defaultTotalItems,
    10,
  );
  const mode = triggerElement.getAttribute("update-mode") || "replace";

  let isFetching = false;

  return async () => {
    if (isFetching || offset >= totalItems) return;

    isFetching = true;
    const url = buildPaginationUrl(triggerElement, offset, limit);
    const content = await fetchContent(url, fetchOptions);
    if (content) {
      const target = document.querySelector(
        triggerElement.getAttribute("target"),
      );
      updateTargetElement(target, content, mode);
      offset += limit;
      triggerElement.setAttribute("offset", offset);
      log("log", `Content updated. New offset set: ${offset}`);
    }
    isFetching = false;
  };
};

/**
 * Sets up event handlers for the given trigger element based on its attributes.
 * @param {HTMLElement} triggerElement - The element to set up event handlers for.
 */
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
    triggerElement.getAttribute("scroll-threshold") || "300",
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
    if (trigger !== "scroll") event.preventDefault();

    if (trigger === "scroll") {
      const nearBottom =
        document.body.offsetHeight - (window.innerHeight + window.scrollY) <=
        scrollThreshold;
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

/**
 * Attaches hyperwave event handlers to all elements within a given root element.
 * @param {HTMLElement} rootElement - The root element to search for trigger elements.
 */
const attachHyperwaveHandlers = (rootElement) => {
  const elements = Array.from(rootElement.querySelectorAll("[href]")).filter(
    (element) => !["A", "LINK"].includes(element.tagName),
  );
  elements.forEach((element) => setupEventHandlers(element));
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

  observer.observe(document.body, { childList: true, subtree: true });
});
