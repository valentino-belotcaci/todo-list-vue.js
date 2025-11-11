<template>
  <div class="row">
    <input
      v-model="text"
      type="text"
      placeholder="New task…"
      @keydown.enter.prevent="submit"
    />
    <select v-model.number="priority">
      <option :value="1">Low</option>
      <option :value="2">Medium</option>
      <option :value="3">High</option>
    </select>
    <button @click="submit" :disabled="!text.trim()">Add</button>
  </div>
</template>

<script>
export default {
  name: "TodoForm",
  emits: ["add"],
  data() {
    return {
      text: "",
      priority: 1,
    };
  },
  methods: {
    submit() {
      const title = this.text.trim();
      if (!title) return;
      this.$emit("add", { title, priority: this.priority });
      this.text = "";
      this.priority = 1;
    },
  },
};
</script>

<style scoped>
.row {
  width: 90%;
  max-width: 620px;
  margin: 6px auto;
  gap: 25px;
  display: flex;
}
.row input[type="text"] {
  width: 70%;
  padding: 10px 12px;
  border-radius: 7px;
  border: 1px solid #333;
  background: #fff;
}
select {
  padding: 5px 10px;
  font-size: 13px;
  border: 0;
  border-radius: 4px;
  background-color: #faf1d9;
}
.row button {
  width: 25%;
  padding: 10px 14px;
  border: 0;
  border-radius: 6px;
  color: #111;
  font-weight: 600;
  cursor: pointer;
  background-color: #faf1d9;
}
.row button:hover {
  background-color: #f2dfab;
  transition: 0.5s;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
