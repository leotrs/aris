import SearchBar from "./SearchBar.vue";
import Button from "../base/Button.vue";
import { action } from "@storybook/addon-actions";
import { ref, computed } from "vue";

export default {
  title: "Utility/SearchBar",
  component: SearchBar,
  tags: ["autodocs"],
  argTypes: {
    withButtons: {
      control: "boolean",
      description: "Whether to show navigation buttons (prev/next)",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the search input",
    },
    hintText: {
      control: "text",
      description: 'Hint text to display between navigation buttons (e.g., "3 of 15")',
    },
    showIcon: {
      control: "boolean",
      description: "Whether to show the search icon",
    },
    buttonClose: {
      control: "boolean",
      description: "Whether to show the close button",
    },
    buttonsDisabled: {
      control: "boolean",
      description: "Whether navigation buttons are disabled",
    },
    onSubmit: { action: "submit" },
    onCancel: { action: "cancel" },
    onNext: { action: "next" },
    onPrev: { action: "prev" },
  },
  args: {
    withButtons: false,
    placeholder: "Search...",
    hintText: "",
    showIcon: true,
    buttonClose: false,
    buttonsDisabled: false,
  },
};

export const Default = {};

export const WithoutIcon = {
  args: {
    showIcon: false,
    placeholder: "Type to search...",
  },
};

export const WithNavigationButtons = {
  args: {
    withButtons: true,
    hintText: "3 of 15",
    placeholder: "Find in document...",
  },
};

export const NavigationButtonsDisabled = {
  args: {
    withButtons: true,
    hintText: "No results",
    buttonsDisabled: true,
    placeholder: "Search documents...",
  },
};

export const WithCloseButton = {
  args: {
    buttonClose: true,
    placeholder: "Search and filter...",
  },
};

export const AllFeatures = {
  args: {
    withButtons: true,
    buttonClose: true,
    hintText: "5 of 42",
    placeholder: "Search with all features...",
  },
};

