const listGallery = $("#playlists");
// function to add playlist to front page
async function addList() {
  try {
    const result = await axios({
      method: "get",
      url: "http://localhost:3000/public/"
    });
    console.log(result);
    const lists = result.data.playlists.items;
    const likes = result.data.playlists.likes;
    for (let i = 0; i < lists.length; i++) {
      const htmlToAdd = generateHTML(lists[i], likes);
      listGallery.append(htmlToAdd);
    }
  } catch (error) {
    console.log(error);
  }
}

//function to like a playlist
$(document).on("click", ".like", async function() {
  try {
    const id = $(this).parentsUntil("#playlists")[1].id;
    const result = await axios({
      method: "post",
      url: "http://localhost:3000/public/like",
      data: {
        data: {
          id: id
        }
      }
    });
    $("#" + id + " .like-counts").text(`${result.data[id]} Likes`);
    $("#" + id + " .like").replaceWith(
      `<i class="fas fa-heart clickable p-2 rounded unlike" ></i>`
    );
  } catch (error) {
    console.log(error);
  }
});

//function to unlike a playlist
$(document).on("click", ".unlike", async function() {
  try {
    const id = $(this).parentsUntil("#playlists")[1].id;
    const result = await axios({
      method: "post",
      url: "http://localhost:3000/public/unlike",
      data: {
        data: {
          id: id
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

//function to generate playlist html for frontpage
function generateHTML(el, likes) {
  const htmlToAdd = `<div class="col-md-4 bg-dark mx-5 mt-2 mb-4 text-center text-white rounded shadow" id=${
    el.id
  }>
    <div class="my-3 py-3" >
      <h2 class="display-5">
      ${el.name}</h2> 
    </div>
    <div
      class="bg-light box-shadow mx-auto"
      style="width: 60%; height: 270px; border-radius: 21px 21px 0 0;
      background: url(${el.images[0].url});background-position: center; 
      background-repeat: no-repeat; 
      background-size: cover;"
    ></div>
    <div class="text-white my-4">
    <span class="mx-3 like-counts" > ${likes[el.id]} Likes</span>
    ${
      el.likes == 0
        ? '<i class="far fa-heart clickable p-2 rounded like" >'
        : '<i class="fas fa-heart clickable p-2 rounded unlike" ></i>'
    }</div>`;
  return htmlToAdd;
}

//add playlist to page
addList();
