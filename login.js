const emailInput = document.getElementById("reg-email");
const passwordInput = document.getElementById("reg-password");
const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-password");
const regMessage = document.getElementById("reg-message");
const loginMessage = document.getElementById("login-message");

// Regular expression to validate email
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Sign-up validations
emailInput.addEventListener("focusout", validateEmail);
emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("focusout", validatePassword);
passwordInput.addEventListener("input", validatePassword);

function validateEmail() {
  const email = emailInput.value;
  if (email && !emailPattern.test(email)) {
    regMessage.textContent = "Please enter a valid email address";
  } else {
    regMessage.textContent = ""; // Clear the message if valid
  }
}

function validatePassword() {
  const password = passwordInput.value;
  if (password.length > 0 && password.length < 6) {
    regMessage.textContent = "Password must be at least 6 characters long";
  } else {
    regMessage.textContent = ""; // Clear the message if valid
  }
}

async function signup(event) {
  event.preventDefault();
  const name = document.getElementById("reg-name").value;
  const email = emailInput.value;
  const password = passwordInput.value;

  // Clear previous message
  regMessage.textContent = "";

  if (name === "" || email === "" || password === "") {
    regMessage.textContent = "Please fill in all fields";
    return;
  }

  if (regMessage.textContent === "") {
    try {
      const response = await fetch(
        "https://malath-backend.almalath.ps/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: name, email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        regMessage.textContent = "Registration successful";
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            token: data.token,
            username: data.userdata.username,
            id: data.userdata.userId,
            email: data.userdata.email,
            role: data.userdata.role,
          })
        );
        window.location.href = "/"; // Redirect to main page
      } else {
        regMessage.textContent = data.error || "Registration failed";
      }
    } catch (error) {
      regMessage.textContent = "An error occurred. Please try again.";
      console.error("Error:", error);
    }
  }
}

// Sign-in validations
loginEmailInput.addEventListener("focusout", validateLoginEmail);
loginEmailInput.addEventListener("input", validateLoginEmail);
loginPasswordInput.addEventListener("focusout", validateLoginPassword);
loginPasswordInput.addEventListener("input", validateLoginPassword);

function validateLoginEmail() {
  const email = loginEmailInput.value;
  if (email && !emailPattern.test(email)) {
    loginMessage.textContent = "Please enter a valid email address";
  } else {
    loginMessage.textContent = ""; // Clear the message if valid
  }
}

function validateLoginPassword() {
  const password = loginPasswordInput.value;
  if (password.length > 0 && password.length < 6) {
    loginMessage.textContent = "Password must be at least 6 characters long";
  } else {
    loginMessage.textContent = ""; // Clear the message if valid
  }
}

async function login(event) {
  event.preventDefault();
  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;

  loginMessage.textContent = "";

  if (email === "" || password === "") {
    loginMessage.textContent = "Please fill email and password";
    return;
  }

  if (loginMessage.textContent === "") {
    try {
      const response = await fetch(
        "https://malath-backend.almalath.ps/users/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        loginMessage.textContent = "Registration successful";
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            token: data.token,
            username: data.userdata.username,
            id: data.userdata.userId,
            email: data.userdata.email,
            role: data.userdata.role,
          })
        );
        window.location.href = "/"; // Redirect to main page
      } else {
        loginMessage.textContent = data.error || "Registration failed";
      }
    } catch (error) {
      loginMessage.textContent = "An error occurred. Please try again.";
      console.error("Error:", error);
    }
  }
}

function toggleForm() {
  var container = document.querySelector(".container");
  container.classList.toggle("active");
}
