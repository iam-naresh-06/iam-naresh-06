// All API calls related to User (register, login, etc.)
const BASE_URL = "http://localhost:3000/api/api/users";

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const text = await response.text();
      throw new Error("Registration failed: " + text);
    }

    return await response.json();
  } catch (error) {
    console.error("Error during registration:", error);
    alert(error.message);
  }
};