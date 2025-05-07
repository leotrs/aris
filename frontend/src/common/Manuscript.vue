<script>
  import { h, inject, onMounted, useTemplateRef } from "vue";
  import FeedbackIcon from "./FeedbackIcon.vue";

  export default {
    name: "Manuscript",
    props: {
      htmlString: {
        type: String,
        required: true,
      },
      replacements: {
        type: Array,
        default: () => [{ className: "hr-info", component: FeedbackIcon }],
        // Each item should have { className: "target-class", component: YourCustomComponent }
      },
    },

    setup(props) {
      const doc = inject("doc");
      const mountPointRef = useTemplateRef("manuscript-mount-point");
      onMounted(() => (doc.value.isMountedAt = mountPointRef));

      const makeRenderFn = (htmlString) => {
        // Build a map for quick component lookup by class name
        const replacementMap = {};
        props.replacements.forEach((item) => {
          if (item.className && item.component) {
            replacementMap[item.className] = item.component;
          }
        });

        // Function to convert DOM nodes to VNodes
        const createVNode = (node) => {
          // Handle text nodes
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
          }

          // Handle element nodes
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Extract attributes
            const data = {};
            const attrs = {};
            const props = {}; // For component props

            // Check if this is a div with a class that should be replaced
            let isReplacement = false;
            let replacementComponent = null;

            if (node.tagName.toLowerCase() === "div" && node.hasAttribute("class")) {
              const classNames = node.getAttribute("class").split(/\s+/).filter(Boolean);
              for (const className of classNames) {
                if (replacementMap[className]) {
                  isReplacement = true;
                  replacementComponent = replacementMap[className];
                  break;
                }
              }
            }

            Array.from(node.attributes || []).forEach((attr) => {
              // Handle event handlers (on*)
              if (attr.name.startsWith("on") && attr.name.length > 2) {
                const eventName = attr.name.substring(2).toLowerCase();
                attrs[attr.name] = attr.value; // Keep as attribute since we can't eval
              }
              // Handle style attribute
              else if (attr.name === "style") {
                const styleObj = {};
                attr.value.split(";").forEach((style) => {
                  const [prop, val] = style.split(":");
                  if (prop && val) {
                    // Convert kebab-case to camelCase for style properties
                    const camelProp = prop
                      .trim()
                      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                    styleObj[camelProp] = val.trim();
                  }
                });
                data.style = styleObj;
              }
              // Handle class attribute
              else if (attr.name === "class") {
                data.class = attr.value.split(/\s+/).filter(Boolean);
              }
              // Handle misc. attributes that need no processing
              else if (["id", "href", "data-nodeid", "tabindex"].includes(attr.name)) {
                data[attr.name] = attr.value;
              }
              // For components, convert attributes to props
              else if (isReplacement) {
                // Convert kebab-case to camelCase for component props
                const camelProp = attr.name.replace(/-([a-z])/g, (_, letter) =>
                  letter.toUpperCase()
                );
                props[camelProp] = attr.value;
              }
              // Handle other attributes
              else {
                attrs[attr.name] = attr.value;
              }
            });

            if (Object.keys(attrs).length) {
              data.attrs = attrs;
            }

            // Get child nodes recursively
            const children = Array.from(node.childNodes)
              .map(createVNode)
              .filter((vnode) => vnode !== null && vnode !== "");

            // If this is a replacement component, pass children as slot
            if (isReplacement) {
              // For a component, we should pass props directly
              return h(
                replacementComponent,
                { ...props, ...data }, // Combine props and other data
                { default: () => (children.length ? children : undefined) }
              );
            }

            // Otherwise create regular VNode
            return h(node.tagName.toLowerCase(), data, children.length ? children : undefined);
          }

          // Skip comment nodes and other node types
          return null;
        };

        // Process HTML string
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlString, "text/html");
        const bodyContent = Array.from(dom.body.childNodes)
          .map(createVNode)
          .filter((vnode) => vnode !== null && vnode !== "");

        // Attach a ref to the root node -- and remember to return a render function
        return () => h("div", { ref: "manuscript-mount-point" }, bodyContent);
      };

      return () => makeRenderFn(props.htmlString)();
    },
  };
</script>

<style>
  /* Overwrite RSM's CSS but be CAREFUL!!! */
  .manuscriptwrapper {
    /* The background color comes from the user's choice within the settings overlay */
    background-color: transparent !important;

    /* Overwrite size and whitespace */
    margin: 0 !important;
    max-width: unset !important;
    padding-bottom: 48px !important;
    padding-inline: 0px !important;
    border-radius: 0px !important;

    & section.level-1 {
      margin-block: 0px !important;
    }

    /* Patches - for some reason the RSM CSS is broken? */
    & .hr .hr-border-zone .hr-border-dots .icon.dots {
      padding-bottom: 0 !important;
    }

    & .hr .hr-collapse-zone .hr-collapse .icon.collapse {
      padding-bottom: 0 !important;
    }
  }
</style>
