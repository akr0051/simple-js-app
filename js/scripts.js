let pokemonRepository = (function (){
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  let modalContainer = document.querySelector("#modal-container");
  let imageContainer = document.querySelector("#image-container");

  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("pokemon is not correct");
    }
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon){
    let pokemonList = document.querySelector(".pokemon-list");
    let listpokemon = document.createElement("li");
    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("button-class");
    listpokemon.appendChild(button);
    pokemonList.appendChild(listpokemon);
    button.addEventListener("click", function(event){
      showDetails(pokemon);
    });
  }

  function loadList() {
      return fetch(apiUrl).then(function (response) {
        return response.json();
      }).then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
          console.log (pokemon);
        });
      }).catch(function (e) {
        console.error(e);
      })
    }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.weight = details.weight;
    }).catch(function (e) {
      console.error(e);
    });
  }

  return {
    add,
    getAll,
    addListItem,
    loadList,
    loadDetails,
    showDetails
  };

  function showModal(title, text) {
     // Clear all existing modal content
     modalContainer.innerHTML = "";

     let modal = document.createElement("div");
     modal.classList.add("modal");

     // Add the new modal content
     let closeButtonElement = document.createElement("button");
     closeButtonElement.classList.add("modal-close");
     closeButtonElement.innerText = "Close";
     closeButtonElement.addEventListener("click", hideModal);

     let titleElement = document.createElement("h1");
     titleElement.innerText = title;

     let contentElement = document.createElement("p");
     contentElement.innerText = text;

     let imageElement = document.createElement("img");
     imageElement.src = "https://pokeapi.co/api/v2/pokemon/?limit=150";

     modal.appendChild(closeButtonElement);
     modal.appendChild(titleElement);
     modal.appendChild(contentElement);
     modalContainer.appendChild(modal);
     imageContainer.appendChild(imageElement);

     modalContainer.classList.add("is-visible");
   }

   function hideModal() {
     modalContainer.classList.remove("is-visible");
   }

   document.querySelector("#show-modal").addEventListener("click", () => {
     showModal(item.name, "Height: " + item.height + "<br>" + "Weight: " + item.weight + item.imageUrl);
   });

   window.addEventListener("keydown", (e) => {
     if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
       hideModal();
     }
   });

   modalContainer.addEventListener("click", (e) => {
     let target = e.target;
     if (target === modalContainer) {
       hideModal();
     }
   });

   function showDetails(item) {
     pokemonRepository.loadDetails(item).then(function () {
       showModal(item.name, "Height: " + item.height + "<br>" + "Weight: " + item.weight + item.imageUrl);
     });
   }

})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
