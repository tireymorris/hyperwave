import { Hono } from 'hono';
import Layout from '@/components/Layout';
import { contextLog } from '@/middleware/logger';
import Button from '@/components/Button';
import Toggle from '@/components/Toggle';
import Section from '@/components/Section';
import FieldRow from '@/components/FieldRow';
import PageHeader from '@/components/PageHeader';
import DangerZone from '@/components/DangerZone';
import Select from '@/components/Select';

const settingsRouter = new Hono();

settingsRouter.get('/', async (c) => {
  contextLog(c, 'ui', 'debug', 'Rendering settings page');

  return c.html(
    <Layout title="Settings" c={c}>
      <div class="space-y-8">
        <PageHeader
          title="Settings"
          action={<Button variant="primary">Save Preferences</Button>}
        />

        <div class="space-y-6">
          <Section title="Notification Preferences">
            <div class="space-y-4">
              <Toggle
                label="Email notifications"
                description="Receive alerts and updates via email"
                enabled={true}
                hxPost="/settings/notifications/email"
                hxTarget="#notification-settings"
              />
              <Toggle
                label="Push notifications"
                description="Receive instant alerts in your browser"
                enabled={false}
                hxPost="/settings/notifications/push"
                hxTarget="#notification-settings"
              />
            </div>
          </Section>

          <Section title="Account Settings">
            <div class="space-y-4">
              <FieldRow
                title="Language"
                description="Select your preferred language"
              >
                <Select
                  name="language"
                  options={[
                    { value: 'en', label: 'English', selected: true },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                    { value: 'de', label: 'German' },
                  ]}
                />
              </FieldRow>

              <DangerZone
                title="Delete account"
                description="This action cannot be undone"
                action={
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                }
              />
            </div>
          </Section>
        </div>

        <div id="notification-settings" class="hidden"></div>
      </div>
    </Layout>,
  );
});

export default settingsRouter;
