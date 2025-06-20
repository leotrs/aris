# Component Documentation Template

This file provides a template for documenting Vue components using JSDoc comments that are compatible with Vue Styleguidist.

## JSDoc Pattern

### Component-Level Documentation

```vue
<script setup>
/**
 * ComponentName - Brief description of the component
 *
 * Detailed description explaining what the component does, its main features,
 * and any important behavior. Include accessibility notes, dependencies, etc.
 *
 * @displayName ComponentName
 * @example
 * // Basic usage
 * <ComponentName prop="value" />
 *
 * @example
 * // Advanced usage with slots
 * <ComponentName prop="value">
 *   <template #slot-name="{ binding }">
 *     Custom content
 *   </template>
 * </ComponentName>
 *
 * @example
 * // Complex configuration
 * <ComponentName
 *   :config="{ option: true }"
 *   @event="handleEvent"
 * />
 */

...

</script>
```

### Prop Documentation

```javascript
const props = defineProps({
  /**
   * Brief description of what this prop does
   * @values 'option1', 'option2', 'option3' (for enums)
   * @see https://external-docs-url (for references)
   */
  propName: {
    type: String,
    default: "defaultValue",
    validator: (value) => ['option1', 'option2'].includes(value)
  },

  /**
   * Boolean prop description
   */
  booleanProp: {
    type: Boolean,
    default: false
  },

  /**
   * Object/Array prop with detailed structure
   * @example { key: 'value', nested: { prop: true } }
   */
  objectProp: {
    type: Object,
    default: () => ({})
  }
})
```

### Expose Documentation

```javascript
/**
 * Exposes methods and properties for parent components
 * @expose {Function} methodName - Description of the method
 * @expose {ComputedRef<Type>} computedProp - Description of computed property
 */
defineExpose({
  methodName: () => { /* implementation */ },
  computedProp: computed(() => someValue)
})
```

### Slot Documentation

```vue
<template>
  <!--
    @slot slotName - Description of the slot's purpose
    @binding {Type} bindingName - Description of slot binding
    @example
    <template #slotName="{ bindingName }">
      Custom content using {{ bindingName }}
    </template>
  -->
  <slot name="slotName" :binding-name="value" />

  <!--
    @slot default - Default slot content description
    @example
    <ComponentName>
      Default slot content
    </ComponentName>
  -->
  <slot />
</template>
```

## Key JSDoc Tags for Vue Styleguidist

- `@displayName` - Component name shown in Styleguidist
- `@example` - Code examples that Styleguidist can render
- `@values` - Enumerated values for string props
- `@see` - Links to external documentation
- `@slot` - Slot documentation with binding info
- `@binding` - Slot binding parameters
- `@expose` - Exposed methods/properties via defineExpose

## Best Practices

1. **Always include @displayName** - Ensures consistent naming in Styleguidist
2. **Provide multiple @example blocks** - Show basic, intermediate, and advanced usage
3. **Document all prop validators** - Use @values for enums
4. **Include real-world examples** - Not just API demonstrations
5. **Document slot bindings clearly** - Show exactly what data is available
6. **Add accessibility notes** - Mention ARIA roles, keyboard navigation, etc.
7. **Reference external docs** - Use @see for Floating UI, Vue Router, etc.
8. **Keep examples realistic** - Use actual prop values and realistic content

## Migration to Vue Styleguidist

When ready to migrate to Vue Styleguidist:

1. Install vue-styleguidist: `npm install --save-dev vue-styleguidist`
2. Create styleguidist.config.js configuration
3. All JSDoc comments will be automatically parsed
4. Examples will become interactive playground demos
5. Prop tables will be auto-generated from defineProps + JSDoc

The JSDoc pattern established here is fully compatible with Vue Styleguidist and will require no changes during migration.
