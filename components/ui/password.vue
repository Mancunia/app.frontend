<template>
  <div class="password-wrapper" :class="containerClass">
    <input 
      :id="id"
      :type="inputType"
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      :required="required"
      :name="name"
      autocomplete="current-password"
      class="password-input"
      :class="inputClass"
    />
    <button 
      type="button" 
      class="peek-btn" 
      @mousedown.prevent="toggleVisibility"
      tabindex="-1"
      aria-label="Toggle password visibility"
    >
      <i :class="isVisible ? 'bx bx-hide' : 'bx bx-show'"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '••••••••'
  },
  required: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  containerClass: {
    type: String,
    default: ''
  },
  inputClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'password'])

const isVisible = ref(false)

const inputType = computed(() => isVisible.value ? 'text' : 'password')
const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  emit('password', value)
}

const toggleVisibility = () => {
  console.log('Toggling password visibility')
  isVisible.value = !isVisible.value
}
</script>

<style scoped>
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.password-input {
  width: 100%;
  padding-right: 44px !important; /* Space for the icon */
  box-sizing: border-box;
}

/* Default styles - matching pages/app/auth/login.vue */
.password-input:not([class*="field-input"]):not([class*="input-field"]) {
  padding: 14px 16px;
  background: white;
  border: 1px solid var(--hairline);
  border-radius: 12px;
  font-family: var(--font-sans);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.password-input:not([class*="field-input"]):not([class*="input-field"]):focus {
  outline: none;
  border-color: var(--ochre);
  box-shadow: 0 0 0 4px rgba(201, 122, 58, 0.1);
}

.peek-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  z-index: 1;
}

.peek-btn:hover {
  color: var(--ink);
}

.peek-btn i {
  font-size: 1.5rem;
  display: block;
  line-height: 1;
}

.password-input::placeholder {
  color: var(--muted);
  opacity: 0.6;
}
</style>
