import UserMenu from './UserMenu.vue';
import { action } from '@storybook/addon-actions';

// Mock user data
const mockUser = {
  id: 1,
  name: 'John Doe',
  initials: 'JD',
  color: '#007bff',
  email: 'john.doe@example.com',
};

// Mock router
const mockRouter = {
  push: (path) => {
    action('router.push')(path);
    console.log('Navigate to:', path);
  },
};

export default {
  title: 'Navigation/UserMenu',
  component: UserMenu,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      components: { story },
      provide: {
        user: mockUser,
      },
      setup() {
        return {
          $router: mockRouter,
        };
      },
      template: '<story />',
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: 'User account dropdown menu with avatar trigger and navigation options.',
      },
    },
  },
};

export const Default = {};

export const DifferentUser = {
  decorators: [
    (story) => ({
      components: { story },
      provide: {
        user: {
          id: 2,
          name: 'Jane Smith',
          initials: 'JS',
          color: '#28a745',
          email: 'jane.smith@example.com',
        },
      },
      setup() {
        return {
          $router: mockRouter,
        };
      },
      template: '<story />',
    }),
  ],
};

export const UserWithoutInitials = {
  decorators: [
    (story) => ({
      components: { story },
      provide: {
        user: {
          id: 3,
          name: 'Alice Wonderland',
          color: '#6f42c1',
          email: 'alice@example.com',
        },
      },
      setup() {
        return {
          $router: mockRouter,
        };
      },
      template: '<story />',
    }),
  ],
};

export const InteractiveDemo = {
  render: () => ({
    components: { UserMenu },
    provide: {
      user: mockUser,
    },
    setup() {
      return {
        $router: mockRouter,
      };
    },
    template: `
      <div style="padding: 50px;">
        <h3>User Menu Demo</h3>
        <p>Click on the avatar to open the user menu:</p>
        <UserMenu />
        <div style="margin-top: 20px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
          <strong>Current User:</strong><br>
          Name: ${mockUser.name}<br>
          Email: ${mockUser.email}<br>
          Initials: ${mockUser.initials}
        </div>
      </div>
    `,
  }),
};

export const MenuActions = {
  render: () => ({
    components: { UserMenu },
    provide: {
      user: mockUser,
    },
    setup() {
      const mockRouterWithLogging = {
        push: (path) => {
          action('router.push')(path);
          alert(\`Would navigate to: \${path}\`);
        },
      };
      
      return {
        $router: mockRouterWithLogging,
      };
    },
    template: `
      <div style="padding: 50px;">
        <h3>Menu Actions Demo</h3>
        <p>Click the avatar and then click menu items to see navigation actions:</p>
        <UserMenu />
        <div style="margin-top: 20px; padding: 16px; background: #e7f3ff; border-radius: 8px;">
          <strong>Available Actions:</strong><br>
          • Account - Navigate to user account<br>
          • Settings - Navigate to application settings<br>
          • Logout - Clear tokens and redirect to login
        </div>
      </div>
    `,
  }),
};