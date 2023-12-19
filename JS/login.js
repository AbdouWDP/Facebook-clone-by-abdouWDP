const create_account = document.querySelector(".create-new-account");
const signup_btn = document.getElementById("signup-btn");
const signup = document.querySelector(".signup");
const close_btn = document.querySelector(".close");
const login_btn = document.querySelector(".connect");
const login_username = document.getElementById("login-username");
const login_pass = document.getElementById("login-password");
const signup_name = document.getElementById("signup-name");
const signup_username = document.getElementById("signup-username");
const signup_password = document.getElementById("signup-password");

function closeTheForm(isClosed) {
  document.querySelector(".login-form").style.display = isClosed
    ? "block"
    : "none";
  signup.style.display = isClosed ? "none" : "block";
}

create_account.addEventListener("click", () => {
  closeTheForm(false);
  signup_name.focus();
});
close_btn.addEventListener("click", () => {
  closeTheForm(true);
});

const baseurl = "https://tarmeezacademy.com/api/v1";

signup_btn.addEventListener("click", () => {
  let params = {
    name: signup_name.value,
    username: signup_username.value,
    password: signup_password.value,
  };
  axios.post(baseurl + "/register", params).then((res) => {
    location.href = "/HTML/home.html";
  });
});

login_btn.addEventListener("click", () => {
  let params = {
    username: login_username.value,
    password: login_pass.value,
  };
  axios
    .post(baseurl + "/login", params)
    .then((res) => {
      const token = res.data.token;
      const user = res.data.user;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (token === null) {
        alert("There is a problem");
      } else {
        location.href = "/HTML/home.html";
      }
    })
    .catch((e) => {
      alert("Username or password inccorect");
    });
});
