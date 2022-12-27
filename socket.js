const socketIo = require("socket.io");
const http = require("./app.js"); //app.js파일이 전체적으로 한 번 실행되고 가져옴 => 서버가 열림!

const io = socketIo(http);

//소켓 연결 이벤트
io.on("connection", (sock) => {
  const { watchBuying, watchByeBye } = initSocket(sock);

  watchBuying();
  watchByeBye();
});

function initSocket(sock) {
  console.log("새로운 소켓이 연결되었습니다.");

  //sock.on을 대신해서, 어떤 역할을 하는지 추상화 한 함수
  function watchEvent(eventName, func) {
    sock.on(eventName, func);
  }

  function sendMessageAll(eventName, data) {
    io.emit(eventName, data);
  }

  return {
    watchBuying: () => {
      watchEvent("BUY", (data) => {
        console.log(data);
        const emitDate = {
          nickname: data.nickname,
          goodsId: data.goodsId,
          goodsName: data.goodsName,
          date: new Date().toISOString(),
          //string으로 date타입을 보여줄수있도록
        };
        //io.emit하면 소켓이 연결된 모든 사용자들에게 이벤트로 데이터가 전달됨
        //sock.emit하면 로그인으로 연결된 사용자 1명에게만 전달
        //추상화해서 sendMessageAll로
        sendMessageAll("BUY_GOODS", emitDate);
      });
    },
    watchByeBye: () => {
      watchEvent("disconnect", () => {
        console.log(sock.id, "해당하는 사용자가 연결이 끊어졌어요!");
      });
    },
  };
}
