async function sendObject(domContent) {
    let answer = [];
    let status = true;
    fetch('http://localhost:4567/createAd',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: domContent
    }).then(  
        function(response) {  
          if (response.status !== 200) {  
            console.log('Looks like there was a problem. Status Code: ' +  
              response.status);
              status = false;
              return;    
          }
          response.json().then(function(data) {  
            answer.push(data);
          });  
        }  
      )  
      .catch(function(err) {  
        console.log('Fetch Error :-S', err);  
      });

      setTimeout(function(){
        if (answer[0] !== undefined){
          if (status === false) {
            document.getElementById("loading").style.display = "none";
            alert("Произошла ошибка в создании объявления");
          } else {
          document.getElementById("link-href").href = "http://localhost:4567/ad/?id="+answer[0];
          document.getElementById("link").style.display = "block";
          document.getElementById("loading").style.display = "none";
          }
        } else {
          document.getElementById("loading").style.display = "none";
          alert ("Возникли проблемы с доступом к серверу");
        }
      },2000);
    void chrome.runtime.lastError;
}

function parsePage() {
  var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?avito\.ru\/[\w\d\s-.]+\/[\w\d\s-.]+\/[\w\d\s-.]+/;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      if (urlRegex.test(tabs[0].url)) {
        document.getElementById("loading").style.display = "block";
        chrome.tabs.sendMessage(tabs[0].id, {text: 'parse_page'}, sendObject);
        }
      else {
        alert("Ошибка расположения: Перейдите на страницу с объявлением Avito")
      }
    }
);
}

el = document.getElementById("createAd");
document.addEventListener('DOMContentLoaded', function () {
    if (el) {
        el.addEventListener('click', parsePage);
    }
});

var hrefs = document.getElementsByTagName("a");

function openLink() {
    var href = this.href;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.update(tab.id, {url: href});
    });
}

for (var i=0,a; a=hrefs[i]; ++i) {
    hrefs[i].addEventListener('click', openLink);
}
