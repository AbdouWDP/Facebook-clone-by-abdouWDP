const post_input = document.querySelector(".post-input");
const add_post = document.getElementById("add-post");
const close_add_post = document.querySelector(".close-add-post");
const posts = document.querySelector(".posts");
const publish_btn = document.getElementById("publish-btn");
const post_img = document.getElementById("post-img");
const comments = document.querySelector(".comments");
const comments_section = document.querySelector(".comment-section");
const create_post = document.querySelector(".create-post");
const close_comments = document.querySelector(".close-comment-section");
const send_comment = document.getElementById("send-comment");
const logout_btn = document.getElementById("logout-button");
const input_text = document.querySelector(".post-add-content");
const add_img_file = document.querySelector(".add-image-file");
const modal = document.querySelector(".post-added");
const update_post = document.querySelector(".update-post");
const delete_post = document.querySelector(".delete-post");
const user_profile = document.getElementById("profile");
const profile_pict = document.querySelector(".profile-picture");

function openClosePost(isOpen) {
  add_post.style.display = isOpen ? "block" : "none";
  document.querySelector(".show").style.display = isOpen ? "block" : "none";
}

close_add_post.addEventListener("click", () => {
  openClosePost(false);
});

function getUserId() {
  let userId = JSON.parse(localStorage.getItem("user")).id;
  return userId;
}
user_profile.addEventListener("click", function () {
  let userId = getUserId();
  location.href = "user.html?user_id=" + userId;
});

profile_pict.addEventListener("click", function () {
  let userId = getUserId();
  location.href = "user.html?user_id=" + userId;
});

function getProfileId(id) {
  location.href = "user.html?user_id=" + id;
}

post_input.addEventListener("click", () => {
  openClosePost(true);
  input_text.focus();
  input_text.value = "";
});

let cursorTop = 0;
window.onmousemove = function (e) {
  let y = e.layerY - 550;
  if (comments_section.style.display === "block") {
    cursorTop = 0;
  } else {
    cursorTop = y;
    localStorage.setItem("cursor_location", cursorTop);
  }
};

// ======================== Posts requests: ========================
let currentPage = 1;
let lastPage = 0;
window.addEventListener("scroll", () => {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage += 1;
    getPosts();
  }
});

async function getPosts() {
  let request = await fetch(
    `https://tarmeezacademy.com/api/v1/posts?page=${currentPage}&limit=10`
  );
  let response = await request.json();
  let data = response.data;
  lastPage = response.meta.last_page;
  if (currentPage == 1) {
    posts.innerHTML = "";
  }
  for (p of data) {
    posts.innerHTML += `
          <div id="post">
            <div class="user-info">
              <div class="profile-picture user-pic" onclick="getProfileId(${
                p.author.id
              })">
                <a><img src="${
                  Object.keys(p.author.profile_image).length === 0
                    ? `/imgs/defaultProfile.jpg`
                    : `${p.author.profile_image}`
                }" alt="" id="post-img"/></a>
              </div>
              <div class="user-name">
                <a onclick="getProfileId(${p.author.id})">${
      p.author.username
    }</a>
                <div class="post-date">${p.created_at}</div>
              </div>
              <div class="post-buttons">
                <button class="choose-button">
                  <i class="fa-solid fa-ellipsis"></i>
                </button>
                <div class="buttons">
                  <button class="update-post" onclick="updatePost(${p.id})">
                    <i class="fa-solid fa-arrows-rotate"></i>
                    <span>Update post</span>
                  </button>
                  <button class="delete-post" onclick="deletePost(${p.id})">
                    <i class="fa-solid fa-trash"></i>
                    <span>Delete post</span>
                  </button>
                </div>
              </div>
            </div>

          
            <div class="post-content">
              <p>${p.body}</p>
            </div>
          
            ${
              Object.keys(p.image).length === 0
                ? ""
                : `
                <div class="post-img" onclick="isClosed(true); showComments(${p.id})">
                  <img src="${p.image}" alt="" />
                </div>
              `
            }
            <div class="comments-counter" onclick="showComments(${
              p.id
            }); isClosed(true)">
              <p>${p.comments_count} comments</p>
            </div>
          
            <div class="comments" onclick="isClosed(true); showComments(${
              p.id
            })">
              <span class="cm">Comments</span>
              <i class="fa-regular fa-comment"></i>
            </div>
            
      `;
  }
}

function postAddedModal(el, message, color) {
  modal.innerHTML = message;
  modal.style.top = el ? "10px" : "-100px";
  modal.style.backgroundColor = color;
}

publish_btn.addEventListener("click", () => {
  let formData = new FormData();
  formData.append("body", input_text.value);
  formData.append("image", add_img_file.files[0]);
  let token = localStorage.getItem("token");
  axios
    .post("https://tarmeezacademy.com/api/v1/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: "Bearer " + token,
      },
    })
    .then(() => {
      getPosts();
      openClosePost(false);
      postAddedModal(true, "Post has been added successfully", "green");
      setTimeout(() => {
        postAddedModal(false, "Post has been added successfully");
      }, 3000);
    })
    .catch((err) => {
      let message = err.response.data.errors.body[0];
      postAddedModal(true, message, "red");
      setTimeout(() => {
        postAddedModal(false, message);
      }, 3000);
    });
});

