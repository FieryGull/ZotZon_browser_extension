function getTitle(body){
    let title = [];
    let title_answer = "";
    title = body.getElementsByClassName('title-info-title-text');
    if (title[0] !== undefined) {
        title_answer = title[0].innerText.trim()
    }
    return title_answer;
}


function getPrice(body){
    let price =[];
    price = body.getElementsByClassName('price-value-string js-price-value-string');
    try {
        price_answer = price[0].innerText;
    }
    catch (e){
        if (e instanceof TypeError) {
            price_answer = "0";
        }
    }
    return price_answer;
}


function getImages(body) {
    let images = [];
    let images_answer = [];
    images = body.getElementsByClassName('vacancy-shop-photo-img');
    for (var i = 0; i < images.length; i++) {
        images_answer.push(images[i].src);
    }
    if (images_answer.length === 0) {
        images = body.getElementsByClassName('gallery-list-item-link');
        for (var i = 0; i < images.length; i++) {
            images_answer.push(images[i].firstElementChild.src);
        }       
    }
    if (images_answer.length === 0) {
        images = body.getElementsByClassName('gallery-img-cover');
        for (var i = 0; i < images.length; i++) {
            images_answer.push(images[i].nextElementSibling.src);
        }  
    }
    if (images_answer.length != 0) {
        images_answer[0] = images_answer[0].replace("75x55","640x480");
    }
    return images_answer
}


function getDesc(body){
    let desc = body.querySelectorAll('div[class^="item-description-"]');
    let desc2 = body.querySelectorAll('div[class^="item-params"]');
    if (desc2[0] !== undefined) {
        fulldesc = desc2[0].innerText+"\n"+desc[0].innerText;
    }
    else if (desc[0] !== undefined){
        fulldesc = desc[0].innerText;
    }
    else {
        fulldesc = "";
    }
    return fulldesc;
}


function getCateg(body){
    let categories = [];
    categories = body.getElementsByClassName('breadcrumbs js-breadcrumbs');
    console.log(categories[0].innerText);
    return categories[0].innerText;
}

function getLocation(body) {

    let address = body.getElementsByClassName('item-address__string');
    let addressText = address[0].innerText.trim();

    return addressText;
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'parse_page') {
        const body = document.body;
        const answerObj = {
            title: getTitle(body),
            description: getDesc(body),
            price: getPrice(body),
            images: getImages(body),
            area: getLocation(body),
            category: getCateg(body)
        };
        console.log(answerObj);
        sendResponse(JSON.stringify(answerObj));
    }
});