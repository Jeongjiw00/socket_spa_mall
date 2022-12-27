const http = require("./app.js");
require("./socket.js");

//app 대신 http객체로 서버 열기
http.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});
