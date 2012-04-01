$(document).ready( function(){

  //Cached selectors
  var infoList = $('div#info');
  var twitterData = "";
  var grouponData = "";
  var twitterImages = new Array();
  var groupImages = new Array();
  var theWindow = $(window);
  var picBox = $('#pic');
  var textBox = $('#desc');

  /*
   * Bing Maps setup
   * map creation and pin creation setup
   */
  var map = null; 
  function getMap() {
    map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
      credentials: 'Assd2akCabc9zZOrMER5t5DUkIHfUhvLuUawIyLYrno_IlOa4RU7iVYtVpgYbGn1',
      enableClickableLogo: false,
      enableSearchLogo: false,
      disablePanning: true,
      disableZooming: true,
      showDashboard: false,
      showScalebar: false,
      width: '700',
      height: '800',
//      mapTypeId: Microsoft.Maps.MapTypeId.mercator,
      zoom: 8,
      center: new Microsoft.Maps.Location(40.0393264770508, -74.5893569946289)
    });
  };  

  function addPin(lat, lng, thumb, text) {
    var pushpinOptions = {icon:thumb, width: 48, height: 48}; 
    var pushpin= new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(lat,lng), pushpinOptions); 
    pushpinClick = Microsoft.Maps.Events.addHandler(pushpin, 'click', function() {
      picBox.html('<img src=\"'+thumb+'\">');
      textBox.html(text);
    });
    map.entities.push(pushpin);
  }

  $.ajax({
    type: 'POST',
    url: 'backend/controller.php',
    data: {'lens': 'twitter'},
    success: function(response) {
        twitterData = $.parseJSON(response);
        console.log('success');
        for (var i = 0; i < twitterData.length; i++) {
          var current = twitterData[i];
          var pic = current.img;
          var tweetID = current._id.$id;
          var image = new Image();
          image.src = pic;
          twitterImages.push(image);
          $.ajax({
            type: 'POST',
            url: 'backend/controller.php',
            data: {'lens': 'groupon'},
            success: function(response) {
                grouponData = $.parseJSON(response);
                for (var i = 0; i < grouponData.length; i++) {
                  var curr = grouponData[i];
                  var pic = curr.img;
                  var image = new Image();
                  image.src = pic;
                  groupImages.push(image);
                }
            }
          });
        }
      }
  }); //Preloads images

  /*
   * Bing Maps exectution
   */
  getMap();
  $('li#twitter').on('click', function(event){
    event.preventDefautlt();
    for (var i = 0; i < twitterImages.length; i++) {
      var ptr = twitterImages[i];
      var lat = ptr.lat;
      var lng = ptr.lng;
      var pic = ptr.img;
      var text = "<h3>"+ptr.name+"<small>"+ptr.handle+"</h3><br /><p>"+ptr.tweet+"</p>";
      var target = addPin(lat, lng, pic, text);
    };
  });



}); //end docReady
