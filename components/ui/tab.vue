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

<style>
.tab {
  cursor: pointer;
  padding: 10px 20px;
  display: inline-block;
  background: #f1f1f1;
  margin-right: 2px;
}

.tab.active {
  background: #ccc;
}

.tab-content {
  display: none;
  padding: 20px;
  border: 1px solid #ccc;
  margin-top: 10px;
}

.tab-content.active {
  display: block;
}
</style>
