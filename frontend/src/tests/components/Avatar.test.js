import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Avatar from '@/components/Avatar.vue';

const createObjectURLMock = vi.fn(() => 'blob-url');
const revokeObjectURLMock = vi.fn();
vi.stubGlobal('URL', {
  createObjectURL: createObjectURLMock,
  revokeObjectURL: revokeObjectURLMock,
});

describe('Avatar.vue', () => {
  let user;
  let api;
  let wrapper;

  beforeEach(() => {
    createObjectURLMock.mockClear();
    revokeObjectURLMock.mockClear();
  });

  async function mountAvatarWith(userValue, apiMock) {
    user = ref(userValue);
    api = apiMock;
    wrapper = mount(Avatar, {
      global: {
        provide: {
          user,
          api,
        },
      },
    });
    await nextTick();
    await nextTick();
    return wrapper;
  }

  it('renders user initials when api.get fails and user.initials provided', async () => {
    const userValue = { id: 1, name: 'Alice', initials: 'AL', color: 'blue' };
    api = { get: vi.fn().mockRejectedValue(new Error('not found')) };
    wrapper = await mountAvatarWith(userValue, api);

    expect(api.get).toHaveBeenCalledWith('/users/1/avatar', { responseType: 'blob' });
    expect(createObjectURLMock).not.toHaveBeenCalled();
    expect(revokeObjectURLMock).not.toHaveBeenCalled();

    const container = wrapper.get('.av-wrapper');
    expect(container.classes()).not.toContain('has-avatar');
    expect(container.element.style.backgroundColor).toBe('blue');
    expect(container.element.style.backgroundImage).toBe('none');

    const name = wrapper.get('.av-name');
    expect(name.text()).toBe('AL');
  });

  it('renders first character of user.name when no initials and api.get fails', async () => {
    const userValue = { id: 2, name: 'Bob', color: 'green' };
    api = { get: vi.fn().mockRejectedValue(new Error('not found')) };
    wrapper = await mountAvatarWith(userValue, api);

    const name = wrapper.get('.av-name');
    expect(name.text()).toBe('B');
  });

  it('fetches avatar and renders background image on success', async () => {
    const blob = new Blob(['data'], { type: 'image/png' });
    const userValue = { id: 3, name: 'Carol', initials: 'C', color: 'red' };
    api = { get: vi.fn().mockResolvedValue({ data: blob }) };
    wrapper = await mountAvatarWith(userValue, api);

    expect(api.get).toHaveBeenCalledWith('/users/3/avatar', { responseType: 'blob' });
    expect(createObjectURLMock).toHaveBeenCalledWith(blob);
    expect(revokeObjectURLMock).not.toHaveBeenCalled();

    const container = wrapper.get('.av-wrapper');
    expect(container.classes()).toContain('has-avatar');
    expect(container.element.style.backgroundColor).toBe('transparent');
    expect(container.element.style.backgroundImage).toBe('url("blob-url")');
    expect(wrapper.find('.av-name').exists()).toBe(false);
  });
});