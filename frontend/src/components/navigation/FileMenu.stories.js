import FileMenu from './FileMenu.vue';
import { action } from '@storybook/addon-actions';
import { ref } from 'vue';

export default {
  title: 'Navigation/FileMenu',
  component: FileMenu,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: ['Dots', 'Menu', 'MoreHorizontal'],
      description: 'Icon for the menu trigger (when in ContextMenu mode)',
    },
    mode: {
      control: 'select',
      options: ['ContextMenu', 'ButtonRow'],
      description: 'Display mode for the menu',
    },
    onRename: { action: 'rename' },
    onDuplicate: { action: 'duplicate' },
    onDelete: { action: 'delete' },
  },
  args: {
    icon: 'Dots',
    mode: 'ContextMenu',
  },
};

export const ContextMenuMode = {};

export const ButtonRowMode = {
  args: {
    mode: 'ButtonRow',
  },
};

export const DifferentTriggerIcons = {
  render: () => ({
    components: { FileMenu },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Dots Icon (Default)</h4>
          <FileMenu
            icon="Dots"
            @rename="() => action('rename')()"
            @duplicate="() => action('duplicate')()"
            @delete="() => action('delete')()"
          />
        </div>
        
        <div>
          <h4>Menu Icon</h4>
          <FileMenu
            icon="Menu"
            @rename="() => action('rename')()"
            @duplicate="() => action('duplicate')()"
            @delete="() => action('delete')()"
          />
        </div>
        
        <div>
          <h4>More Horizontal Icon</h4>
          <FileMenu
            icon="MoreHorizontal"
            @rename="() => action('rename')()"
            @duplicate="() => action('duplicate')()"
            @delete="() => action('delete')()"
          />
        </div>
      </div>
    `,
  }),
};

export const ModeComparison = {
  render: () => ({
    components: { FileMenu },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div>
          <h3>Context Menu Mode</h3>
          <p>Click the dots to open a dropdown menu:</p>
          <div style="display: flex; justify-content: flex-start;">
            <FileMenu
              mode="ContextMenu"
              @rename="() => action('rename')()"
              @duplicate="() => action('duplicate')()"
              @delete="() => action('delete')()"
            />
          </div>
        </div>
        
        <div>
          <h3>Button Row Mode</h3>
          <p>All actions displayed as horizontal buttons:</p>
          <div style="display: flex; justify-content: flex-start;">
            <FileMenu
              mode="ButtonRow"
              @rename="() => action('rename')()"
              @duplicate="() => action('duplicate')()"
              @delete="() => action('delete')()"
            />
          </div>
        </div>
      </div>
    `,
  }),
};

export const InteractiveDemo = {
  render: () => ({
    components: { FileMenu },
    setup() {
      const selectedMode = ref('ContextMenu');
      const selectedIcon = ref('Dots');
      const actionLog = ref([]);
      
      const logAction = (actionName) => {
        const timestamp = new Date().toLocaleTimeString();
        actionLog.value.unshift(`${timestamp}: ${actionName} clicked`);
        action(actionName)();
        
        // Keep only last 5 actions
        if (actionLog.value.length > 5) {
          actionLog.value = actionLog.value.slice(0, 5);
        }
      };
      
      const clearLog = () => {
        actionLog.value = [];
      };
      
      return {
        selectedMode,
        selectedIcon,
        actionLog,
        logAction,
        clearLog,
      };
    },
    template: `
      <div style="max-width: 600px;">
        <h3>Interactive FileMenu Demo</h3>
        
        <div style="display: flex; gap: 24px; margin-bottom: 24px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: bold;">Mode:</label>
            <select v-model="selectedMode" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              <option value="ContextMenu">Context Menu</option>
              <option value="ButtonRow">Button Row</option>
            </select>
          </div>
          
          <div v-if="selectedMode === 'ContextMenu'">
            <label style="display: block; margin-bottom: 8px; font-weight: bold;">Trigger Icon:</label>
            <select v-model="selectedIcon" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              <option value="Dots">Dots</option>
              <option value="Menu">Menu</option>
              <option value="MoreHorizontal">More Horizontal</option>
            </select>
          </div>
        </div>
        
        <div style="margin-bottom: 24px; padding: 20px; border: 2px dashed #ccc; border-radius: 8px;">
          <h4>File Menu Component:</h4>
          <FileMenu
            :mode="selectedMode"
            :icon="selectedIcon"
            @rename="() => logAction('rename')"
            @duplicate="() => logAction('duplicate')"
            @delete="() => logAction('delete')"
          />
        </div>
        
        <div style="background: #f8f9fa; padding: 16px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h4 style="margin: 0;">Action Log:</h4>
            <button @click="clearLog" style="padding: 4px 8px; font-size: 12px; border: 1px solid #ccc; border-radius: 4px; background: white;">
              Clear
            </button>
          </div>
          <div v-if="actionLog.length === 0" style="color: #666; font-style: italic;">
            No actions yet. Try clicking the menu items above.
          </div>
          <ul v-else style="margin: 0; padding-left: 20px;">
            <li v-for="log in actionLog" :key="log" style="margin-bottom: 4px; font-family: monospace; font-size: 14px;">
              {{ log }}
            </li>
          </ul>
        </div>
      </div>
    `,
  }),
};

