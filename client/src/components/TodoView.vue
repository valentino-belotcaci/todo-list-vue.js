<template>
  <div class="detail-container">
    <div class="header">
      <h2 class="list-title">{{ list.title }}</h2>
      <p class="list-sub">
        {{ list.description }}
        <span v-if="list.date" class="list-date"
          >· {{ formatDate(list.date) }}</span
        >
      </p>

      <div class="title-search">
        <div class="search-wrap">
          <input
            v-model="search"
            type="search"
            placeholder="Search by text or date/time"
          />
        </div>
      </div>
    </div>

    <!-- Add new task -->
    <TodoForm @add="addTodo" />

    <!-- Filter + Sort + Toggle -->
    <TodoFilters
      :filter="filter"
      :sortMode="sortMode"
      :count="visibleTodos.length"
      @filter="setFilter"
      @sort="setSortMode"
      @toggleAll="toggleAll"
      @clearCompleted="clearCompleted"
    />

    <!-- Todo list -->
    <TodoList
      :todos="visibleTodos"
      @toggle="toggle"
      @edit="finishEdit"
      @remove="remove"
      @reorder="reorder"
    />

    <p v-if="!visibleTodos.length" class="empty-msg">
      The list is empty at the moment.
    </p>

    <div v-if="errorMessage" class="error-text">{{ errorMessage }}</div>
    <div class="nav-back">
      <router-link to="/todos" class="back-link">← Back to Todos</router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import TodoForm from "./TodoForm.vue";
import TodoList from "./TodoList.vue";
import TodoFilters from "./TodoFilters.vue";

export default {
  name: "TodoListDetail",
  components: { TodoForm, TodoList, TodoFilters },
  data() {
    return {
      list: { title: "", description: "", date: "", todos: [] },
      search: "",
      filter: "all",
      sortMode: "",
      errorMessage: "",
    };
  },
  computed: {
    visibleTodos() {
      let arr = [...(this.list.todos || [])];

      const s = this.search.trim().toLowerCase();
      if (s) {
        arr = arr.filter((t) => {
          const txt = (t.title || "").toLowerCase();
          const dat = this.formatDate(t.date).toLowerCase();
          return txt.includes(s) || dat.includes(s);
        });
      }
      if (this.filter === "active") arr = arr.filter((t) => !t.completed);
      if (this.filter === "done") arr = arr.filter((t) => t.completed);

      if (this.sortMode === "date")
        arr.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      if (this.sortMode === "priority")
        arr.sort((a, b) => (b.priority || 0) - (a.priority || 0));

      return arr;
    },
  },
  async created() {
    await this.loadList();
  },
  methods: {
    formatDate(d) {
      if (!d) return "";
      const dateObj = typeof d === "string" ? new Date(d) : d;
      try {
        return new Intl.DateTimeFormat("it-IT", {
          dateStyle: "short",
          timeStyle: "medium",
        }).format(dateObj);
      } catch {
        return "";
      }
    },
    async loadList() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3000/todos/${this.$route.params.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.list = res.data || {};
        this.list.todos = Array.isArray(this.list.todos) ? this.list.todos : [];
        this.list.todos = this.list.todos.map((t) => ({
          priority: t.priority ?? 1,
          date: t.date || new Date().toISOString(),
          title: t.title || "",
          completed: !!t.completed,
          _id: t._id,
        }));
      } catch (err) {
        this.errorMessage = "Failed to load list.";
      }
    },
    setFilter(f) {
      this.filter = f;
    },
    setSortMode(m) {
      this.sortMode = m;
    },
    async addTodo({ title, priority }) {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `http://localhost:3000/todos/${this.$route.params.id}`,
          { title, priority },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await this.loadList();
      } catch {
        this.errorMessage = "Failed to add task.";
      }
    },
    async finishEdit(t) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `http://localhost:3000/todos/${this.$route.params.id}/${t._id}`,
          { title: t.title },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await this.loadList();
      } catch {
        this.errorMessage = "Failed to edit task.";
      }
    },
    async remove(t) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:3000/todos/${this.$route.params.id}/${t._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await this.loadList();
      } catch {
        this.errorMessage = "Failed to delete task.";
      }
    },
    async toggle(t, next) {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/todos/${this.$route.params.id}/${t._id}`,
        { completed: next ?? !t.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    async toggleAll() {
      const target = !this.list.todos.every((t) => t.completed); // true = check all, false = uncheck all
      await Promise.all(this.list.todos.map((t) => this.toggle(t, target)));
      await this.loadList();
    },
    async clearCompleted() {
      const done = this.list.todos.filter((t) => t.completed);
      for (const t of done) await this.remove(t);
    },
    reorder(arr) {
      this.list.todos = arr;
    },
  },
};
</script>

<style scoped>
.detail-container {
  background-color: white;
  min-height: 100vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: "Inter", sans-serif;
  align-items: center;
  width: 90%;
  max-width: 620px;
  margin: 0 auto;
  border-radius: 7px;
  padding: 20px 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}
.header {
  width: 90%;
  max-width: 620px;
}
.list-title {
  font-size: 28px;
  color: #333;
  margin: 0;
  text-align: left;
}
.list-sub {
  margin: 6px 0 18px;
  color: #333;
  text-align: left;
}
.list-date {
  color: #555;
  font-size: 14px;
}
.title-search {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}
.title-search h3 {
  font-size: 22px;
  margin: 0;
}
.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
.search-wrap input {
  width: 100%;
  padding: 10px;
  border-radius: 7px;
  border: 1px solid #333;
  background: #fff;
}
.empty-msg {
  text-align: center;
  color: gray;
}
.error-text {
  color: red;
  text-align: center;
  margin-top: 6px;
}
.nav-back {
  width: 90%;
  max-width: 620px;
}
.back-link {
  color: #333;
  text-decoration: underline;
}
.back-link:hover {
  color: #555;
}
</style>
