$(document).ready(function() {

  var photos = [];
  var tracker;

 $.ajax({
    url: 'https://api.imgur.com/3/album/DDoWy.json',
    method: 'GET',
    headers: {
      'Authorization': 'Client-ID 4dcb72e91ca957f'
    }
  })
  .done(function(response) {
    photos = response.data.images;
    tracker = new Tracker();
  })
  .fail(function(error) {
    console.log(error);
  });

  var Photo = function(url) {
    this.url = url;
  };

  var Tracker = function() {
    console.log("creating tracker");
    this.initializePhotos();
    var toLoad = this.loadLocalData();
    if(toLoad) {
      console.log("loading local data");
      photos = this.loadLocalData();
    }
    this.renderComparison();
    this.renderChart();
    this.renderSideChart();
  };

  //Generated a random number between zero and max
  Tracker.prototype.generateRandom = function(max) {
    return Math.floor(Math.random() * max);
  };

  //Returns an img element for a random photo
  Tracker.prototype.renderRandomPhoto = function() {
    var random = this.generateRandom(photos.length);
    var photo = '<img src="' + photos[random][0].url + '" />';
    return photo;
  };

  //Add a photo to the array along with an int for counting votes.
  Photo.prototype.addPhoto = function() {
    var photoArray = [this,0];
    photos.push(photoArray);
  };

  Tracker.prototype.addPhoto = function(photo, index) {
    var photoArray = [photo, 0];
    photos[index] = photoArray;
  }

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
          fillColor: "#ff530d",
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

  var horizontalChart;
  Tracker.prototype.renderSideChart = function() {
    var voteArray = [];
    var labelArray = [];
    for(var i = 0; i < photos.length; i++) {
      voteArray[i] = this.getVotes(photos[i][0].url);
      labelArray[i] = "Cat " + (i+1);
    }
    var chartData = {
      labels: labelArray,
      datasets: [
        {
          fillColor: "#ff530d",
          strokeColor: "black",
          data: voteArray
        }
      ]
    };
    var options = {barStrokeWidth : 1, barValueSpacing : 5}
    var ctx = document.getElementById("sideBar").getContext("2d");
    horizontalChart = new Chart(ctx).HorizontalBar(chartData, options);
  };

  //Gets the index of a photo in the array with a particular url.
  //Returns false if the photo isn't there.
  Tracker.prototype.findPhotoInArray = function(url) {
    for(var i = 0; i < photos.length; i++) {
      if(photos[i][0].url == url) {
        return i;
      }
    }
    return false;
  };

  //Add a vote for a photo
  Tracker.prototype.incrementVote = function(photo) {
    var index = this.findPhotoInArray(photo);
    photos[index][1]++;
  };

  //Remove a vote for a photo
  Tracker.prototype.decrementVote = function(photo) {
    var index = this.findPhotoInArray(photo);
    photos[index][1]--;
  };

  //Get the number of votes that a photo currently has
  Tracker.prototype.getVotes = function(photo) {
    var index = this.findPhotoInArray(photo);
    return photos[index][1];
  };

  //Save the user's array to local storage
  Tracker.prototype.saveLocalData = function() {
    localStorage.setItem("photos", JSON.stringify(photos));
  };

  //Load the local copy of the array
  Tracker.prototype.loadLocalData = function() {
    return JSON.parse(localStorage.getItem("photos"));
  }

  //Event listener for the button click
  //May be moved to the Tracker constructor later
  $('button').hide();
  $('button').click(function() {
    $('button').hide();
    tracker.renderComparison();
    tracker.renderSideChart();
    tracker.renderChart();
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
            tracker.decrementVote(url);
          } else {
            $(this).addClass("highlight");
            tracker.incrementVote(url);
          }
          if($("#photo2 img").hasClass("highlight")) {
            $("#photo2 img").removeClass("highlight");
            tracker.decrementVote(otherCat);
          }
          break;
        case "photo2":
          otherCat = $("#photo1 img").attr("src");
          if($("#photo2 img").hasClass("highlight")) {
            $(this).removeClass("highlight");
            tracker.decrementVote(url);
          } else {
            $(this).addClass("highlight");
            tracker.incrementVote(url);
          }
          if($("#photo1 img").hasClass("highlight")) {
            $("#photo1 img").removeClass("highlight");
            tracker.decrementVote(otherCat);
          }
          break;
      }
      tracker.renderChart();
    });
  };

  //Initialize the photo array with the preset photos.
  //For use if there is no local data to go from, or to reset the game.
  Tracker.prototype.initializePhotos = function() {
    console.log("initializing the array");
    for(var i = 0; i < photos.length; i++) {
      var photoURL = photos[i].link;
      var photo = new Photo(photoURL);
      this.addPhoto(photo, i);
    };
  };

});
