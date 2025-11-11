<template>
  <div class="todo-container">
    <h1>Your Todo Lists</h1>

    <div class="actions">
      <router-link to="/todos/new" class="btn">+ New Todo</router-link>
      <button @click="logout" class="btn logout">Logout</button>
    </div>

    <div v-if="errorMessage" class="error-text">{{ errorMessage }}</div>

    <ul class="todo-list">
      <li
        v-for="todo in todos"
        :key="todo._id"
        class="todo-item"
        @click="viewTodo(todo._id)"
      >
        <div class="todo-header">
          <h3 class="todo-title">{{ todo.title }}</h3>
        </div>

        <div class="todo-row">
          <p class="todo-description">{{ todo.description }}</p>
          <p class="todo-date">{{ formatDate(todo.date) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("en-GB", {
        timeZone: "Europe/Rome",
      });
    },
    viewTodo(id) {
      this.$router.push(`/todos/${id}`);
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/");
    },
  },
  async created() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.todos = response.data;
    } catch (err) {
      this.errorMessage =
        err.response?.data?.message || "Failed to load todos.";
      console.error(err);
    }
  },
  data() {
    return {
      todos: [],
      errorMessage: "",
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.todo-container {
  background-color: #faf1d9;
  min-height: 100vh;
  padding: 30px;
  font-family: "Inter", sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-list {
  list-style: none;
  padding: 0;
  max-width: 600px;
  margin: 0 auto;
}

.todo-item {
  background-color: #f2dfab;
  border-radius: 8px;
  padding: 15px 20px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: transform 0.2s;
}

.todo-item:hover {
  transform: scale(1.02);
}

.btn {
  background-color: #333;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #555;
}

.logout {
  background-color: #a33;
}

.logout:hover {
  background-color: #c44;
}

.error-text {
  color: red;
  text-align: center;
  margin-bottom: 10px;
}

.todo-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.todo-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-description {
  color: #333;
  font-size: 14px;
  flex: 1;
  text-align: left;
}

.todo-date {
  font-size: 13px;
  color: #555;
  white-space: nowrap;
  margin-left: 15px;
}

.todo-header {
  margin-bottom: 6px;
  text-align: left;
}

.todo-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
