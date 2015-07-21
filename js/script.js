$(document).ready(function() {

  var Photo = function(url) {
    this.url = url;
  };

  var Tracker = function() {
    this.photos = [];
    if(this.loadLocalData()) {
      photos = this.loadLocalData();
    }
  };

  //Generated a random number between zero and max
  Tracker.prototype.generateRandom = function(max) {
    return Math.floor(Math.random() * max);
  };

  //Picks a random number between zero and the number of photos
  //Deprecated function. To be removed soon.
  Tracker.prototype.pickRandomPhoto = function() {
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
  Tracker.prototype.renderComparison = function() {
    this.saveLocalData();
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

  //Render the chart comparing votes for the two pics
  var theChart = null;
  Tracker.prototype.renderChart = function() {
    var votes1 = this.getVotes($("#photo1 img").attr("src"));
    var votes2 = this.getVotes($("#photo2 img").attr("src"));
    var chartData = {
      labels: ["Cat 1", "Cat 2"],
      datasets: [
        {
          fillColor: "orange",
          strokeColor: "black",
          data: [votes1, votes2]
        }
      ]
    };
    var votes = document.getElementById("chart").getContext("2d");
    if(theChart) {
      theChart.destroy();
    }
    theChart = new Chart(votes).Bar(chartData);
  };

  //Gets the index of a photo in the array with a particular url.
  //Returns false if the photo isn't there.
  Tracker.prototype.findPhotoInArray = function(url) {
    for(var i = 0; i < this.photos.length; i++) {
      if(this.photos[i][0].url == url) {
        return i;
      }
    }
    return false;
  };

  //Add a vote for a photo
  Tracker.prototype.incrementVote = function(photo) {
    var index = this.findPhotoInArray(photo);
    this.photos[index][1]++;
  };

  //Remove a vote for a photo
  Tracker.prototype.decrementVote = function(photo) {
    var index = this.findPhotoInArray(photo);
    this.photos[index][1]--;
  };

  //Get the number of votes that a photo currently has
  Tracker.prototype.getVotes = function(photo) {
    var index = this.findPhotoInArray(photo);
    return this.photos[index][1];
  };

  //Save the user's array to local storage
  Tracker.prototype.saveLocalData = function() {
    localStorage.setItem("photos", JSON.stringify(this.photos));
  };

  //Load the local copy of the array
  Tracker.prototype.loadLocalData = function() {
    this.photos = JSON.parse(localStorage.getItem("photos"));
  }

  //Event listener for the button click
  //May be moved to the Tracker constructor later
  $('button').hide();
  $('button').click(function() {
    $('button').hide();
    testTracker.renderComparison();
    testTracker.renderChart();
  });

  //Attaches an event listener to the images on the page
  var highlight = function() {
    $('img').click(function(e) {
      $('button').show();
      var url = e.target.getAttribute("src");
      var currentCat = e.target.parentNode.id;
      var otherCat;
      switch(currentCat) {
        case "photo1":
          otherCat = $("#photo2 img").attr("src");
          if($("#photo1 img").hasClass("highlight")) {
            $(this).removeClass("highlight");
            testTracker.decrementVote(url);
          } else {
            $(this).addClass("highlight");
            testTracker.incrementVote(url);
          }
          if($("#photo2 img").hasClass("highlight")) {
            $("#photo2 img").removeClass("highlight");
            testTracker.decrementVote(otherCat);
          }
          break;
        case "photo2":
          otherCat = $("#photo1 img").attr("src");
          if($("#photo2 img").hasClass("highlight")) {
            $(this).removeClass("highlight");
            testTracker.decrementVote(url);
          } else {
            $(this).addClass("highlight");
            testTracker.incrementVote(url);
          }
          if($("#photo1 img").hasClass("highlight")) {
            $("#photo1 img").removeClass("highlight");
            testTracker.decrementVote(otherCat);
          }
          break;
      }
      testTracker.renderChart();
    });
  };



  var testTracker = new Tracker();
  for(var i = 0; i <= 13; i++) {
    var photoURL = "img/" + i + ".jpg";
    var photo = new Photo(photoURL);
    testTracker.addPhoto(photo);
  };
  testTracker.renderComparison();
  testTracker.renderChart();

});
