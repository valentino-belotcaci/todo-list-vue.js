<template>
  <div class="create-container">
    <h1>Create New Todo</h1>

    <div class="form-box">
      <input
        v-model="title"
        type="text"
        placeholder="Title"
        class="input-field"
      />
      <textarea
        v-model="description"
        placeholder="Description (optional)"
        class="textarea-field"
      ></textarea>

      <button @click="createTodo" class="btn">Save Todo</button>
      <router-link to="/todos" class="back-link">Back to Todos</router-link>

      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-text">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      title: "",
      description: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async createTodo() {
      this.errorMessage = "";
      this.successMessage = "";

      if (!this.title) {
        this.errorMessage = "Title is required.";
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          "http://localhost:3000/todos",
          { title: this.title, description: this.description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(res.data);

        this.successMessage = "Todo created successfully!";
        this.title = "";
        this.description = "";

        setTimeout(() => this.$router.push("/todos"), 800);
      } catch (err) {
        this.errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create todo.";
      }
    },
  },
};
</script>

<style scoped>
.create-container {
  background-color: #faf1d9;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Inter", sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.form-box {
  background-color: #f2dfab;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
}

.input-field,
.textarea-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 6px;
  outline: none;
  resize: none;
}

.textarea-field {
  height: 80px;
}

.btn {
  background-color: #333;
  color: white;
  padding: 10px 20px;
  margin-top: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #555;
}

.back-link {
  margin-top: 15px;
  color: #333;
  font-size: 14px;
  text-decoration: underline;
}

.back-link:hover {
  color: #555;
}

.error-text {
  color: red;
  margin-top: 10px;
  font-weight: 500;
}

.success-text {
  color: green;
  margin-top: 10px;
  font-weight: 500;
}
</style>
