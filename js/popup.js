const notLoggedIn = document.querySelector("#when-not-logged-in");
const loggedIn = document.querySelector("#when-logged-in");
const saveBtn = document.querySelector("#save-btn");
const clearBtn = document.querySelector("#clear-btn");
const cardGroup = document.querySelector("#card-group");

function getCookies(domain, name, callback) {
     chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
          if(callback) {
               callback(cookie);
          }
     });
}

getCookies("http://127.0.0.1:8000", "token_key", (token_key) => {
     if (token_key == null || token_key == undefined) {
          notLoggedIn.classList.remove("is-hidden");
     }
     else {
          loggedIn.classList.remove("is-hidden");

          async function showTempData() {
               const response = await axios.post("http://127.0.0.1:8000/api/v1/temp/all", {token: token_key.value});
               if (response.data.response == "No data found") {
                    const card = document.createElement("div");
                    card.innerHTML = `<div class="card-content custom-bg-dark custom-fs-14 has-text-white">Copy some text, images and press save</div>`;
                    cardGroup.appendChild(card);
                    card.setAttribute("class", "card mb-2");
               }
               else {
                    clearBtn.classList.remove("is-hidden");
                    saveBtn.classList.remove("is-hidden");
                    if (response.data.message == "Token is missing") {
                         notLoggedIn.classList.remove("is-hidden");
                         loggedIn.classList.add("is-hidden");
                    }
                    else {
                         response.data.response.forEach(data => {
                              if (data.type == "image") {
                                   const card = document.createElement("div");
                                   card.innerHTML = `
                                        <div class="card-content p-0">
                                             <img style="width:100%;height:auto;object-fit:cover;" src="${data.data}" alt="images" />
                                             <small class="mt-0 is-block is-flex is-align-items-center">
                                                  <a class="has-text-link button is-small is-outlined is-rounded" href="${data.url}" target="_blank">Web</a>
                                                  <a class="button is-small is-rounded is-warning is-link ml-2" href="${data.data}" target="_blank" download="figmagic.png">Save</a>
                                             </small>
                                        </div>`;
                                   cardGroup.appendChild(card);
                                   card.setAttribute("class", "card mb-2 no-shadow");
                              }
                              else {
                                   const card = document.createElement("div");
                                   card.innerHTML = `
                                        <div class="card-content p-3 py-1 custom-bg-dark has-text-white">
                                             <span class="custom-fs-14">
                                                  ${data.data}
                                             </span>
                                             <small class="is-block mt-1">
                                                  <a class="has-text-link button is-small is-outlined is-rounded" href="${data.url}" target="_blank">visit site</a>
                                             </small>
                                        </div>`;
                                   cardGroup.appendChild(card);
                                   card.setAttribute("class", "card mb-2");
                              }
                         });
                    }
               }
          }
          showTempData();

          saveBtn.addEventListener("click", async() => {
               // check if the apilimiter reach 0 and block request if it is 0 otherwise
               const response = await axios.post("http://127.0.0.1:8000/api/v1/temp/transfer", {token: token_key.value});
               location.reload();
               return false;
          });
          clearBtn.addEventListener("click", async() => {
               const response = await axios.post("http://127.0.0.1:8000/api/v1/temp/delete", {token: token_key.value});
               location.reload();
               return false;
          });
     }
});