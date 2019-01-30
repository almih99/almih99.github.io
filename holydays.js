// Сей ничтожный скриптик выводит сообщение связанное с праздником текущим...

//---------------------------------------------------------------------------
// Даты отмечаемых праздников... Пока немного, но потом добавим...
//         dd  mm  file        tex[
var holydays=
 [[ 1,  1, '0101.png', 'С Новым Годом!'],
  [ 7,  1, '0701.png', 'С Рождеством Христовым!'],
  [23,  2, '2302.png', 'С Днем Защитника Отечества!'],
  [ 8,  3, '0803.jpg', 'С Международным Женским Днем!'],
  [22,  4, '2204.jpg', 'День рождения В.И.Ленина'],
  [ 1,  5, '0105.jpg', 'С Первомаем!'],
  [ 9,  5, '0905.png', 'С Днем Победы!'],
  [12,  6, '1206.jpg', 'С Днем России!'],
  [ 4, 11, '0411.jpg', 'С Днем Народного Единства!'],
  [ 7, 11, '0711.jpg', 'Великой Октябрьская Социалистическая Революция!'],
  [13, 11, '1311.jpg', 'Принимаю поздравления с днем рождения'],
  [28, 12, '2812.jpg', 'День рождения Линуса Торвальдса'],
  [31, 12, '0101.png', 'С наступающим Новым Годом!']
 ];

function insertHtmlElement(parent, name, classname) {
  if(typeof(parent)==="string") parent=document.getElementById(parent);
  if(!parent) {
    console.log("bad parent element");
    return;
   }
  var element = document.createElement(name);
  if(classname) element.className=classname;
  parent.appendChild(element);
  return element;
}

function addNewRecord(placeID, date, title, text, href, img) {
  var newsCont = insertHtmlElement(placeID, "div", "right-field-news-item");
  var newsDate = insertHtmlElement(newsCont, "div", "right-field-news-date");
  newsDate.innerHTML=date;
  var newsHead = insertHtmlElement(newsCont, "div", "right-field-news-header");
  if(href) {
    var newsHeadLink = insertHtmlElement(newsHead, "a");
    newsHeadLink.href = href;
    newsHeadLink.innerHTML = title;
  } else {
    newsHead.innerHTML = title;
  }
  if(img) {
    var newsImgBlk = insertHtmlElement(newsCont, "div", "right-field-news-image");
    newsImgBlk.src = img;
    if(href) {
      var newsImgLnk = insertHtmlElement(newsImgBlk, "a");
      newsImgLnk.href = href;
      var newsImg = insertHtmlElement(newsImgLnk, "img");
      newsImg.src = img;
    } else {
      var newsImg = insertHtmlElement(newsImgBlk, "img");
      newsImg.src = img;
    }
  }
  if(text) {
    var newsBody = insertHtmlElement(newsCont, "div", "right-field-news-body");
    var lines=text.split("\\n");
    for(var line of lines) {
      var currentP = insertHtmlElement(newsCont, "p");
      currentP.innerText = line;
    }
  }
  if(href) {
   var newsMainLinkBlk = insertHtmlElement(newsCont, "div","right-field-news-link");
   var newsMainLink = insertHtmlElement(newsMainLinkBlk, "a");
   newsMainLink.href = href;
   newsMainLink.innerHTML = "&#8680;";
  }
}

function showNews(whereID, src, count) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", src, true);
  xhr.onload = function(e){
		if (xhr.status == 200) {
		  var res = JSON.parse(xhr.responseText);
		} else {
		  return;
		}
    for(var i=0; i<count; i++) {
      if(res.articles[i]) {
        var d = new Date(Date.parse(res.articles[i].publishedAt));
        addNewRecord(whereID,
           d.getDate() + "." + (d.getMonth()+1) + "." + d.getFullYear(),
           res.articles[i].description,
           res.articles[i].content,
           res.articles[i].url,
           res.articles[i].urlToImage);
      }
    }
  }
  xhr.crossorigin = true;
  xhr.send();
}

function showHolyday(whereID) {
  var dt = new Date();
  var day = dt.getDate();
  var month = dt.getMonth()+1;
  var year = dt.getFullYear();
  for(var i = 0; i<holydays.length; i++) {
    if(holydays[i][0]===day && holydays[i][1]===month) {
      addNewRecord(whereID,
        "Сегодня " + day + "." + month + "." + year,
        holydays[i][3],
        null,
        null,
        "img/events/" + holydays[i][2]);
    }
  }

}
