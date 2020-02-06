//see if user is authenticated by checking cookie set by sign in page
//function to get a cookie, reference https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const user = getCookie("username");
const pass = getCookie("password");
const jwt = getCookie("jwt");
if (user != "") {
  renderPage(user, pass, jwt);
} else {
  renderWaning();
}

function renderWaning() {
  const warning = `<div class="text-center mt-5">
    <p class="lead">You are not logged in</p>
    <a href = "../signin/signin.html" class="text-info">Go back to sign in</a>
</div>`;
  $(".container-fluid").append(warning);
}

async function renderPage(username, password, jwt) {
  try {
    const account = await axios({
      method: "get",
      url: "http://localhost:3000/account/status",
      headers: {
        Authorization: "Bearer " + jwt
      },
      data: {
        name: username,
        pass: password
      }
    });

    // const user = account.data.user.name;
    $("nav .container").append(`
    <div class="py-2 d-md-inline-block">
    <a class="text-white" href="../logout/logout.html" id="logout">Log out</a>
    <span class="text-white mx-3">/</span>
    <a class="text-white" href="../account/account.html" id="account">My Account</a>
  </div>`);

    const result = await axios({
      method: "get",
      headers: {
        Authorization: "Bearer " + jwt
      },
      url: "http://localhost:3000/private/"
    });
    console.log(result);
    const lists = result.data;
    for (let i = 0; i < lists.length; i++) {
      const htmlToAdd = generateHTML(lists[i]);
      $("#user-gallery").append(htmlToAdd);
    }
  } catch (error) {
    console.log(error);
  }
}

function generateHTML(el) {
  const htmlToAdd = `<div class="col-md-4 col-lg-3 bg-dark mx-5 mt-2 mb-4 text-center text-white rounded shadow" id=${
    el.id
  }>
    <div class="my-3 py-3" >
      <h2 class="display-5">
      <a class="text-light" href=${el.external_urls.spotify}>${
    el.name
  }</a></h2> 
    </div>
    <div
      class="bg-light box-shadow mx-auto"
      style="width: 60%; height: 200px; border-radius: 21px 21px 0 0;
      background: url(${el.images[0].url});background-position: center; 
      background-repeat: no-repeat; 
      background-size: cover;"
    ></div>
    <div class="text-white my-4 row">
    <div class="col-5 d-flex align-items-center flex-row">
    <span class="mx-3 like-counts" > ${el.likes.length} Likes</span>
    ${
      el.likes.includes(user)
        ? '<i style="font-size:20px" class="fas fa-heart clickable p-2 rounded unlike" ></i>'
        : '<i class="far fa-heart clickable p-2 rounded like" ></i>'
    }
    </div>
    <div class="col-7 d-flex align-items-center flex-row">
    <span class="mx-3 clickable p-1 rounded comment-counts" > ${
      el.comments.length
    } Comments</span>
    <i class="far fa-comment clickable p-2 rounded comments" ></i></div>
    </div>
    </div>`;
  return htmlToAdd;
}

//function to render comment box
$(document).on("click", ".comments", function() {
  const id = $(this).parentsUntil("#user-gallery")[2].id;
  const commentHTML = `<div class="col-md-4 col-lg-3 bg-dark mx-5 mt-2 mb-4 text-center text-white rounded shadow" id=${id}>
  <textarea rows="8" class="form-control rounded-lg mt-3 comment-content"></textarea>
  <button class="btn btn-outline-light bg-dark text-white my-5 send-comment"  type="button" >Reply</button>
  <button class="btn btn-outline-light bg-dark text-white my-5 cancel-comment" type="button">Cancel</button></div>`;
  $("#" + id).replaceWith(commentHTML);
});

//function to cancel comment
$(document).on("click", ".cancel-comment", async function() {
  const id = $(this).parents()[0].id;
  renderList(id);
});

//function to post comment
$(document).on("click", ".send-comment", async function() {
  const id = $(this).parents()[0].id;
  const comment = $(this)
    .prev()
    .val();
  try {
    const result = await axios({
      method: "post",
      headers: {
        Authorization: "Bearer " + jwt
      },
      url: "http://localhost:3000/private/comment",
      data: {
        data: { user: user, body: comment, targetid: id }
      }
    });
    renderList(id);
  } catch (error) {
    console.log(error);
  }
});

//function to see all comments
$(document).on("click", ".comment-counts", async function() {
  const id = $(this).parentsUntil("#user-gallery")[2].id;
  const commentList = $(
    `<ul class='list-group list-group-flus text-dark mt-2'></ul>`
  );
  try {
    const result = await axios({
      method: "get",
      headers: {
        Authorization: "Bearer " + jwt
      },
      url: "http://localhost:3000/private/"
    });
    const lists = result.data.filter(el => el.id == id);
    const el = lists[0].comments;
    for (let j = 0; j < el.length; j++) {
      if (el[j].user == user) {
        commentList.append(
          `<li class="list-group-item d-flex justify-content-between" id=${el[j].id}>${el[j].body} <div><button class="btn delete-comment">Delete</button></div></li>`
        );
      } else {
        commentList.append(
          `<li class="list-group-item" id=${el[j].id}>${el[j].body}</li>`
        );
      }
    }
    $("#" + id).html(commentList);
    $("#" + id).append(`<button class="btn go-back my-4">back</button>`);
  } catch (error) {
    console.log(error);
  }
});

