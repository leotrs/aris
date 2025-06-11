import { config } from '@vue/test-utils';

config.global.stubs = {
  Teleport: true,
  RouterLink: true,
  RouterView: true,
  Transition: true,
  TransitionGroup: true,
};

// Silence all Vue warning messages in tests (missing components/injections, etc.)
config.global.config.warnHandler = () => {};