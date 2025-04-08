import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageUpload from '@/components/ImageUpload.vue'

describe('ImageUpload.vue', () => {
  it('renders upload button', () => {
    const wrapper = mount(ImageUpload)
    expect(wrapper.text()).toContain('Match')
  })
})
