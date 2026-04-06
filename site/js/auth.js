(() => {
  const USERS_KEY = "vvc_users";
  const SESSION_KEY = "vvc_session_user";

  const safeParse = (value, fallback) => {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  const normalizeUserId = (userId) => (userId || "").trim();

  const getUsers = () => {
    const users = safeParse(localStorage.getItem(USERS_KEY), {});
    return users && typeof users === "object" ? users : {};
  };

  const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const validatePassword = (password) => {
    const value = password || "";
    const errors = [];

    if (value.length < 9) {
      errors.push("Password must be at least 9 characters.");
    }
    if (!/[A-Z]/.test(value)) {
      errors.push("Password must include at least one uppercase letter.");
    }
    if (!/\d/.test(value)) {
      errors.push("Password must include at least one number.");
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      errors.push("Password must include at least one special character.");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  const registerUser = (userId, password) => {
    const normalizedUserId = normalizeUserId(userId);
    if (!normalizedUserId) {
      return { ok: false, error: "User ID is required." };
    }

    const rules = validatePassword(password);
    if (!rules.valid) {
      return { ok: false, error: rules.errors[0], errors: rules.errors };
    }

    const users = getUsers();
    if (users[normalizedUserId]) {
      return { ok: false, error: "User ID already exists." };
    }

    users[normalizedUserId] = { password };
    saveUsers(users);
    return { ok: true };
  };

  const login = (userId, password) => {
    const normalizedUserId = normalizeUserId(userId);
    if (!normalizedUserId || !password) {
      return { ok: false, error: "User ID and password are required." };
    }

    const users = getUsers();
    const user = users[normalizedUserId];
    if (!user) {
      return { ok: false, error: "User ID not found." };
    }

    if (user.password !== password) {
      return { ok: false, error: "Incorrect password." };
    }

    localStorage.setItem(SESSION_KEY, normalizedUserId);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
  };

  const getCurrentUser = () => {
    const current = normalizeUserId(localStorage.getItem(SESSION_KEY) || "");
    if (!current) {
      return null;
    }

    const users = getUsers();
    if (!users[current]) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return current;
  };

  const isLoggedIn = () => Boolean(getCurrentUser());

  window.Auth = {
    isLoggedIn,
    login,
    logout,
    registerUser,
    validatePassword,
    getCurrentUser,
  };
})();
