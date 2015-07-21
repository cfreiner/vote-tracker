var Photo = function(url){
  this.url = url;
}

var Tracker = function(){
  this.photos = [];
}

//Generated a random number between zero and max
Tracker.prototype.generateRandom = function(max) {
  return Math.floor(Math.random() * max);
};

//Picks a random number between zero and the number of photos
//Deprecated function. To be removed soon.
Tracker.prototype.pickRandomPhoto = function(){
  return this.generateRandom(this.photos.length);
};

//Returns an img element for a random photo
Tracker.prototype.renderRandomPhoto = function() {
  var random = this.generateRandom(this.photos.length);
  var photo = '<img src="' + this.photos[random][0].url + '" />' + this.photos[random][1];
  return photo;
};

//Add a photo to the array along with an int for counting votes.
Tracker.prototype.addPhoto = function(photo) {
  var photoArray = [photo,0];
  this.photos.push(photoArray);
};

//Display two random photos
Tracker.prototype.renderComparison = function(){
  var photo1 = this.renderRandomPhoto();
  var photo2 = this.renderRandomPhoto();
  while(photo1 == photo2){
    console.log("the photos were the same!");
    var photo1 = this.renderRandomPhoto();
    var photo2 = this.renderRandomPhoto();
  }
  $('#photo1').html(photo1);
  $('#photo2').html(photo2);
  highlight();
};

//Gets the index of a photo in the array with a particular url.
//Returns false if the photo isn't there.
Tracker.prototype.findPhotoInArray = function(url) {
  console.log(url);
  for(var i = 0; i < this.photos.length; i++){
    if(this.photos[i][0].url == url){
      return i;
    }
  }
  return false;
};

//Add a vote for a photo
Tracker.prototype.incrementVote = function(photo){
  var index = this.findPhotoInArray(photo);
  this.photos[index][1]++;
};

//Event listener for the button click
//May be moved to the Tracker constructor later
$(document).ready(function(){
  $('button').click(function(){
    testTracker.incrementVote($('.highlight').attr('src'));
    $('button').css({'visibility':'hidden'});
    testTracker.renderComparison();
  });
});

//Event listener for highlighting the user choice.
//Has to be called every time new images are drawn to reattach the listener.
var highlight = function(){
  $(document).ready(function(){
    $('img').click(function(){
    $('button').css({'visibility':'visible'});
    $('.highlight').removeClass('highlight');
    $(this).toggleClass('highlight');
    });
  });
}

var testTracker = new Tracker();
for(var i = 0; i <= 13; i++) {
  var photoURL = "img/" + i + ".jpg";
  var photo = new Photo(photoURL);
  testTracker.addPhoto(photo);
};
testTracker.renderComparison();
