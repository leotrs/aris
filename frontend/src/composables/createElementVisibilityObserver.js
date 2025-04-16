import { ref } from "vue";

export default function (el) {
  const isVisible = ref(false);
  let observer = null;

  if (el && el instanceof Element) {
    observer = new IntersectionObserver(
      ([entry]) => (isVisible.value = entry.isIntersecting),
      { threshold: 0.25 }
    );
  }
  observer.observe(el);

  const tearDown = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  return { isVisible, tearDown };
}
