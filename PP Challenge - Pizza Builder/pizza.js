// Write your Pizza Builder JavaScript in this file.

var class_ingredient = {"Pepperonni": [1,".pep"], "Mushrooms": [1,".mushroom"], "Green peppers": [1,".green-pepper"], "White sauce": [3,".sauce-white"], "Gluten-free crust": [5,".crust-gluten-free"]};

updatePrice();

$('.btn').each(function(index, element) {
  $(element).on('click', function(event) {
    $(class_ingredient[$(element).html()][1]).toggle();
    $(this).toggleClass('active');
    updatePrice();
    updatePiceList($(this).html().toLowerCase());
  });
});

function updatePiceList(button_name) {
  $('.price ul li').each(function(index, element){
    if($(element).text().includes(button_name)) {
      $(element).toggleClass('hide');
    }
  });
}

function updatePrice() {
  var total = $.makeArray($('.btn')).reduce(function(result, element) {
    if($(element).hasClass('active')) {
      return result + class_ingredient[$(element).html()][0];
    }
    return result;
  },10);

  $('.price strong').text("$" + total);
}