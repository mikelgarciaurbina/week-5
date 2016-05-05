PokemonApp.PokemonEvolution = function(pokemonUri) {
  this.id = PokemonApp.PokemonEvolution.idFromUri(pokemonUri);
}

PokemonApp.PokemonEvolution.prototype.render = function() {
  console.log("Rendering evolution for: #" + this.id);

  var self = this;

  $.ajax({
    url: "/api/pokemon/" + this.id,
    success: function(response) {
      self.info = response;

      $(".js-pkmne-name").text(self.info.name);
      $(".js-pkmne-number").text(self.info.pkdx_id);
      $(".js-pkmne-height").text(self.info.height);
      $(".js-pkmne-weight").text(self.info.weight);
      $(".js-pkmne-hp").text(self.info.hp);
      $(".js-pkmne-attack").text(self.info.attack);
      $(".js-pkmne-defense").text(self.info.defense);
      $(".js-pkmne-sp_atk").text(self.info.sp_atk);
      $(".js-pkmne-sp_def").text(self.info.sp_def);
      $(".js-pkmne-speed").text(self.info.speed);
      $(".js-pkmne-types").text(response.types.map(function(type){return type.name;}).join(" ,"));

      self.setSpryte(response);
      self.setDescription(response);
    }
  });
}

PokemonApp.PokemonEvolution.prototype.setSpryte = function(response) {
  var randomSpryte = response.sprites[Math.floor(Math.random() * response.sprites.length)];

  response.sprites[0].resource_uri

  $.ajax({
    url: randomSpryte.resource_uri,
    success: function(imageResponse) {
      $(".js-pkmne-image").html("<img src='http://pokeapi.co" + imageResponse.image + "' alt='Pokemon Image' >");

      $(".js-pokemonEvolution-modal").modal("show");
    }
  });
}

PokemonApp.PokemonEvolution.prototype.setDescription = function(response) {

  var descriptionsGeneration = response.descriptions.map(function(element){
    return parseInt(element.name.split('_')[2]);
  });
  
  var maxDescription = Math.max.apply(Math, descriptionsGeneration);

  var descriptions = response.descriptions.filter(function(element) {
    return element.name.includes(maxDescription);
  });

  if(descriptions.length > 0){
    $.ajax({
      url: descriptions[0].resource_uri,
      success: function(descriptionResponse) {
        $(".js-pkmne-description").html("<p>" + descriptionResponse.description + "</p>");
      }
    });
  }
}

PokemonApp.PokemonEvolution.idFromUri = function(pokemonUri) {
  var uriSegments = pokemonUri.split("/");
  var secondLast = uriSegments.length - 2;
  return uriSegments[secondLast];
}

$(document).on("ready", function() {
  $(".js-show-evolution").on("click", function(event){
    var $button = $(event.currentTarget);
    var pokemonUri = $button.data("pokemonUri");

    var pokemonEvolution = new PokemonApp.PokemonEvolution(pokemonUri);
    pokemonEvolution.render();
  });
});