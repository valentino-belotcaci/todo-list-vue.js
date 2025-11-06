<template>
  <div class="register-container">
    <h1>Registration</h1>
    <div class="form-box">
      <input
        type="email"
        name="email"
        placeholder="Email"
        v-model="email"
        class="input-field"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        v-model="password"
        class="input-field"
      />
      <button @click="register" class="btn">Register</button>

      <p class="login-text">
        Already have an account?
        <router-link to="/" class="login-link">Login here</router-link>
      </p>

      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-text">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script>
import AuthenticationService from "@/services/AuthenticationService";
export default {
  methods: {
    async register() {
      this.errorMessage = "";
      this.successMessage = "";

      try {
        const response = await AuthenticationService.register({
          email: this.email,
          password: this.password,
        });
        this.successMessage = response.data.message;
      } catch (err) {
        // show backend message if available
        this.errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Unexpected error";
      }
    },
  },
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      successMessage: "",
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.register-container {
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
}

.input-field {
  width: 250px;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 6px;
  outline: none;
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

.login-text {
  margin-top: 15px;
  color: #333;
  font-size: 14px;
}

.login-link {
  color: #333;
  font-weight: bold;
  text-decoration: underline;
}

.login-link:hover {
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
