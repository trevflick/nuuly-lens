import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ExampleComponent from '../ExampleComponent.vue'

describe('ExampleComponent', () => {
  it('should render properly', () => {
    const wrapper = mount(
      ExampleComponent, {
        props: {
          message: 'Hello',
          showBorder: true
        },
      }
    )

    expect(wrapper.text()).toContain('Hello')
  })
})
