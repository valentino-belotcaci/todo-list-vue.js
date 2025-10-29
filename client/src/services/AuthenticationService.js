import api from "@/services/api";

/*
authenticationservice.js is going to export an object that has a register function
This defines a service object with a register() function.
It sends a POST request to:
http://localhost:3000/register
and includes the credentials data in the request body
*/
export default {
  register(credentials) {
    return api().post("register", credentials);
  },
};
