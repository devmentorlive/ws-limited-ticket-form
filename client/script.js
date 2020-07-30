var ws = new WebSocket("ws://localhost:3001");
var steps = ["reserve", "buy", "complete"];
let availableCount;

function el(stepId) {
  return document.getElementById(stepId);
}

document.addEventListener("DOMContentLoaded", function (e) {
  showStep("reserve");
});

function render() {
  renderReserve();
}

function renderReserve() {
  el("ticket-count").innerHTML = availableCount;
  if (parseInt(availableCount) < 1) {
    el("buy-now").style.display = "none";
    el("act-now").style = "color: red;";
    el("act-now").innerHTML = "This event has been sold out.";
  }
}

function showStep(stepId) {
  steps.forEach((id) => {
    const visibility = stepId === id ? "block" : "none";
    el(id).style.display = visibility;
  });
}

function buyTicket() {
  ws.send(
    JSON.stringify({
      type: "ticket-sold",
    })
  );
  showStep("complete");
}

ws.addEventListener("open", () => {
  console.log("connected to the server via ws");
});

ws.addEventListener("message", (e) => {
  var json = JSON.parse(e.data);
  switch (json.type) {
    case "availableTickets":
      availableCount = parseInt(json.data);
      break;
  }
  render();
});