//function to back to playlist
$(document).on("click", ".go-back", async function() {
  const id = $(this).parents()[0].id;
  renderList(id);
});

//function to update single list
async function renderList(id) {
  try {
    const result = await axios({
      method: "get",
      headers: {
        Authorization: "Bearer " + jwt
      },
      url: "http://localhost:3000/private/"
    });
    const lists = result.data;
    const el = lists.filter(el => el.id == id);
    const content = generateHTML(el[0]);
    $("#" + id).replaceWith(content);
  } catch (error) {
    console.log(error);
  }
}

//function to delete a comment
$(document).on("click", ".delete-comment", async function() {
  const commentId = $(this).parents()[1].id;
  const id = $(this).parents()[3].id;
  try {
    const delete_result = await axios({
      method: "delete",
      headers: {
        Authorization: "Bearer " + jwt
      },
      data: {
        data: {
          playlist_id: id,
          id: commentId
        }
      },
      url: "http://localhost:3000/private/comment"
    });
    const commentList = $(
      `<ul class='list-group list-group-flus text-dark mt-2'></ul>`
    );
    renderComment(commentList, id);
    $("#" + id).html(commentList);
    $("#" + id).append(`<button class="btn go-back my-4">back</button>`);
  } catch (error) {
    console.log(error);
  }
});

async function renderComment(commentList, id) {
  try {
    const result = await axios({
      method: "get",
      headers: {
        Authorization: "Bearer " + jwt
      },
      url: "http://localhost:3000/private/"
    });
    const lists = result.data.filter(el => el.id == id);
    const el = lists[0].comments;
    for (let j = 0; j < el.length; j++) {
      if (el[j].user == user) {
        commentList.append(
          `<li class="list-group-item d-flex justify-content-between" id=${el[j].id}>${el[j].body} <div><button class="btn delete-comment">Delete</button></div></li>`
        );
      } else {
        commentList.append(
          `<li class="list-group-item" id=${el[j].id}>${el[j].body}</li>`
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

//function to like a playlist
$(document).on("click", ".like", async function() {
  try {
    const id = $(this).parentsUntil("#playlists")[2].id;
    const result = await axios({
      method: "post",
      headers: {
        Authorization: "Bearer " + jwt
      },
      url: "http://localhost:3000/private/like",
      data: {
        data: {
          id: id,
          user: user
        }
      }
    });
    $("#" + id + " .like-counts").text(`${result.data[id]} Likes`);
    $("#" + id + " .like").replaceWith(
      `<i style="font-size:20px" class="fas fa-heart clickable p-2 rounded unlike" ></i>`
    );
  } catch (error) {
    console.log(error);
  }
});

//function to unlike a playlist
$(document).on("click", ".unlike", async function() {
  try {
    const id = $(this).parentsUntil("#playlists")[2].id;
    const result = await axios({
      method: "post",
      headers: {
        Authorization: "Bearer " + jwt
      },
      url: "http://localhost:3000/private/unlike",
      data: {
        data: {
          id: id,
          user: user
        }
      }
    });
    $("#" + id + " .like-counts").text(`${result.data[id]} Likes`);
    $("#" + id + " .unlike").replaceWith(
      `<i class="far fa-heart clickable p-2 rounded like" ></i>`
    );
  } catch (error) {
    console.log(error);
  }
});

//reference from https://medium.com/@TCAS3/debounce-deep-dive-javascript-es6-e6f8d983b7a1
const debounce = (fn, time) => {
  let timeout;

  return function() {
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};
//function for auto complete
$("#search-list").on("keydown", debounce(getSuggestion, 500));

async function getSuggestion() {
  const searchWords = $(this).val();
  if (searchWords == "") {
    const result0 = await axios({
      method: "get",
      headers: {
        Authorization: "Bearer " + jwt
      },
      url: "http://localhost:3000/private/"
    });
    const lists = result0.data;
    $("#user-gallery").empty();
    for (let i = 0; i < lists.length; i++) {
      const htmlToAdd = generateHTML(lists[i]);
      $("#user-gallery").append(htmlToAdd);
    }
    $("#show-suggestion").empty();
    return "";
  }
  try {
    const result = await axios({
      method: "get",
      headers: {
        Authorization: "Bearer " + jwt
      },
      url: "http://localhost:3000/private/search",
      params: {
        term: searchWords
      }
    });
    $("#show-suggestion").empty();
    for (let i = 0; i < result.data._suggestion.length; i++) {
      $("#show-suggestion").append(`<p>${result.data._suggestion[i]}</p>`);
    }

    const result2 = await axios({
      method: "get",
      headers: {
        Authorization: "Bearer " + jwt
      },
      url: "http://localhost:3000/private/"
    });
    const lists = result2.data;
    $("#user-gallery").empty();
    for (let i = 0; i < lists.length; i++) {
      if (result.data._suggestion.includes(lists[i].name)) {
        const htmlToAdd = generateHTML(lists[i]);
        $("#user-gallery").append(htmlToAdd);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
