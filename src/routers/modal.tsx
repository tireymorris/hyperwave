import { Hono } from 'hono';
import { logHandler } from '@/middleware/logger';

const modalRouter = new Hono();

modalRouter.get('/close', async (c) => {
  logHandler.debug('ui', 'Closing modal');
  return c.html(
    <div id="modal-container" class="hidden" hx-swap-oob="true"></div>,
  );
});

export default modalRouter;
