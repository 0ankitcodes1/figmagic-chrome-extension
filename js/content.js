chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
     if(request.message == "crop-image") {
          var body = document.querySelector("body");
          var container = document.createElement("div");
          body.appendChild(container);
          body.innerHTML = `
               <div class="is-flex is-justify-content-center">
               <img id="crop-image" src="${request.data}" alt="" />
               <div id="ext-btn-group">
                    <button id="ext-save-btn" class="button is-link p-2">Save</button>
                    <button id="ext-cancel-btn" class="button is-danger p-2">Cancel</button>
               </div>
               </div>
          `;
          // container.setAttribute("style", "position:absolute;top:0;left:0;z-index:999;width:100%;height:100%;");
          var image = document.querySelector("#crop-image");
          var saveBtn = document.querySelector("#ext-save-btn");
          var cancelBtn = document.querySelector("#ext-cancel-btn");
          image.setAttribute("style", "height:30rem; width: 40rem;");
          const cropper = new Cropper(image, {
               aspectRation: 16 / 9,
               dragMode: 'move',
               // cropBoxResizable: false,
               crop(event) {
                    // console.log(event.detail.x);
                    // console.log(event.detail.y);
                    // console.log(event.detail.width);
                    // console.log(event.detail.height);
                    // console.log(event.detail.rotate);
                    // console.log(event.detail.scaleX);
                    // console.log(event.detail.scaleY);
               },
          });

          saveBtn.addEventListener("click", async() => {
               const cropedImg = await cropper.getCroppedCanvas().toDataURL("image/png");

               chrome.runtime.sendMessage({message: "cropping", data: cropedImg, type: request.type, url: request.url, status: request.status, token: request.token}, function(response) {
                    // console.log(response);
               });
               location.reload();
               return false;
          });
          cancelBtn.addEventListener("click", function() {
               location.reload();
               return false;
          });
     }
     else {
          // console.log("loading page . . .");
     }
});