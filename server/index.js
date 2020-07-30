const http = require("http");
const ws = new require("ws");
const wss = new ws.Server({ noServer: true });

const clients = new Set();
let availableTickets = 1;

function avaibleTicketJSON() {
  return JSON.stringify({
    type: "availableTickets",
    data: availableTickets,
  });
}

const server = http.createServer((req, res) => {
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), handleConnection);
});

function handleConnection(sock) {
  console.log("client connecting");
  clients.add(sock);
  sock.send(avaibleTicketJSON());

  sock.on("message", function (e) {
    const json = JSON.parse(e);
    if (json.type === "ticket-sold") {
      availableTickets = availableTickets - 1;
      for (let client of clients) {
        client.send(avaibleTicketJSON());
      }
    }
  });

  sock.on("close", function () {
    clients.delete(sock);
  });
}

server.listen(3001, () =>
  console.log(`Server running at http://localhost:${3001}`)
);
