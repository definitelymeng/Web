let accountInfo;
$("#submit-form").click(async function() {
  const name = $("#user-email").val();
  const pass = $("#user-password").val();
  try {
    const result = await axios({
      method: "post",
      url: "http://localhost:3000/account/login",
      data: {
        name: name,
        pass: pass
      }
    });
    const jwt = result.data.jwt;
    setCookie("username", name, 30);
    setCookie("password", pass, 30);
    setCookie("jwt", jwt, 30);
    window.location.href = "../home/home.html";
  } catch (error) {
    $("#warning").text("wrong username or password");
    console.log(error);
  }
});

//function to create a cookie, reference from https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exmins) {
  const d = new Date();
  d.setTime(d.getTime() + exmins * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
