import Tag from "./Tag.vue";
import { action } from "@storybook/addon-actions";
import { ref } from "vue";

export default {
  title: "Tags/Tag",
  component: Tag,
  tags: ["autodocs"],
  argTypes: {
    tag: {
      control: "object",
      description: "Tag data object containing name and color information",
    },
    active: {
      control: "boolean",
      description: "Whether the tag is in active (filled) or inactive (outlined) state",
    },
    editable: {
      control: "boolean",
      description: "Whether the tag name can be edited inline",
    },
    editOnClick: {
      control: "boolean",
      description: "Whether clicking the tag should activate edit mode (when editable is true)",
    },
    clearOnStartRenaming: {
      control: "boolean",
      description: "Whether the input field should be cleared when editing starts",
    },
    onRename: { action: "rename" },
    onClick: { action: "click" },
  },
  args: {
    tag: { name: "Frontend", color: "blue" },
    active: false,
    editable: false,
    editOnClick: false,
    clearOnStartRenaming: false,
  },
};

export const Default = {};

export const Active = {
  args: {
    active: true,
  },
};

export const DifferentColors = {
  render: () => ({
    components: { Tag },
    setup() {
      const tags = [
        { name: "Frontend", color: "blue" },
        { name: "Backend", color: "green" },
        { name: "Critical", color: "red" },
        { name: "Design", color: "purple" },
        { name: "Testing", color: "orange" },
      ];
      return { tags };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <Tag v-for="tag in tags" :key="tag.name" :tag="tag" />
      </div>
    `,
  }),
};

export const ActiveAndInactive = {
  render: () => ({
    components: { Tag },
    setup() {
      const tags = [
        { name: "Active Tag", color: "blue", active: true },
        { name: "Inactive Tag", color: "blue", active: false },
        { name: "Active Red", color: "red", active: true },
        { name: "Inactive Red", color: "red", active: false },
      ];
      return { tags };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <Tag
          v-for="tag in tags"
          :key="tag.name"
          :tag="{ name: tag.name, color: tag.color }"
          :active="tag.active"
        />
      </div>
    `,
  }),
};

export const Editable = {
  args: {
    tag: { name: "Editable Tag", color: "green" },
    editable: true,
    editOnClick: true,
  },
  render: (args) => ({
    components: { Tag },
    setup() {
      const tagData = ref({ ...args.tag });

      const handleRename = (newName) => {
        action("rename")(newName);
        tagData.value.name = newName;
      };

      return { args, tagData, handleRename };
    },
    template: `
      <div>
        <Tag
          :tag="tagData"
          :active="args.active"
          :editable="args.editable"
          :edit-on-click="args.editOnClick"
          :clear-on-start-renaming="args.clearOnStartRenaming"
          @rename="handleRename"
        />
        <p style="margin-top: 16px; color: #666;">
          Click the tag to edit its name. Current name: "{{ tagData.name }}"
        </p>
      </div>
    `,
  }),
};

export const EditableClearOnStart = {
  args: {
    tag: { name: "Clear on Edit", color: "purple" },
    editable: true,
    editOnClick: true,
    clearOnStartRenaming: true,
  },
  render: (args) => ({
    components: { Tag },
    setup() {
      const tagData = ref({ ...args.tag });

      const handleRename = (newName) => {
        action("rename")(newName);
        tagData.value.name = newName;
      };

      return { args, tagData, handleRename };
    },
    template: `
      <div>
        <Tag
          :tag="tagData"
          :active="args.active"
          :editable="args.editable"
          :edit-on-click="args.editOnClick"
          :clear-on-start-renaming="args.clearOnStartRenaming"
          @rename="handleRename"
        />
        <p style="margin-top: 16px; color: #666;">
          Click to edit - the field will be cleared when editing starts.
        </p>
      </div>
    `,
  }),
};

export const TagCollection = {
  render: () => ({
    components: { Tag },
    setup() {
      const tags = ref([
        { name: "JavaScript", color: "blue", active: true },
        { name: "Vue.js", color: "green", active: true },
        { name: "TypeScript", color: "blue", active: false },
        { name: "CSS", color: "purple", active: true },
        { name: "HTML", color: "orange", active: false },
        { name: "Node.js", color: "green", active: false },
        { name: "React", color: "blue", active: false },
        { name: "Angular", color: "red", active: false },
      ]);

      const toggleTag = (index) => {
        tags.value[index].active = !tags.value[index].active;
      };

      return { tags, toggleTag };
    },
    template: `
      <div>
        <h3>Technology Tags (Click to toggle active state)</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px;">
          <Tag
            v-for="(tag, index) in tags"
            :key="tag.name"
            :tag="{ name: tag.name, color: tag.color }"
            :active="tag.active"
            @click="toggleTag(index)"
            style="cursor: pointer;"
          />
        </div>
        <p style="margin-top: 16px; color: #666;">
          Active tags: {{ tags.filter(t => t.active).length }} / {{ tags.length }}
        </p>
      </div>
    `,
  }),
};

export const InteractiveDemo = {
  render: () => ({
    components: { Tag },
    setup() {
      const tagData = ref({ name: "Interactive Tag", color: "blue" });
      const isActive = ref(false);
      const isEditable = ref(true);
      const editOnClick = ref(true);
      const clearOnStart = ref(false);

      const handleRename = (newName) => {
        action("rename")(newName);
        tagData.value.name = newName;
      };

      const handleClick = () => {
        action("click")();
        if (!isEditable.value) {
          isActive.value = !isActive.value;
        }
      };

      return {
        tagData,
        isActive,
        isEditable,
        editOnClick,
        clearOnStart,
        handleRename,
        handleClick,
      };
    },
    template: `
      <div>
        <div style="margin-bottom: 20px;">
          <h3>Interactive Tag Demo</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 16px;">
            <label style="display: flex; align-items: center; gap: 4px;">
              <input type="checkbox" v-model="isActive" />
              Active
            </label>
            <label style="display: flex; align-items: center; gap: 4px;">
              <input type="checkbox" v-model="isEditable" />
              Editable
            </label>
            <label style="display: flex; align-items: center; gap: 4px;">
              <input type="checkbox" v-model="editOnClick" :disabled="!isEditable" />
              Edit on Click
            </label>
            <label style="display: flex; align-items: center; gap: 4px;">
              <input type="checkbox" v-model="clearOnStart" :disabled="!isEditable" />
              Clear on Start
            </label>
          </div>
        </div>
        
        <Tag
          :tag="tagData"
          :active="isActive"
          :editable="isEditable"
          :edit-on-click="editOnClick"
          :clear-on-start-renaming="clearOnStart"
          @rename="handleRename"
          @click="handleClick"
        />
        
        <div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
          <strong>Current State:</strong><br>
          Name: "{{ tagData.name }}"<br>
          Active: {{ isActive }}<br>
          Editable: {{ isEditable }}<br>
          Edit on Click: {{ editOnClick }}<br>
          Clear on Start: {{ clearOnStart }}
        </div>
      </div>
    `,
  }),
};
