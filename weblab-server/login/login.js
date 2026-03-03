const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  if (error) {
    const p = document.createElement("p");
    p.className = "login-error";
    p.textContent = error;
    document.querySelector(".login-form").prepend(p);
  }