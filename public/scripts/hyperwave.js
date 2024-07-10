const DEBUG = true;

/**
 * Logs messages to the console if DEBUG is true.
 * @param {string} level - The level of logging (e.g., 'log', 'warn', 'error').
 * @param {...any} messages - The messages or data to log.
 */
const log = (level, ...messages) =>
  DEBUG && console[level](`hyperwave:`, ...messages);

/**
 * Creates a debounced function that delays the execution of the provided function.
 * Useful to limit the rate at which a function is invoked.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
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
 * Fetches content from the specified URL using the provided options.
 * @param {string} url - The URL to fetch content from.
 * @param {RequestInit} fetchOptions - The options for the fetch request.
 * @returns {Promise<string>} - The fetched content as a string.
 */
const fetchContent = async (url, fetchOptions) => {
  try {
    log("log", `Fetching content from ${url}`);
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    log("log", `Content fetched from ${url}`, content.length);
    return content;
  } catch (error) {
    log("error", `Error fetching from ${url}:`, error);
    return null;
  }
};

/**
 * Updates the target element with the provided content.
 * @param {HTMLElement} targetElement - The element to update.
 * @param {string} content - The new content to append to the target element.
 */
const updateTargetElement = (targetElement, content) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  while (tempDiv.firstChild) {
    targetElement.appendChild(tempDiv.firstChild);
  }
  log("log", `Content appended to target element`);
  attachHyperwaveHandlers(targetElement);
};

/**
 * Builds the URL for the next page to load, used for pagination.
 * @param {HTMLElement} triggerElement - The element that triggers pagination.
 * @param {number} offset - The current offset.
 * @param {number} limit - The number of items per page.
 * @returns {string} - The URL for the next page.
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
 * Handles pagination for loading additional content.
 * @param {HTMLElement} triggerElement - The element that triggers pagination.
 * @param {RequestInit} fetchOptions - The options for the fetch request.
 * @returns {Function} - The function to load the next page of content.
 */
const handlePagination = (triggerElement, fetchOptions) => {
  let offset = parseInt(triggerElement.getAttribute("offset") || "0", 10);
  const limit = parseInt(triggerElement.getAttribute("limit") || "10", 10);
  const totalItems = parseInt(
    triggerElement.getAttribute("data-total") || "999999999",
    10,
  );

  return async () => {
    if (offset >= totalItems) return;

    const url = buildPaginationUrl(triggerElement, offset, limit);
    const content = await fetchContent(url, fetchOptions);
    if (content) {
      updateTargetElement(
        document.querySelector(triggerElement.getAttribute("target")),
        content,
      );
      offset += limit;
      triggerElement.setAttribute("offset", offset);
    }
  };
};

/**
 * Sets up event listeners and handlers based on element attributes.
 * Handles different triggers like click and DOMContentLoaded.
 * @param {HTMLElement} triggerElement - The element to handle the request for.
 */
const setupEventHandlers = (triggerElement) => {
  const method = triggerElement.getAttribute("method") || "GET";
  const trigger = triggerElement.getAttribute("trigger") || "click";
  const debounceDelay = parseInt(
    triggerElement.getAttribute("debounce") || "50",
    10,
  );

  if (!triggerElement.getAttribute("href")) {
    log("warn", `Missing href for element:`, triggerElement);
    return;
  }

  const fetchOptions = {
    method: method.toUpperCase(),
    headers: { Accept: "text/html" },
  };

  const loadNextPage = handlePagination(triggerElement, fetchOptions);

  if (trigger.includes("DOMContentLoaded")) {
    loadNextPage();
  } else {
    // Remove any existing event listener before adding a new one
    if (triggerElement._hyperwaveHandler) {
      triggerElement.removeEventListener(
        trigger,
        triggerElement._hyperwaveHandler,
      );
    }

    const eventHandler = createDebouncedFunction((event) => {
      event.preventDefault();
      loadNextPage();
    }, debounceDelay);

    triggerElement.addEventListener(trigger, eventHandler);
    triggerElement._hyperwaveHandler = eventHandler;
  }
};

/**
 * Handles infinite scrolling to load more content as the user scrolls near the bottom of the page.
 * @param {HTMLElement} triggerElement - The element that triggers infinite scroll.
 * @param {Function} loadNextPage - The function to load the next page of content.
 * @param {number} debounceDelay - The debounce time in milliseconds for the scroll event.
 */
const setupInfiniteScroll = (triggerElement, loadNextPage, debounceDelay) => {
  let isLoading = false;
  const threshold = 200; // Pixels from the bottom to trigger loading

  const onScroll = createDebouncedFunction(async () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const clientHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (scrollTop + clientHeight >= scrollHeight - threshold && !isLoading) {
      isLoading = true;
      await loadNextPage();
      isLoading = false;
    }
  }, debounceDelay);

  window.addEventListener("scroll", onScroll);
  loadNextPage(); // Load initial content if needed

  // Store the event handler to remove it later if needed
  triggerElement._hyperwaveScrollHandler = onScroll;
};

/**
 * Attaches Hyperwave functionality to elements within the specified root element.
 * It scans for elements with `href` attribute and sets up the necessary handlers.
 * @param {HTMLElement} rootElement - The root element to search for elements to attach Hyperwave to.
 */
const attachHyperwaveHandlers = (rootElement) => {
  const elements = Array.from(rootElement.querySelectorAll("[href]")).filter(
    (element) => !["A", "LINK"].includes(element.tagName),
  );
  elements.forEach((element) => {
    setupEventHandlers(element);

    const trigger = element.getAttribute("trigger") || "click";
    if (trigger.includes("scroll")) {
      const debounceDelay = parseInt(
        element.getAttribute("debounce") || "50",
        10,
      );
      const loadNextPage = handlePagination(element, {
        method: element.getAttribute("method") || "GET",
        headers: { Accept: "text/html" },
      });

      // Remove any existing scroll event listener before adding a new one
      if (element._hyperwaveScrollHandler) {
        window.removeEventListener("scroll", element._hyperwaveScrollHandler);
      }
      setupInfiniteScroll(element, loadNextPage, debounceDelay);
    }
  });
};

/**
 * Initializes Hyperwave on DOMContentLoaded and sets up a MutationObserver to attach Hyperwave to newly added elements.
 * Ensures dynamic elements loaded after initial page load are also enhanced.
 */
document.addEventListener("DOMContentLoaded", () => {
  attachHyperwaveHandlers(document);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          attachHyperwaveHandlers(node);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true, // Monitor for additions or removals of child elements
    subtree: true, // Monitor the entire subtree, not just immediate children
  });
});
