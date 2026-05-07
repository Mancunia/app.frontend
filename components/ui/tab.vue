<template>
  <div>
    <div class="tab" v-for="(tab, index) in tabs" :key="index" :class="{ active: activeTab === index }"
      @click="showTab(index)">
      {{ tab }}
    </div>

    <div v-for="(content, index) in tabContents" :key="index"
      :class="{ 'tab-content': true, active: activeTab === index }">
      <slot :name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">

const activeTab = ref(0);
const tabs = ref < string[] > ([]);
const tabContents = ref < string[] > ([]);

const showTab = (index: number) => {
  activeTab.value = index;
};

onMounted(() => {
  const slots = useSlots();
  tabs.value = slots.header?.().map((slot: any) => (slot.children as { default: () => string }).default()) || [];
  tabContents.value = slots.default?.().map((_: any, index:number) => `content-${index}`) || [];
});
</script>

<style scoped>
.tab {
  cursor: pointer; padding: 6px 14px; display: inline-block;
  font-family: var(--font-display); font-size: 0.85rem; color: var(--muted);
  background: transparent; border-bottom: 2px solid transparent;
}
.tab.active { color: var(--kola); border-bottom-color: var(--kola); background: transparent; }
.tab-content { display: none; padding: 20px; border-top: 1px solid var(--hairline); }
.tab-content.active { display: block; }
</style>