export const ProgrammaticControl = {
  render: () => ({
    components: { FileMenu },
    setup() {
      const fileMenuRef = ref(null);
      
      const toggleMenu = () => {
        fileMenuRef.value?.toggle();
        action('toggle-triggered')();
      };
      
      return { fileMenuRef, toggleMenu };
    },
    template: `
      <div style="max-width: 600px;">
        <h3>Programmatic Control Demo</h3>
        <p>Test programmatic menu control (ContextMenu mode only):</p>
        
        <div style="margin-bottom: 16px;">
          <button @click="toggleMenu" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px;">
            Toggle File Menu
          </button>
        </div>
        
        <FileMenu
          ref="fileMenuRef"
          mode="ContextMenu"
          @rename="() => action('rename')()"
          @duplicate="() => action('duplicate')()"
          @delete="() => action('delete')()"
        />
        
        <div style="margin-top: 20px; padding: 16px; background: #e7f3ff; border-radius: 8px;">
          <strong>Programmatic Features:</strong><br>
          • Use the toggle() method to open/close the context menu<br>
          • Only works in ContextMenu mode<br>
          • Button row mode doesn't have a toggleable state
        </div>
      </div>
    `,
  }),
};

export const FileOperationsWorkflow = {
  render: () => ({
    components: { FileMenu },
    setup() {
      const fileName = ref('important-document.pdf');
      const operationHistory = ref([]);
      
      const handleRename = () => {
        const newName = prompt('Enter new filename:', fileName.value);
        if (newName && newName !== fileName.value) {
          const oldName = fileName.value;
          fileName.value = newName;
          operationHistory.value.unshift(`Renamed "${oldName}" to "${newName}"`);
          action('rename')(newName);
        }
      };
      
      const handleDuplicate = () => {
        const duplicatedName = fileName.value.replace(/(\.[^.]+)$/, '-copy$1');
        operationHistory.value.unshift(`Created duplicate: "${duplicatedName}"`);
        action('duplicate')(duplicatedName);
      };
      
      const handleDelete = () => {
        if (confirm(\`Are you sure you want to delete "\${fileName.value}"?\`)) {
          operationHistory.value.unshift(\`Deleted "\${fileName.value}"\`);
          fileName.value = '[File deleted]';
          action('delete')();
        }
      };
      
      const handleShare = () => {
        operationHistory.value.unshift(\`Shared "\${fileName.value}"\`);
        action('share')();
      };
      
      const handleDownload = () => {
        operationHistory.value.unshift(\`Downloaded "\${fileName.value}"\`);
        action('download')();
      };
      
      return {
        fileName,
        operationHistory,
        handleRename,
        handleDuplicate,
        handleDelete,
        handleShare,
        handleDownload,
      };
    },
    template: `
      <div style="max-width: 600px;">
        <h3>File Operations Workflow</h3>
        
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding: 16px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
          <div style="padding: 12px; background: #4a90e2; color: white; border-radius: 4px; font-size: 24px;">
            📄
          </div>
          <div style="flex: 1;">
            <h4 style="margin: 0; color: #333;">{{ fileName }}</h4>
            <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">PDF Document • 2.3 MB</p>
          </div>
          <FileMenu
            mode="ContextMenu"
            @rename="handleRename"
            @duplicate="handleDuplicate"
            @delete="handleDelete"
          />
        </div>
        
        <div style="display: flex; gap: 12px; margin-bottom: 24px;">
          <button @click="handleShare" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px;">
            📤 Share
          </button>
          <button @click="handleDownload" style="padding: 8px 16px; background: #17a2b8; color: white; border: none; border-radius: 4px;">
            📥 Download
          </button>
        </div>
        
        <div v-if="operationHistory.length > 0" style="background: #f8f9fa; padding: 16px; border-radius: 8px;">
          <h4>Operation History:</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li v-for="operation in operationHistory" :key="operation" style="margin-bottom: 4px;">
              {{ operation }}
            </li>
          </ul>
        </div>
        
        <div v-else style="background: #f8f9fa; padding: 16px; border-radius: 8px; color: #666; font-style: italic;">
          No operations performed yet. Try using the file menu or action buttons above.
        </div>
      </div>
    `,
  }),
};