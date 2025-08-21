import { useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getProfile,
} from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile if token exists
  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function login(credentials) {
    const loggedInUser = await loginUser(credentials);
    setUser(loggedInUser);
  }

  async function register(formData) {
    const newUser = await registerUser(formData);
    setUser(newUser);
  }

  function logout() {
    logoutUser();
    setUser(null);
  }

  return { user, loading, login, register, logout };
}