function updatePost(postId) {
  let token = localStorage.getItem("token");
  let post_update_text = prompt("Update your post body here");
  let params = {
    body: post_update_text,
  };
  if (post_update_text) {
    axios
      .put("https://tarmeezacademy.com/api/v1/posts/" + postId, params, {
        headers: {
          authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        getPosts();
        postAddedModal(
          true,
          "Your post has been updated successfully",
          "green"
        );
        setTimeout(() => {
          postAddedModal(false, "Your post has been updated successfully");
        }, 3000);
      })
      .catch((error) => {
        let message = error.response.data.error_message;
        postAddedModal(true, message, "red");
        setTimeout(() => {
          postAddedModal(false, message);
        }, 3000);
      });
  }
}
function deletePost(postId) {
  let token = localStorage.getItem("token");
  let c = confirm("Are you sure you want to delete this post ?");
  if (c) {
    axios
      .delete("https://tarmeezacademy.com/api/v1/posts/" + postId, {
        headers: {
          authorization: "Bearer " + token,
        },
      })
      .then(() => {
        getPosts();
        postAddedModal(
          true,
          "Your post has been deleted successfully",
          "green"
        );
        setTimeout(() => {
          postAddedModal(false, "Your post has been deleted successfully");
        }, 3000);
      })
      .catch((error) => {
        let message = error.response.data.error_message;
        postAddedModal(true, message, "red");
        setTimeout(() => {
          postAddedModal(false, message);
        }, 3000);
      });
  }
}

getPosts();

// ======================== Logout button: ========================

logout_btn.addEventListener("click", () => {
  let conf = confirm("Are you sure you want to Logout ?");
  if (conf) {
    localStorage.removeItem("token");
    localStorage.removeItem("cursor_location");
    localStorage.removeItem("user");
    location.href = "/index.html";
  }
});

// ======================== Fill user: ========================

function fillUser() {
  let userID = getUserId();
  fetch("https://tarmeezacademy.com/api/v1/users/" + userID)
    .then((response) => response.json())
    .then((json) => {
      let profile_picture = json.data.profile_image;
      let profile_pic_length = Object.keys(profile_picture).length;
      if (profile_pic_length === 0) {
        document.getElementById("profile-pic").src = `/imgs/defaultProfile.jpg`;
        document.getElementById(
          "profile-image"
        ).src = `/imgs/defaultProfile.jpg`;
      } else {
        document.getElementById("profile-pic").src = profile_picture;
        document.getElementById("profile-image").src = profile_picture;
      }
    });
}
fillUser();

// ======================== comments request: ========================

let commentsID;

function showComments(postId) {
  axios.get("https://tarmeezacademy.com/api/v1/posts/" + postId).then((res) => {
    const user_img_comment = document.querySelector(".user-img-comment");
    const allComments = document.getElementById("all-comments");
    commentsID = postId;
    let postIMG = res.data.data.image;
    let author = res.data.data.author.username;
    let comments = res.data.data.comments;
    allComments.innerHTML = "";
    for (c of comments) {
      console.log(c);
      if (comments.length >= 1) {
        allComments.innerHTML += `
          <div id="comment">
            <div class="comment-profile" onclick="getProfileId(${c.author.id})">
                <img src=${
                  Object.keys(c.author.profile_image).length === 0
                    ? "/imgs/defaultProfile.jpg"
                    : c.author.profile_image
                }
                } alt="" />
            </div>
            <div class="the-comment">
                <div class="comment-name" onclick="getProfileId(${
                  c.author.id
                })">
                  <h3>${c.author.username}</h3>
                  <p class="author">${
                    c.author.username == author ? "Author" : ""
                  }</p>
                </div>
                <div class="single-comment">
                  <p>${c.body}</p>
                </div>
            </div>
          </div>
        `;
      }
    }
    if (Object.keys(postIMG).length === 0) {
      document.querySelector(".img-side").style.display = "none";
      document.querySelector(".comments-side").style.width = "100%";
      document.querySelector(".comments-side").style.borderRadius = "10px";
    } else {
      document.querySelector(".img-side").style.display = "block";
      document.querySelector(".img-side").style.width = "70%";
    }
    user_img_comment.src = postIMG;
  });
}

send_comment.addEventListener("click", () => {
  const token = localStorage.getItem("token");
  const comment_text_input = document.getElementById("comment-text-input");
  let params = {
    body: comment_text_input.value,
  };
  axios
    .post(
      `https://tarmeezacademy.com/api/v1/posts/${commentsID}/comments`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: "Bearer " + token,
        },
      }
    )
    .then(() => {
      showComments(commentsID);
      postAddedModal(true, "Your comment has been added successfully", "green");
      setTimeout(() => {
        postAddedModal(false, "Your comment has been added successfully");
      }, 3000);
      comment_text_input.value = "";
    })
    .catch((err) => {
      console.log(err);
    });
});

function isClosed(el) {
  comments_section.style.display = el ? "block" : "none";
  posts.style.display = el ? "none" : "block";
  create_post.style.display = el ? "none" : "flex";
  close_comments.style.display = el ? "block" : "none";
  logout_btn.style.display = el ? "none" : "block";
}

close_comments.addEventListener("click", () => {
  isClosed(false);
  let cursor_location = localStorage.getItem("cursor_location");
  window.scroll({
    top: cursor_location,
    left: 0,
    behavior: "smooth",
  });
  getPosts();
});
