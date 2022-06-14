const num_users = 12;
let userdata = [];
const url = `https://randomuser.me/api/?results=${num_users}&nat=ca`;
let currentIndex = 0;
let cards = document.querySelectorAll(".card");
let gallery = document.querySelector("#gallery");
let modal = document.querySelector(".modal-container");
let modal_close = document.querySelector("#modal-close-btn");
let modal_prev = document.querySelector("#modal-prev");
let modal_next = document.querySelector("#modal-next");
let search_str = "";

// add the modal element into body
const div = document.createElement("div");
div.className = "modal-container";
div.style.display = "none";
document.body.append(div);

$(document).ready(() => {
  // get the json data from randomuser.me by Fetch API
  async function getUserData() {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        userdata = data.results;
        // display all of user profits
        generateUserProfile(userdata);
        // display the modal info after clicking.
        displayModalInfo();
      })
      .catch((err) => console.log(err));
  }
  getUserData();
  searchData();

  // generate the html of the usr profiles by json data
  function generateUserProfile(users) {
    users.forEach((user, index) => {
      const div = document.createElement("div");
      const html = `
            <div class='card-img-container'>
            <img class='card-img' src='${user.picture.large}' alt='random user profit' />
            </div>
            <div class="card-info-container">
                <h3 id='name' class='card-name cap'>${user.name.first} ${user.name.last}</h3>
                <p class='card-text'>${user.email}</p>
                <p class='card-text cap'>${user.location.city}, ${user.location.state}</p>
            </div>`;

      div.classList.add("card");
      div.setAttribute("value", index);
      div.innerHTML = html;
      gallery.appendChild(div);
    });
  }

  // create the list of model information for specify users
  function generateModelInfo(user) {
    const img = `${user.picture.large}`;
    const fullname = `${user.name.first} ${user.name.last}`;
    const city = `${user.location.city}`;
    const address = `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.nat} ${user.location.postcode}`;
    const birthday = new Date(user.dob.date);

    const html = `
              <div class="modal">
                  <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                  <div class="modal-info-container">
                      <img class="modal-img" src='${img}' alt="profile picture" />
                      <h3 id="name" class="modal-name cap">${fullname}</h3>
                      <p class="modal-text">${user.email}</p>
                      <p class="modal-text cap">${city}</p>
                      <hr>
                      <p class="modal-text">${user.cell}</p>
                      <p class="modal-text">${address}</p>
                      <p class="modal-text">Birthday: ${birthday.toLocaleDateString()}</p>
                  </div>
              </div>
      
              <div class="modal-btn-container">
                  <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                  <button type="button" id="modal-next" class="modal-next btn">Next</button>
              </div>
        `;
    // insert the html of the modal info
    document.querySelector(".modal-container").innerHTML = html;

    // close the modal info when clicking the closed button
    $("#modal-close-btn").click(() => {
      $(".modal-container").hide();
    });

    // display the prev info when clicking prev button
    $("#modal-prev").click(() => {
      if (currentIndex !== 0) {
        currentIndex--;
        generateModelInfo(userdata[currentIndex]);
      } else {
        $("#modal-prev").hide();
        alert("No more information");
      }
    });

    // display the next info when clicking next button
    $("#modal-next").click(() => {
      if (currentIndex !== num_users) {
        currentIndex++;
        generateModelInfo(userdata[currentIndex]);
      } else {
        $("#modal-next").hide();
        alert("No more information");
      }
    });
  }

  // display the modal info after clicking user card
  function displayModalInfo() {
    $(".card").click(function (e) {
      let index = $(this).attr("value");
      $(".modal-container").show();
      generateModelInfo(userdata[index]);
      currentIndex = index;
    });
  }

  // search data from the list and print the form html
  function searchData() {
    $(".search-container").append(`
    <form action="#" method="get">
        <input type="text" id="search-input" class="search-input" placeholder="Search the name...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
    `);

    // filter the submit when user search the specifiy string
    $("#search-submit").on("click", () => {
      let value = $("#search-input").val().toLowerCase();
      $("#gallery div.card").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  }
});