export const InteractiveSearch = {
  render: () => ({
    components: { SearchBar },
    setup() {
      const searchQuery = ref("");
      const currentMatch = ref(0);
      const totalMatches = ref(0);
      const isSearching = ref(false);

      // Mock search data
      const mockResults = [
        "JavaScript fundamentals",
        "Vue.js components",
        "JavaScript async/await",
        "TypeScript basics",
        "JavaScript ES6 features",
      ];

      const filteredResults = computed(() => {
        if (!searchQuery.value) return [];
        return mockResults.filter((item) =>
          item.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      });

      const hintText = computed(() => {
        if (!isSearching.value || filteredResults.value.length === 0) return "";
        return `${currentMatch.value + 1} of ${filteredResults.value.length}`;
      });

      const handleSubmit = (query) => {
        action("submit")(query);
        searchQuery.value = query;
        isSearching.value = true;
        totalMatches.value = filteredResults.value.length;
        currentMatch.value = 0;
      };

      const handleNext = () => {
        action("next")();
        if (filteredResults.value.length > 0) {
          currentMatch.value = (currentMatch.value + 1) % filteredResults.value.length;
        }
      };

      const handlePrev = () => {
        action("prev")();
        if (filteredResults.value.length > 0) {
          currentMatch.value =
            currentMatch.value === 0 ? filteredResults.value.length - 1 : currentMatch.value - 1;
        }
      };

      const handleCancel = () => {
        action("cancel")();
        searchQuery.value = "";
        isSearching.value = false;
        currentMatch.value = 0;
        totalMatches.value = 0;
      };

      return {
        searchQuery,
        currentMatch,
        filteredResults,
        hintText,
        isSearching,
        handleSubmit,
        handleNext,
        handlePrev,
        handleCancel,
      };
    },
    template: `
      <div style="max-width: 600px;">
        <h3>Interactive Search Demo</h3>
        <p>Type "JavaScript" or "Vue" to see search results:</p>
        
        <SearchBar
          :with-buttons="isSearching"
          :hint-text="hintText"
          :buttons-disabled="filteredResults.length === 0"
          placeholder="Search tutorials..."
          @submit="handleSubmit"
          @next="handleNext"
          @prev="handlePrev"
          @cancel="handleCancel"
        />
        
        <div v-if="isSearching" style="margin-top: 20px;">
          <h4>Search Results ({{ filteredResults.length }} found):</h4>
          <ul style="list-style: none; padding: 0;">
            <li
              v-for="(result, index) in filteredResults"
              :key="index"
              :style="{
                padding: '8px 12px',
                background: index === currentMatch ? '#e3f2fd' : '#f5f5f5',
                border: index === currentMatch ? '2px solid #2196f3' : '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '4px',
                fontWeight: index === currentMatch ? 'bold' : 'normal'
              }"
            >
              {{ result }}
              <span v-if="index === currentMatch" style="color: #2196f3; margin-left: 8px;">
                ← Current
              </span>
            </li>
          </ul>
        </div>
        
        <div v-if="!isSearching" style="margin-top: 20px; color: #666;">
          <p><strong>Keyboard shortcuts:</strong></p>
          <ul>
            <li>Enter - Start search</li>
            <li>Enter (while searching) - Next result</li>
            <li>Shift+Enter - Previous result</li>
            <li>Escape - Cancel search</li>
          </ul>
        </div>
      </div>
    `,
  }),
};

export const WithCustomButtons = {
  render: () => ({
    components: { SearchBar, Button },
    setup() {
      const showFilters = () => {
        action("show-filters")();
        alert("Filters dialog would open here");
      };

      const showAdvanced = () => {
        action("show-advanced")();
        alert("Advanced search would open here");
      };

      return { showFilters, showAdvanced };
    },
    template: `
      <div style="max-width: 600px;">
        <h3>Custom Buttons Slot</h3>
        <p>SearchBar with additional action buttons:</p>
        
        <SearchBar
          placeholder="Search with custom actions..."
          @submit="(query) => action('submit')(query)"
        >
          <template #buttons>
            <Button
              kind="tertiary"
              icon="Filter"
              size="sm"
              @click="showFilters"
            />
            <Button
              kind="tertiary"
              icon="Settings"
              size="sm"
              @click="showAdvanced"
            />
          </template>
        </SearchBar>
        
        <div style="margin-top: 20px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
          <strong>Available Actions:</strong><br>
          • Filter button - Opens filter options<br>
          • Settings button - Opens advanced search<br>
          • Custom buttons are placed in the buttons slot
        </div>
      </div>
    `,
  }),
};

export const DifferentVariants = {
  render: () => ({
    components: { SearchBar },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 600px;">
        <div>
          <h4>Basic Search</h4>
          <SearchBar
            placeholder="Basic search..."
            @submit="(query) => action('submit')(query)"
          />
        </div>
        
        <div>
          <h4>Document Search with Navigation</h4>
          <SearchBar
            :with-buttons="true"
            hint-text="12 of 47"
            placeholder="Find in document..."
            @submit="(query) => action('submit')(query)"
            @next="() => action('next')()"
            @prev="() => action('prev')()"
          />
        </div>
        
        <div>
          <h4>Search with Close Button</h4>
          <SearchBar
            :button-close="true"
            placeholder="Search files and folders..."
            @submit="(query) => action('submit')(query)"
            @cancel="() => action('cancel')()"
          />
        </div>
        
        <div>
          <h4>No Icon, Navigation Disabled</h4>
          <SearchBar
            :show-icon="false"
            :with-buttons="true"
            :buttons-disabled="true"
            hint-text="No results"
            placeholder="Search returned no results..."
          />
        </div>
      </div>
    `,
  }),
};

export const FocusManagement = {
  render: () => ({
    components: { SearchBar, Button },
    setup() {
      const searchBarRef = ref(null);

      const focusSearchBar = () => {
        searchBarRef.value?.focusInput();
        action("focus-triggered")();
      };

      return { searchBarRef, focusSearchBar };
    },
    template: `
      <div style="max-width: 600px;">
        <h3>Focus Management Demo</h3>
        <p>Test programmatic focus control:</p>
        
        <div style="margin-bottom: 16px;">
          <Button @click="focusSearchBar">
            Focus Search Bar
          </Button>
        </div>
        
        <SearchBar
          ref="searchBarRef"
          placeholder="Click the button above to focus me..."
          @submit="(query) => action('submit')(query)"
        />
        
        <div style="margin-top: 20px; padding: 16px; background: #e7f3ff; border-radius: 8px;">
          <strong>Focus Features:</strong><br>
          • Click anywhere on the search bar to focus input<br>
          • Use exposed focusInput() method for programmatic focus<br>
          • Proper focus management for accessibility
        </div>
      </div>
    `,
  }),
};
