import Avatar from "./Avatar.vue";

// Mock the API for fetching avatars
const mockApi = {
  get: (url) => {
    if (url.includes("/users/1/avatar")) {
      // Return a mock blob for user 1
      const svgString = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#FFD700"/></svg>`;
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      return Promise.resolve({ data: blob });
    } else if (url.includes("/users/4/avatar")) {
      // Return a mock blob for user 4
      const svgString = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="80" height="80" fill="#8A2BE2"/></svg>`;
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      return Promise.resolve({ data: blob });
    }
    // For other users, simulate no avatar found
    return Promise.reject(new Error("Avatar not found"));
  },
};

export default {
  title: "Base/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: {
        type: "select",
      },
      options: ["sm", "md"],
      description: "Size of the avatar.",
    },
    user: {
      control: {
        type: "object",
      },
      description: "User object containing id, name, initials, and color.",
    },
    tooltip: {
      control: {
        type: "boolean",
      },
      description: "Whether to show a tooltip with the user's name on hover.",
    },
  },
  // Add a global decorator to provide the mocked API
  decorators: [
    (story) => ({
      components: { story },
      provide: {
        api: mockApi,
      },
      template: "<story />",
    }),
  ],
};

export const Default = {
  args: {
    user: {
      id: 1,
      name: "John Doe",
      initials: "JD",
      color: "#FF5733",
    },
    size: "md",
    tooltip: true,
  },
};

export const Small = {
  args: {
    user: {
      id: 2,
      name: "Jane Smith",
      initials: "JS",
      color: "#33FF57",
    },
    size: "sm",
    tooltip: true,
  },
};

export const NoInitials = {
  args: {
    user: {
      id: 3,
      name: "Alice Wonderland",
      color: "#3357FF",
    },
    size: "md",
    tooltip: true,
  },
};

export const NoTooltip = {
  args: {
    user: {
      id: 4,
      name: "Bob The Builder",
      initials: "BTB",
      color: "#FF33A1",
    },
    size: "md",
    tooltip: false,
  },
};

export const WithFetchedAvatar = {
  args: {
    user: {
      id: 1,
      name: "User With Avatar",
      initials: "UA",
      color: "#00CED1",
    },
    size: "md",
    tooltip: true,
  },
};

export const FetchedAvatarSmall = {
  args: {
    user: {
      id: 4,
      name: "Small Fetched Avatar",
      initials: "SF",
      color: "#DAA520",
    },
    size: "sm",
    tooltip: true,
  },
};
