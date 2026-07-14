import api, { setAuthToken } from "./api";

/**
 * Sync Firebase user with backend database.
 * Creates the user if they don't exist,
 * otherwise returns the existing user.
 */
export const syncUser = async (firebaseUser) => {
  try {
    const payload = {
      authId: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || "User",
      profileImage:
        firebaseUser.photoURL ||
        "https://img.freepik.com/free-psd/3d-rendered-user-icon-blue-circle_84443-55891.jpg",
    };

    const response = await api.post("/users/sync", payload);

    // Save JWT token if backend returns one
    if (response.data.token) {
      setAuthToken(response.data.token);
    }

    return response.data.user;
  } catch (error) {
    console.error(
      "User Sync Error:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

/**
 * Get logged-in user's profile.
 */
export const getProfile = async () => {
  try {
    const response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    console.error(
      "Get Profile Error:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};


export const updateProfile = async (data) => {
  try {
    const response = await api.put("/users/profile", data);
    return response.data;
  } catch (error) {
    console.error(
      "Update Profile Error:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

/**
 * Change the logged-in user's role (client | freelancer | admin).
 * On success the backend returns the updated user document.
 */
export const changeRole = async (role) => {
  try {
    const response = await api.put("/users/role", { role });
    return response.data;
  } catch (error) {
    console.error(
      "Change Role Error:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

/**
 * Delete logged-in user's account.
 */
export const deleteAccount = async () => {
  try {
    const response = await api.delete("/users/profile");
    return response.data;
  } catch (error) {
    console.error(
      "Delete Account Error:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

/**
 * Backwards-compatible alias — the backend routes /users/complete-profile
 * to the same role-aware handler as /users/profile.
 */
export const completeProfile = async (profileData) => {
  try {
    const response = await api.put(`/users/complete-profile`, profileData);
    return response.data;
  } catch (error) {
    console.error("Error completing profile:", error);
    throw error;
  }
};

/**
 * Get a user's public profile by id (used to view & message other users).
 */
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Get User By Id Error:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};