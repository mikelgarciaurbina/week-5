var phrases = ['I like pie.', 'Add some of your own phrases here', 'Make sure to follow all but the last phrases with a comma.'];

phrases.forEach(function(element) {
  $('.phrase_list').append("<li>" + element + " <span class='remove'>X</span></li>");
});

show_random_phrase();

$('.button').on('click', function() {
  show_random_phrase();
});

$('form').on('submit', function(event) {
  event.preventDefault();
  if($('.new_phrase').val() !== "") {
    phrases.push($('.new_phrase').val());
    $('.temp').remove();
    $('.phrase_list').append("<li>" + $('.new_phrase').val() + " <span class='remove'>X</span></li>");
    $('.new_phrase').val("");
    $('.new_phrase').blur();
    if(phrases.length === 1)
      show_random_phrase();
  }
});

$('a').on('click', function() {
  if($('a').html().includes("Show"))
    $('a').html("Hide sentences");
  else
    $('a').html("Show sentences");

  $('.phrase_list').toggleClass("hide");
});

$('.phrase_list').delegate('.remove', 'click', function() {
  var othis = this;
  phrases.forEach(function(element, index) {
    if($(othis).parent().text().includes(element))
      phrases.splice(index, 1);
  });
  $(this).parent().remove();
  if($('.bold').length == 0)
    show_random_phrase();
});

$('.new_phrase').on('focus', function() {
    $('.phrase_list').append("<li class='temp'></li>");
});

$('.new_phrase').on('focusout', function() {
    $('.temp').remove();
    $('.new_phrase').val("");
});

$('.new_phrase').on('keyup', function() {
  $('.temp').text($('.new_phrase').val());
});


function show_random_phrase() {
  var random_number = Math.floor(Math.random()*phrases.length);
  if(phrases[random_number] == undefined){
    $('.phrase').html("<h1>No sentences</h1>");
  } else {
    $('.phrase').html("<h1>" + phrases[random_number] + "</h1>");
    update_highlighted_phrase(random_number);
  }
}

function update_highlighted_phrase(random_number) {
  $('.bold').removeClass('bold');
  $('.phrase_list li:nth-child(' + (random_number + 1) + ')').addClass('bold');
}
