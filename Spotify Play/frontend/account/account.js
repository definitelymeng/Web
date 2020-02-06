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
const jwt = getCookie("jwt");

if (user == "") {
  window.location.href = "../home/home.html";
}

//render user's own playlist when browsing button is clicked
$(document).on("click", "#get-list", async function() {
  try {
    const result = await axios({
      method: "get",
      headers: {
        Authorization: "Bearer " + jwt
      },
      url: "http://localhost:3000/private/"
    });
    console.log(result);
    $("#my-playlist").empty();
    $("#my-playlist").append(
      '<div class="row justify-content-center" id="playlist-row"></div>'
    );
    const userlist = result.data.filter(el => el["app_username"] == user);
    for (let i = 0; i < userlist.length; i++) {
      const listCard = generateHTML(userlist[i]);
      $("#playlist-row").append(listCard);
    }
  } catch (error) {
    console.log(error);
  }
});

function generateHTML(el) {
  const htmlToAdd = `<div class="col-lg-4 bg-dark mx-5 mt-2 mb-4 text-center text-white rounded shadow" id=${el.id}>
    <div class="my-3 py-3" >
      <h2 class="display-5">
      <a href=${el.external_urls.spotify}>${el.name}<a></h2> 
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
    <span class="mx-3 like-counts" > ${el.likes.length} Likes</span></div>
    <div class="col-7 d-flex align-items-center flex-row">
    <span class="mx-3 p-1 clickable rounded comment-counts" > ${el.comments.length} Comments</span>
    </div>
    </div>`;
  return htmlToAdd;
}

//function to see all comments
$(document).on("click", ".comment-counts", async function() {
  const id = $(this).parents()[3].id;
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
