import axios from "axios";
import { User } from "../interfaces/Users/User";

const API: string = import.meta.env.VITE_USERS_API;

// Register new user
export function registerUser(normalizedUser: User) {
  return axios.post(API, normalizedUser);
}

// Login existing user
export function loginUser(values: { email: string; password: string }) {
  return axios.post(`${API}/login`, values);
}

// Get all users
export function getAllUsers() {
  return axios.get(API, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}

// Get user by id
export function getUserbyId(id: string) {
  return axios.get(`${API}/${id}`, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}

// Update user by id
export function updateUser(id: string, updatedUser: Partial<User>) {
  return axios.put(`${API}/${id}`, updatedUser, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}

// Delete User
export function deleteUser(id: string) {
  return axios.delete(`${API}/${id}`, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}

// Change user business status
export function changeBizStatus(id: string) {
  return axios.patch(`${API}/${id}`, null, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}
