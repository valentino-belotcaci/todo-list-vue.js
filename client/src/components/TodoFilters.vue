<template>
  <div class="filters-wrapper">
    <div class="toggle">
      <button @click="$emit('toggleAll')">Toggle all</button>
      <button @click="$emit('clearCompleted')">Remove completed tasks</button>
    </div>

    <div class="sort">
      <button
        @click="$emit('sort', 'date')"
        :class="{ active: sortMode === 'date' }"
      >
        Sort by date
      </button>
      <button
        @click="$emit('sort', 'priority')"
        :class="{ active: sortMode === 'priority' }"
      >
        Sort by priority
      </button>
    </div>

    <div class="filters">
      <button
        @click="$emit('filter', 'all')"
        :class="{ 'is-active': filter === 'all' }"
      >
        All
      </button>
      <button
        @click="$emit('filter', 'active')"
        :class="{ 'is-active': filter === 'active' }"
      >
        Active
      </button>
      <button
        @click="$emit('filter', 'done')"
        :class="{ 'is-active': filter === 'done' }"
      >
        Completed
      </button>
      <span id="counter">{{ count }} items</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TodoFilters",
  props: {
    filter: { type: String, required: true },
    sortMode: { type: String, required: true },
    count: { type: Number, required: true },
  },
  emits: ["filter", "sort", "toggleAll", "clearCompleted"],
};
</script>

<style scoped>
.filters-wrapper {
  width: 90%;
  max-width: 620px;
}

.toggle,
.sort {
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
}

.toggle button,
.sort button {
  width: 49%;
  padding: 10px 14px;
  border: 0;
  border-radius: 6px;
  color: #111;
  font-weight: 600;
  cursor: pointer;
  background-color: #faf1d9;
}
.toggle button:hover,
.sort button:hover {
  background-color: #f2dfab;
  transition: 0.5s;
}
.sort button.active {
  background-color: #f7c948 !important;
  color: #111;
  box-shadow: 0 0 3px #b38b00 inset;
}

.filters {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
}
.filters button {
  width: 25%;
  padding: 10px 14px;
  border: 0;
  border-radius: 6px;
  color: #111;
  font-weight: 600;
  cursor: pointer;
  background-color: #faf1d9;
}
.filters button.is-active,
.filters button:hover {
  background-color: #f2dfab;
  transition: 0.5s;
}
</style>
