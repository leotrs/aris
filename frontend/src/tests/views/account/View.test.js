import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ref, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import AccountView from '@/views/account/View.vue';

const createObjectURLMock = vi.fn(() => 'blob-url');
const revokeObjectURLMock = vi.fn();
vi.stubGlobal('URL', { createObjectURL: createObjectURLMock, revokeObjectURL: revokeObjectURLMock });

describe('AccountView', () => {
  let wrapper;
  let user;
  let api;
  const stubs = {
    HomeLayout: { template: '<div><slot/></div>' },
    Pane: { template: '<div><slot/></div>' },
    Section: { template: '<div><slot name="title"/><slot name="content"/><slot name="footer"/></div>' },
    IconUserCircle: true,
    InputText: { template: '<input v-bind="$attrs" />' },
    Button: { template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot/></button>' },
  };

  beforeEach(async () => {
    user = ref({
      id: 1,
      name: 'Alice',
      initials: 'AL',
      email: 'alice@example.com',
      created_at: '2020-01-01T00:00:00Z',
      color: 'blue',
    });
    api = {
      get: vi.fn().mockResolvedValue({ data: new Blob([''], { type: 'image/png' }) }),
      put: vi.fn().mockResolvedValue({ data: user.value }),
    };
    wrapper = mount(AccountView, {
      global: {
        stubs,
        provide: {
          xsMode: false,
          mobileMode: false,
          user,
          api,
        },
      },
    });
    await nextTick();
  });

  it('renders the username, email, and since date', () => {
    expect(wrapper.find('#username').text()).toBe('Alice');
    expect(wrapper.text()).toContain('alice@example.com');
    expect(wrapper.find('#since').text()).toContain('Aris user since');
  });

  it('calls api.put with updated profile and updates user ref on save', async () => {
    const newData = {
      id: 1,
      name: 'Bob',
      initials: 'BO',
      email: 'bob@example.com',
      created_at: '2020-01-01T00:00:00Z',
    };
    api.put.mockResolvedValue({ data: newData });
    wrapper.vm.newName = 'Bob';
    wrapper.vm.newInitials = 'BO';
    wrapper.vm.newEmail = 'bob@example.com';
    await wrapper.vm.onSave();
    expect(api.put).toHaveBeenCalledWith('/users/1', {
      name: 'Bob',
      initials: 'BO',
      email: 'bob@example.com',
    });
    expect(user.value).toMatchObject(newData);
  });
});