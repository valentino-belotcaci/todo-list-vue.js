<template>
  <li
    class="todo-li"
    :class="[
      {
        'low-p': todo.priority === 1,
        'med-p': todo.priority === 2,
        'high-p': todo.priority === 3,
      },
      { checked: todo.completed },
      { over: dragOver },
    ]"
    draggable="true"
    @dragstart="$emit('dragstart')"
    @dragenter.prevent="$emit('dragenter')"
    @dragleave="$emit('dragleave')"
    @drop.prevent="$emit('drop')"
  >
    <input
      type="checkbox"
      :checked="todo.completed"
      @change="$emit('toggle', todo)"
    />

    <span v-if="editMode === false" @dblclick="startEdit">
      {{ todo.title }}
    </span>

    <input
      v-else
      ref="editInput"
      v-model="editText"
      type="text"
      @keydown.enter.prevent="finishEdit"
      @keydown.esc.prevent="cancelEdit"
      @blur="finishEdit"
    />

    <p class="item-date">{{ formatDate(todo.date) }}</p>
    <button class="deleteBtn" @click="$emit('remove', todo)">x</button>
  </li>
</template>

<script>
export default {
  name: "TodoItem",
  props: {
    todo: { type: Object, required: true },
    dragOver: { type: Boolean, default: false },
  },
  data() {
    return {
      editMode: false,
      editText: "",
    };
  },
  methods: {
    startEdit() {
      this.editMode = true;
      this.editText = this.todo.title;
      this.$nextTick(() => this.$refs.editInput.focus());
    },
    finishEdit() {
      if (!this.editMode) return;
      this.editMode = false;
      const newTitle = this.editText.trim();
      if (newTitle && newTitle !== this.todo.title)
        this.$emit("edit", { ...this.todo, title: newTitle });
    },
    cancelEdit() {
      this.editMode = false;
    },
    formatDate(d) {
      if (!d) return "";
      const dateObj = typeof d === "string" ? new Date(d) : d;
      return new Intl.DateTimeFormat("it-IT", {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(dateObj);
    },
  },
};
</script>

<style scoped>
.todo-li {
  list-style-type: none;
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
}

.low-p {
  border: solid 1px #bafcd4;
  background-color: #bafcd4;
}
.med-p {
  border: solid 1px #f9e2ab;
  background-color: #f9e2ab;
}
.high-p {
  border: solid 1px #fcbaba;
  background-color: #fcbaba;
}

.todo-li.checked span {
  text-decoration: line-through;
  color: gray;
}
.todo-li.over {
  background-color: #eaeaea;
  border: 2px dashed #aaa;
}

.todo-li span {
  word-break: break-word;
  overflow-wrap: break-word;
  text-align: left;
  width: 85%;
}
.item-date {
  width: 23%;
  margin: 0;
}
input[type="checkbox"] {
  margin: 0;
}

.deleteBtn {
  margin-left: auto;
  height: 100%;
  width: 32px;
  border: 0;
  cursor: pointer;
  background-color: transparent;
}
.deleteBtn:hover {
  background-color: #dfdfdd;
}
</style>
