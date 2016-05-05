var urlBase = 'https://api.spotify.com/v1/search';
var urlDetails = 'https://api.spotify.com/v1/artists/#/albums';
var urlTracks = 'https://api.spotify.com/v1/albums/#/tracks';

//?type=artist&query=SEARCHTERM

$('form').on('submit', function(event) {
  event.preventDefault();
  $.ajax({
    url: urlBase,
    data: {
      type: 'artist',
      query: $('#artistName').val()
    },
    success: handleRecords,
    error: function() {
      console.log('MAL');
    },
    datatype: 'json'
  })
});

function handleRecords(artists) {
  $('.js-artist').html(getArtistFromResponse(artists.artists.items));
}

function artistToHTML(artist) {
  var image = '';
  if (artist.images.length > 0){
    image = '<img src="' + artist.images[0].url + '" alt="image" width="350px">';
  } else {
    image = '<img src="https://image.freepik.com/vector-gratis/musico-que-toca-la-trompeta_91-9699.jpg" alt="image" width="350px">';
  }
  return '' +
    '<div class="col-sm-4 js-zoom">' +
      '<h3>' + artist.name + '</h3>' +
      '<p class="hide">' + artist.id + '</p>' +
      image +
    '</div>';
}

function getArtistFromResponse(artists) {
  return artists.reduce(function(result, artist) {
    result += artistToHTML(artist);
    return result;
  },'');
}

$('.js-artist').on('click', '.js-zoom', function(){
  $.ajax({
    url: urlDetails.replace('#', $(this).find('p').text()),
    data: '',
    success: handleDetails,
    error: function() {
      console.log('MAL');
    },
    datatype: 'json'
  });
  $('.js-artist-title').text($(this).find('h3').text());
  $('.modal').modal('show');
});

function handleDetails(albums) {
  $('.js-album-list').html(getAlbumFromResponse(albums.items));
}

function getAlbumFromResponse(albums) {
  return albums.reduce(function(result,album) {
    result += albumToHTML(album);
    return result;
  },'');
}

function albumToHTML(album) {
  return '<li class="list-group-item js-album-title">' + album.name + '<span class="hide">' + album.id + '</span><ul class="collapse js-tracklist"></ul></li>';
}

$('.js-album-list').on('click', '.js-album-title', function() {
  var tracklist = $(this).find('.js-tracklist');
  if(tracklist.html() == '') {
    $.ajax({
      url: urlTracks.replace('#', $(this).find('span').text()),
      data: '',
      success: handleTracks,
      error: function() {
        console.log('MAL');
      },
      datatype: 'json'
    });
  } else {
    tracklist.collapse('hide');
    tracklist.html('');
  }

  function handleTracks(tracks) {
    tracklist.html(getTrackFromResponse(tracks.items));
    tracklist.collapse('show');
  }
});


function getTrackFromResponse(tracks) {
  return tracks.reduce(function(result,track) {
    result += trackToHTML(track);
    return result;
  },'');
}

function trackToHTML(track) {
  return '<li><a href="' + track.preview_url + '" target="_blank">' + track.name + '</a></li>';
}
