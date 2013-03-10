var timer;
var photos;
var search_index
var index = 0;
var per_page = 500;
var page = 1;
var is_paused = false;
var searches = [];

$(document).ready(start_program);


function start_program() {
  $('#search_button').click(search_flickr)
  $('#pause_button').click(pause);
}

function pause(){
  if(is_paused)
    timer = setInterval(display_photo, 500);
  else
    clearInterval(timer)

  is_paused = !is_paused;
}

function search_flickr(){
  clearInterval(timer)
  var query = $('input').val();
  $.getJSON('http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=cb8af8caa407b482fc42f891f05e0951&text=' + query + '&per_page='+ per_page +'&page=' + page + '&format=json&jsoncallback=?', flickr_finished);
}

function flickr_finished(data){
  index = 0;
  search_index = 0;
  photos = data.photos.photo;
  searches.push(photos)
  timer = setInterval(display_photo, 500);
  // _.each(data.photos.photo, display_photo);
}

function display_photo(){
  if(search_index < searches.length - 1)
    search_index++;
  else
    search_index = 0;
  console.log("search_index: %o, index: %o, searches: %o", 
    search_index, index, searches);
  var photo = searches[search_index][index]
  // var photo = photos[index]
  var url = "url(http://farm"+ photo.farm +".static.flickr.com/"+ photo.server +"/"+ photo.id +"_"+ photo.secret +"_m.jpg)";
  var img = $('<div>');
  img.css('background-image', url);
  img.addClass('photo');
  $('#photos').prepend(img);
  index++;
  if(index == per_page){
    clearInterval(timer);
    page++;
    search_flickr();
  }
}
