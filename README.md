# hyperwave

hyperwave combines the strengths of traditional server-rendered applications with the flexibility of modern client-side frameworks. It is designed to deliver fast, responsive applications while providing a streamlined developer experience.

- Works well in 2G network conditions.
- Only about 200 lines of JS with zero client side dependencies
- Tailwind-compatible tsx and html over the wire offer a minimalistic and declarative approach to UI development.
- Bun applications can be deployed easily on any platform as portable binaries.

```
$ git clone https://github.com/tireymorris/hyperwave.git
$ cd hyperwave
$ bun install
$ bun dev
```

Navigate to http://localhost:1234 in your browser and start editing server.tsx to observe your changes live.

## hyperwave.js

dynamically load content on user events, without requiring a page reload.

attaches automatically to any element with an href attribute (besides an anchor/link tag, which is treated as normal)

### Usage:

```
<div href="/next-page" target="#content"></div>
```

- `trigger`: Event that triggers loading (e.g., click, scroll).
- `method`: HTTP request method (e.g., GET, POST).
- `debounce`: Delay in milliseconds to optimize performance.
- `offset, limit, total`: Manage pagination settings.
- `update-mode`: How to update content, either replace (default) or append.

```
<div href="/next-page" target="#content" trigger="scroll" method="GET" debounce="50" offset="0" limit="10" total="100"></div>
```
