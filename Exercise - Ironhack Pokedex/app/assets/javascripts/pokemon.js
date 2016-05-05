// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
PokemonApp.Pokemon = function(pokemonUri) {
  this.id = PokemonApp.Pokemon.idFromUri(pokemonUri);
}

PokemonApp.Pokemon.prototype.render = function() {
  console.log("Rendering pokemon: #" + this.id);

  var self = this;

  $.ajax({
    url: "/api/pokemon/" + this.id,
    success: function(response) {
      self.info = response;

      $(".js-pkmn-name").text(self.info.name);
      $(".js-pkmn-number").text(self.info.pkdx_id);
      $(".js-pkmn-height").text(self.info.height);
      $(".js-pkmn-weight").text(self.info.weight);
      $(".js-pkmn-hp").text(self.info.hp);
      $(".js-pkmn-attack").text(self.info.attack);
      $(".js-pkmn-defense").text(self.info.defense);
      $(".js-pkmn-sp_atk").text(self.info.sp_atk);
      $(".js-pkmn-sp_def").text(self.info.sp_def);
      $(".js-pkmn-speed").text(self.info.speed);
      $(".js-pkmn-types").text(response.types.map(function(type){return type.name;}).join(" ,"));
      $(".js-show-evolution").data('pokemonUri', response.evolutions[0].resource_uri);

      self.setSpryte(response);
      self.setDescription(response);
    }
  });
}

PokemonApp.Pokemon.prototype.setSpryte = function(response) {
  var randomSpryte = response.sprites[Math.floor(Math.random() * response.sprites.length)];

  response.sprites[0].resource_uri

  $.ajax({
    url: randomSpryte.resource_uri,
    success: function(imageResponse) {
      $(".js-pkmn-image").html("<img src='http://pokeapi.co" + imageResponse.image + "' alt='Pokemon Image' >");

      $(".js-pokemon-modal").modal("show");
    }
  });
}

PokemonApp.Pokemon.prototype.setDescription = function(response) {

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
        $(".js-pkmn-description").html("<p>" + descriptionResponse.description + "</p>");
      }
    });
  }
}

PokemonApp.Pokemon.idFromUri = function(pokemonUri) {
  var uriSegments = pokemonUri.split("/");
  var secondLast = uriSegments.length - 2;
  return uriSegments[secondLast];
}

$(document).on("ready", function() {
  $(".js-show-pokemon").on("click", function(event){
    var $button = $(event.currentTarget);
    var pokemonUri = $button.data("pokemon-uri");

    var pokemon = new PokemonApp.Pokemon(pokemonUri);
    pokemon.render();
  });
});