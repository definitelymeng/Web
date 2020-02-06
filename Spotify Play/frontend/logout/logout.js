// function to delete a cookie reference https://www.w3schools.com/js/js_cookies.asp
function deleteCookie() {
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "password=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "jwt=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

deleteCookie();
