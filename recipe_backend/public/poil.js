let username = "dufefsefefecon";
let password = "lapute";
let url =
  "http://localhost:3000/auth?username=" + username + "&password=" + password;

fetch(url, {
  method: "get",
  headers: new Headers({
    "Content-Type": "application/json",
  }),
})
  .then(function (response) {
    // Convert to JSON
    return response.json();
  })
  .then(function (jsonResponse) {
    console.log(jsonResponse);
  });
