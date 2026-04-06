(() => {
  const form = document.getElementById("signupForm");
  const auth = window.Auth;

  if (!form || !auth) {
    return;
  }

  const userIdInput = document.getElementById("userId");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");
  const userIdError = document.getElementById("userIdError");
  const passwordError = document.getElementById("passwordError");
  const confirmError = document.getElementById("confirmPasswordError");
  const signupError = document.getElementById("signupError");
  const signupOk = document.getElementById("signupOk");
  const passwordRules = document.getElementById("passwordRules");

  const clearMessages = () => {
    userIdError.textContent = "";
    passwordError.textContent = "";
    confirmError.textContent = "";
    signupError.textContent = "";
    signupOk.textContent = "";
  };

  const setRuleStatus = (rule, ok) => {
    if (!passwordRules) {
      return;
    }
    const item = passwordRules.querySelector(`[data-rule="${rule}"]`);
    if (!item) {
      return;
    }
    item.classList.toggle("ok", ok);
    item.classList.toggle("bad", !ok);
  };

  const refreshRuleList = () => {
    const value = passwordInput.value || "";
    setRuleStatus("length", value.length >= 9);
    setRuleStatus("uppercase", /[A-Z]/.test(value));
    setRuleStatus("number", /\d/.test(value));
    setRuleStatus("special", /[^A-Za-z0-9]/.test(value));
  };

  if (auth.isLoggedIn()) {
    window.location.replace("index.html");
    return;
  }

  passwordInput.addEventListener("input", refreshRuleList);
  refreshRuleList();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessages();

    const userId = userIdInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    if (!userId) {
      userIdError.textContent = "User ID is required.";
    }
    if (!password) {
      passwordError.textContent = "Password is required.";
    }
    if (!confirmPassword) {
      confirmError.textContent = "Confirm your password.";
    }
    if (!userId || !password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      confirmError.textContent = "Passwords do not match.";
      return;
    }

    const ruleCheck = auth.validatePassword(password);
    if (!ruleCheck.valid) {
      passwordError.textContent = ruleCheck.errors.join(" ");
      refreshRuleList();
      return;
    }

    const result = auth.registerUser(userId, password);
    if (!result.ok) {
      signupError.textContent = result.error;
      return;
    }

    signupOk.textContent = "Account created. Redirecting to log in...";
    setTimeout(() => {
      window.location.replace("login.html");
    }, 400);
  });
})();
