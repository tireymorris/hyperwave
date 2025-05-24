import { Hono } from 'hono';
import Layout from '@/components/Layout';
import { contextLog } from '@/middleware/logger';
import Button from '@/components/Button';
import { getUserFromContext } from '@/lib/auth/session';
import FormField from '@/components/FormField';
import Modal from '@/components/Modal';
import Section from '@/components/Section';
import FieldRow from '@/components/FieldRow';
import PageHeader from '@/components/PageHeader';
import Select from '@/components/Select';
import type { TokenPayload } from '@/lib/auth/constants';

const profileRouter = new Hono();

profileRouter.get('/', async (c) => {
  contextLog(c, 'ui', 'debug', 'Rendering profile page');
  const user = getUserFromContext(c) as TokenPayload;

  return c.html(
    <Layout title="Profile" c={c}>
      <div class="space-y-8">
        <PageHeader
          title="Profile Data"
          action={<Button variant="primary">Save Changes</Button>}
        />

        <div class="space-y-6">
          <Section title="Personal Information">
            <form class="space-y-4">
              <FormField
                type="text"
                name="name"
                label="Name"
                value={user.email.split('@')?.[0] ?? 'user'}
              />
              <FormField
                type="email"
                name="email"
                label="Email"
                value={user.email}
                disabled
              />
              <div>
                <label class="mb-1 block text-sm text-text-primary font-primary">
                  Time Zone:
                </label>
                <Select
                  name="timezone"
                  options={[
                    { value: 'UTC', label: 'UTC', selected: true },
                    { value: 'America/New_York', label: 'America/New_York' },
                    { value: 'Europe/London', label: 'Europe/London' },
                    { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
                  ]}
                />
              </div>
            </form>
          </Section>

          <Section title="Security Settings">
            <div class="space-y-4">
              <FieldRow
                title="Password"
                description="Change your account password"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  hxGet="/profile/change-password"
                  hxTarget="#modal-container"
                >
                  Change
                </Button>
              </FieldRow>

              <FieldRow
                title="Two-Factor Authentication"
                description="Add an extra layer of security"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  hxGet="/profile/enable-2fa"
                  hxTarget="#modal-container"
                >
                  Enable
                </Button>
              </FieldRow>
            </div>
          </Section>
        </div>

        <div id="modal-container"></div>
      </div>
    </Layout>,
  );
});

profileRouter.get('/change-password', async (c) => {
  return c.html(
    <Modal
      title="Change Password"
      primaryAction={{
        label: 'Update Password',
        disabled: false,
        'hx-post': '/profile/update-password',
        'hx-target': '#modal-container',
      }}
      secondaryAction={{ label: 'Cancel', disabled: false }}
    >
      <div class="space-y-4">
        <FormField
          type="password"
          name="currentPassword"
          label="Current Password"
          placeholder="Enter your current password"
          required
        />
        <FormField
          type="password"
          name="newPassword"
          label="New Password"
          placeholder="Enter your new password"
          required
        />
        <FormField
          type="password"
          name="confirmPassword"
          label="Confirm New Password"
          placeholder="Confirm your new password"
          required
        />
        <div class="mt-2 text-sm text-text-secondary font-primary">
          Password must be at least 8 characters long and include a number and a
          special character.
        </div>
      </div>
    </Modal>,
  );
});

profileRouter.get('/enable-2fa', async (c) => {
  return c.html(
    <Modal
      title="Enable Two-Factor Authentication"
      primaryAction={{
        label: 'Activate 2FA',
        disabled: false,
        'hx-post': '/profile/activate-2fa',
        'hx-target': '#modal-container',
      }}
      secondaryAction={{ label: 'Cancel', disabled: false }}
    >
      <div class="space-y-4">
        <div class="rounded-lg border border-border-primary border-opacity-50 bg-app-background-alt p-4 shadow-sm">
          <div class="text-center">
            <div class="mb-2 text-sm text-text-secondary font-primary">
              Scan this QR code with your authenticator app
            </div>
            <div class="mx-auto h-48 w-48 bg-text-white p-2">
              <div class="flex h-full w-full items-center justify-center bg-app-surface text-text-inverse">
                <div class="text-center">
                  <div class="mb-1 text-lg font-bold">QR Code</div>
                  <div class="text-xs">App-Shell-2FA</div>
                </div>
              </div>
            </div>
            <div class="mt-2 text-sm text-text-secondary font-primary">
              Can't scan? Use this code to manually set up:
            </div>
            <div class="mt-1 font-primary text-sm text-text-primary">
              ABCD-EFGH-IJKL-MNOP
            </div>
          </div>
        </div>

        <FormField
          type="text"
          name="verificationCode"
          label="Verification Code"
          placeholder="Enter the 6-digit code from your app"
          required
        />

        <div class="mt-2 text-sm text-text-secondary font-primary">
          After scanning the QR code with your authenticator app, enter the
          6-digit code displayed in the app to verify setup.
        </div>
      </div>
    </Modal>,
  );
});

profileRouter.post('/update-password', async (c) => {
  contextLog(c, 'ui', 'debug', 'Processing password update');

  const isHtmxRequest = c.req.header('HX-Request') === 'true';

  if (isHtmxRequest) {
    c.header('HX-Redirect', '/profile?success=Password+successfully+updated!');
    return c.body(null);
  } else {
    return c.redirect('/profile?success=Password+successfully+updated!');
  }
});

profileRouter.post('/activate-2fa', async (c) => {
  contextLog(c, 'ui', 'debug', 'Processing 2FA activation');

  const isHtmxRequest = c.req.header('HX-Request') === 'true';

  if (isHtmxRequest) {
    c.header(
      'HX-Redirect',
      '/profile?success=Two-factor+authentication+enabled+successfully!',
    );
    return c.body(null);
  } else {
    return c.redirect(
      '/profile?success=Two-factor+authentication+enabled+successfully!',
    );
  }
});

export default profileRouter;
