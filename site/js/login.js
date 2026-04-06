(() => {
  const form = document.getElementById("loginForm");
  const auth = window.Auth;

  if (!form || !auth) {
    return;
  }

  const userIdInput = document.getElementById("userId");
  const passwordInput = document.getElementById("password");
  const userIdError = document.getElementById("userIdError");
  const passwordError = document.getElementById("passwordError");
  const loginError = document.getElementById("loginError");
  const loginOk = document.getElementById("loginOk");

  const clearMessages = () => {
    userIdError.textContent = "";
    passwordError.textContent = "";
    loginError.textContent = "";
    loginOk.textContent = "";
  };

  if (auth.isLoggedIn()) {
    window.location.replace("index.html");
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessages();

    const userId = userIdInput.value.trim();
    const password = passwordInput.value;

    if (!userId) {
      userIdError.textContent = "User ID is required.";
    }
    if (!password) {
      passwordError.textContent = "Password is required.";
    }
    if (!userId || !password) {
      return;
    }

    const result = auth.login(userId, password);
    if (!result.ok) {
      loginError.textContent = result.error;
      return;
    }

    loginOk.textContent = "Login successful. Redirecting...";
    setTimeout(() => {
      window.location.replace("index.html");
    }, 300);
  });
})();
