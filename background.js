"use strict";

chrome.contextMenus.create({
     id: "text",
     contexts: ["selection"],
     title: "Save Text"
});

chrome.contextMenus.create({
     id: "image",
     contexts: ["image"],
     title: "Save Image"
});

chrome.contextMenus.create({
     id: "screenshot",
     contexts: ["all"],
     title: "Save Visible Screenshot"
});

chrome.contextMenus.create({
     id: "crop-image",
     contexts: ["all"],
     title: "Crop A Section"
});

function getCookies(domain, name, callback) {
     chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
          if(callback) {
               callback(cookie.value);
          }
     });
}

chrome.contextMenus.onClicked.addListener(function(api, tab){
     if (api.menuItemId == "image") {
          const data = api.srcUrl;
          const type = api.menuItemId;
          const url = api.pageUrl; 
          const status = "temporary";
          getCookies("http://127.0.0.1:8000", "token_key", function(token_key) {
               if (token_key == null || token_key == undefined) {
                    console.log("%cSorry user is not logged in", "color:red");
               }
               else {
                    (async function() {
                         let blob = await fetch(""+data+"").then(r => r.blob());
                         let dataUrl = await new Promise(resolve => {
                         let reader = new FileReader();
                         reader.onload = () => resolve(reader.result);
                         reader.readAsDataURL(blob);
                         });
                         // console.log(dataUrl);
                         // now do something with `dataUrl`

                         fetch("http://127.0.0.1:8000/api/v1/temp", {
                              method: "POST",
                              body: JSON.stringify({
                                   data: dataUrl,
                                   type: type,
                                   url: url,
                                   status: status,
                                   token: token_key
                              }),
                              headers: {
                                   "Content-type": "application/json"
                              }
                         }).then(function (response) {
                              if (response.ok) {
                                   return response.json();
                              }
                         }).then(function (data) {
                              console.log(data);
                         }).catch(function (error) {
                              console.warn("Something went wrong.", error);
                         });
                    })();
               }
          });
     }
     else if (api.menuItemId == "text") {
          const data = api.selectionText;
          const type = api.menuItemId;
          const url = api.pageUrl; 
          const status = "temporary";
          getCookies("http://127.0.0.1:8000", "token_key", function(token_key) {
               if (token_key == null || token_key == undefined) {
                    console.log("%cSorry user is not logged in", "color:red");
               }
               else {
                    fetch("http://127.0.0.1:8000/api/v1/temp", {
                         method: "POST",
                         body: JSON.stringify({
                              data: data,
                              type: type,
                              url: url,
                              status: status,
                              token: token_key
                         }),
                         headers: {
                              "Content-type": "application/json"
                         }
                    }).then(function (response) {
                         if (response.ok) {
                              return response.json();
                         }
                    }).then(function (data) {
                         // console.log(data);
                    }).catch(function (error) {
                         console.warn("Something went wrong.", error);
                    });
               }
          });
     }
     else if (api.menuItemId == "screenshot") {
          chrome.tabs.captureVisibleTab(null, {}, function (image) {
               // const type = api.menuItemId;
               getCookies("http://127.0.0.1:8000", "token_key", function(token_key) {
                    if (token_key == null || token_key == undefined) {
                         console.log("%cSorry user is not logged in", "color:red");
                    }
                    else {
                         console.log("sending");
                         fetch("http://127.0.0.1:8000/api/v1/temp", {
                              method: "POST",
                              body: JSON.stringify({
                                   data: image,
                                   type: "image",
                                   url: api.pageUrl,
                                   status: "temporary",
                                   token: token_key
                              }),
                              headers: {
                                   "Content-type": "application/json"
                              }
                         }).then(function (response) {
                              if (response.ok) {
                                   return response.json();
                              }
                         }).then(function (data) {
                              // console.log(data);
                         }).catch(function (error) {
                              console.warn("Something went wrong.", error);
                         });
                    }
               });
          });
     }
     else if (api.menuItemId == "crop-image") {
          chrome.tabs.captureVisibleTab(null, {}, function (image) {
               const data = image;
               // const type = api.menuItemId;
               const type = "image";
               const url = api.pageUrl; 
               const status = "crop-image";
               
               chrome.tabs.sendMessage(tab.id, {
                    "message": "crop-image",
                    "data": data,
                    "type": type,
                    "url": url,
                    "tabId": tab.id,
                    "status": status
               });
          });

     }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
     if (changeInfo.status == "complete") {
          chrome.tabs.sendMessage(tabId, {
               "message": "loading complete",
               "tab": tab,
               "tabId": tabId
          });
     }
     else {
          chrome.tabs.sendMessage(tabId, {
               "message": "loading",
               "tabId": tabId
          });
     }
});

chrome.runtime.onMessage.addListener(
     function(request, sender, sendResponse) {
       if (request.message == "cropping") {
          console.log(request);
          getCookies("http://127.0.0.1:8000", "token_key", function(token_key) {
               if (token_key == null || token_key == undefined) {
                    console.log("%cSorry user is not logged in", "color:red");
               }
               else {
                    fetch("http://127.0.0.1:8000/api/v1/temp", {
                         method: "POST",
                         body: JSON.stringify({
                              data: request.data,
                              type: "image",
                              url: request.url,
                              status: "temporary",
                              token: token_key
                         }),
                         headers: {
                              "Content-type": "application/json"
                         }
                    }).then(function (response) {
                         if (response.ok) {
                              return response.json();
                         }
                    }).then(function (data) {
                         console.log(data);
                    }).catch(function (error) {
                         console.warn("Something went wrong.", error);
                    });
               }
               sendResponse({response: "found"});
          });
       }
     }
);
