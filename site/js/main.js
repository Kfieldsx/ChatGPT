(() => {
  const year = new Date().getFullYear();
  const footer = document.querySelector('.site-footer p');
  if (footer) {
    footer.textContent = `(c) ${year} Vini Vidi Cogitavi`;
  }

  const loginLink = document.getElementById("loginLink");
  const profileArea = document.getElementById("profileArea");
  const profileButton = document.getElementById("profileButton");
  const logoutButton = document.getElementById("logoutButton");
  const auth = window.Auth;

  if (auth && loginLink && profileArea && profileButton) {
    const currentUser = auth.getCurrentUser();
    const loggedIn = Boolean(currentUser);

    loginLink.hidden = loggedIn;
    profileArea.hidden = !loggedIn;

    if (loggedIn) {
      profileButton.textContent = `Profile: ${currentUser}`;
      profileButton.setAttribute("aria-label", `Profile for ${currentUser}`);
    }
  }

  if (logoutButton && auth) {
    logoutButton.addEventListener("click", () => {
      auth.logout();
      window.location.href = "index.html";
    });
  }
})();
