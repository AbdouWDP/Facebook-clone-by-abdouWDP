const profile_pic = document.querySelector(".see-profile-picture");
const pic = document.getElementById("pic");
const show = document.querySelector(".show");
const backBtn = document.querySelector(".back-btn");
const posts_counter = document.querySelector(".posts-count");
const comments_counter = document.querySelector(".comments-count");
const user_posts = document.querySelector(".all-posts");
const profile_name = document.querySelector(".profile-name");
const loader = document.querySelector(".loader");
const modal = document.querySelector(".post-added");

function openHide(isOpen) {
  show.style.display = isOpen ? "block" : "none";
}

function profilePic(isOpen) {
  show.style.display = isOpen ? "block" : "none";
  profile_pic.style.display = isOpen ? "block" : "none";
}

pic.addEventListener("click", () => {
  profilePic(true);
  profile_pic.src = pic.src;
});

show.addEventListener("click", () => {
  profilePic(false);
});

function postAddedModal(el, message, color) {
  modal.innerHTML = message;
  modal.style.top = el ? "10px" : "-100px";
  modal.style.backgroundColor = color;
}

function fillUser() {
  let url = new URLSearchParams(location.search);
  let userId = url.get("user_id");
  fetch("https://tarmeezacademy.com/api/v1/users/" + userId)
    .then((response) => response.json())
    .then((json) => {
      let data = json.data;
      let profile_picture = data.profile_image;
      posts_counter.innerHTML = `<b>${data.posts_count}</b> posts`;
      comments_counter.innerHTML = `<b>${data.comments_count}</b>comments`;
      profile_name.innerHTML = `<p>${data.username}</p>`;
      let profile_pic_length = Object.keys(profile_picture).length;
      profile_pic_length === 0
        ? (pic.src = `/imgs/defaultProfile.jpg`)
        : (pic.src = profile_picture);
      getUserPosts();
    });
}

function getUserPosts() {
  let url = new URLSearchParams(location.search);
  let userId = url.get("user_id");
  fetch(`https://tarmeezacademy.com/api/v1/users/${userId}/posts`)
    .then((res) => res.json())
    .then((res) => {
      loader.style.display = "none";
      let posts = res.data;
      let reversed_posts = posts.reverse();
      user_posts.innerHTML = "";
      for (post of reversed_posts) {
        user_posts.innerHTML += `
          <div class="post">
            <div class="user-info">
              <div class="profile-picture user-pic">
                <a href="#"
                  ><img
                    src="${
                      Object.keys(post.author.profile_image).length === 0
                        ? "/imgs/defaultProfile.jpg"
                        : post.author.profile_image
                    }"
                    alt=""
                    id="post-profile-img"
                /></a>
              </div>
              <div class="user-name">
                <a href="#">${post.author.username}</a>
                <div class="post-date">${post.created_at}</div>
              </div>
              <div class="post-buttons">
                <button class="choose-button">
                  <i class="fa-solid fa-ellipsis"></i>
                </button>
                <div class="buttons">
                  <span class="update-post" onclick="updatePost(${post.id})">
                    <i class="fa-solid fa-arrows-rotate"></i>
                    <span>Update post</span>
                  </span>
                  <span class="delete-post" onclick="deletePost(${post.id})">
                    <i class="fa-solid fa-trash"></i>
                    <span>Delete post</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="post-content">
              <p>
                ${post.body}
              </p>
            </div>

            <div class="post-img">
              ${
                Object.keys(post.image).length === 0
                  ? `<h1 class="image-error">This post has no image</h1>`
                  : `<img src="${post.image}" alt="" id="post-img" />`
              }
            </div>

            <div class="comments-counter">
              <p>${post.comments_count} comments</p>
            </div>
          </div>
        `;
      }
    });
}

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
      .then(() => {
        getUserPosts();
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
        getUserPosts();
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

fillUser();

backBtn.addEventListener("click", () => {
  location.href = "/HTML/home.html";
});
