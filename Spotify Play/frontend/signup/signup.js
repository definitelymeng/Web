//function to create an account and automatically log user in when account is created
$("#submit-sign").click(async function() {
  const name = $("#user-email").val();
  const pass = $("#user-password").val();
  try {
    const result = await axios({
      method: "post",
      url: "http://localhost:3000/account/create",
      data: {
        name: name,
        pass: pass
      }
    });

    const log_result = await axios({
      method: "post",
      url: "http://localhost:3000/account/login",
      data: {
        name: name,
        pass: pass
      }
    });

    const jwt = log_result.data.jwt;
    setCookie("username", name, 20);
    setCookie("password", pass, 20);
    setCookie("jwt", jwt, 20);
    window.location.href = "../home/home.html";
  } catch (error) {
    console.log(error);
  }
});
