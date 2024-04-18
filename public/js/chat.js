const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInputDetails = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationButton = document.querySelector("#location-btn");
const $messages = document.querySelector("#messages");

$messageFormButton.setAttribute("disabled", "disabled");

// Template
const messageTemplate = document.querySelector("#message-template").innerHTML;
const $linkMessage = document.querySelector("#link-template").innerHTML;
const $sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;
  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

const setHeight = ()=>{
  const currentHeight = window.innerHeight;
  document.body.style.height = `${currentHeight}px`
}

window.addEventListener("resize", setHeight);
setHeight()

socket.on("sent", (message) => {
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a, ddd"),
    username: message.username,
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("geo", (location) => {
  const link =
    `https://www.google.com/maps?q=${location.latatude},${location.longitude}`.toString();

  const html = Mustache.render($linkMessage, {
    link: link,
    createdAt: moment(location.createdAt).format("h:mm a, ddd"),
    username: location.username,
  });

  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("activeuser", (users) => {
  const html = Mustache.render($sidebarTemplate, {
    room: users[0].room,
    users: users,
  });

  document.querySelector("#sidebar").innerHTML = html;
});

$messageFormInputDetails.addEventListener("keyup", () => {
  if ($messageFormInputDetails.value === "") {
    $messageFormButton.setAttribute("disabled", "disabled");
  } else {
    $messageFormButton.removeAttribute("disabled");
  }
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute("disabled", "disabled");
  // socket.emit("send", document.getElementById("cc").value);
  //   ^
  //  | |  same as above

  socket.emit("sent", e.target.elements.message.value, (error) => {
    // $messageFormButton.removeAttribute("disabled");
    $messageFormInputDetails.value = "";
    $messageFormInputDetails.focus();
    if (error) {
      return console.log(error);
    }

    // console.log("Message Delevered");
  });
});

document.querySelector("#location-btn").addEventListener("click", () => {
  $locationButton.setAttribute("disabled", "disabled");

  if (!navigator.geolocation) {
    $locationButton.removeAttribute("disabled");
    return alert("Geoloaction is not supported by your browser");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "geo",
      position.coords.latitude,
      position.coords.longitude,
      (message) => {
        // console.log(message);
        $locationButton.removeAttribute("disabled");
      }
    );
  });
});

socket.emit("join", username, room, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});


// Functions

