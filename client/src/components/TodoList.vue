<template>
  <ul id="todos" @dragover.prevent>
    <TodoItem
      v-for="(todo, index) in todos"
      :key="todo._id || index"
      :todo="todo"
      :dragOver="dragOverIndex === index"
      @toggle="$emit('toggle', $event)"
      @edit="$emit('edit', $event)"
      @remove="$emit('remove', $event)"
      @dragstart="onDragStart(index)"
      @dragenter="onDragEnter(index)"
      @dragleave="onDragLeave"
      @drop="onDrop(index)"
    />
  </ul>
</template>

<script>
import TodoItem from "./TodoItem.vue";

export default {
  name: "TodoList",
  components: { TodoItem },
  props: {
    todos: { type: Array, required: true },
  },
  data() {
    return {
      dragStartIndex: null,
      dragOverIndex: null,
    };
  },
  methods: {
    onDragStart(idx) {
      this.dragStartIndex = idx;
    },
    onDragEnter(idx) {
      this.dragOverIndex = idx;
    },
    onDragLeave() {
      this.dragOverIndex = null;
    },
    onDrop(toIdx) {
      if (this.dragStartIndex == null || toIdx == null) return;
      const arr = [...this.todos];
      const [moved] = arr.splice(this.dragStartIndex, 1);
      arr.splice(toIdx, 0, moved);
      this.dragStartIndex = null;
      this.dragOverIndex = null;
      this.$emit("reorder", arr);
    },
  },
};
</script>

<style scoped>
#todos {
  width: 90%;
  max-width: 620px;
  padding: 0;
}
</style>
