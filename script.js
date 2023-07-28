const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");
let favListArray = [];
const favbtn = document.querySelector("#fav-btn");
let favDivContainer = document.getElementById("favDivContainer");

favbtn.addEventListener("click", () => {
  if (favDivContainer.style.display == "grid") {
    favDivContainer.style.display = "none";
    recipeContainer.style.display = "grid";
  } else {
    favDivContainer.style.display = "grid";
    recipeContainer.style.display = "none";
    openfavpopup();
  }
});

//Function to get recipes
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching recipes...</h2>";
  try {
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const response = await data.json();
    // console.log("image cleared");
    recipeContainer.innerHTML = "";
    //  console.log(response);
    response.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
      recipeDiv.innerHTML = `
    <img src="${meal.strMealThumb}">
    <h3>${meal.strMeal}</h3>
    <p><span>${meal.strArea}</span>Dish</p>
   
    <p>Belongs to <span>${meal.strCategory}</span>Category</p>
`;
      const button = document.createElement("button");
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);
      // Adding EventListener to recipe button
      button.addEventListener("click", () => {
        openRecipePopup(meal);
      });
      recipeContainer.appendChild(recipeDiv);

      const likebutton = document.createElement("button");
      likebutton.innerHTML = '<i class="fa-solid fa-heart"></i>';
      recipeDiv.appendChild(likebutton);
      likebutton.style.backgroundColor = "grey";
      likebutton.addEventListener("click", () => {
        if (likebutton.style.backgroundColor == "grey") {
          likebutton.style.backgroundColor = "red";
        } else {
          likebutton.style.backgroundColor = "grey";
        }

        favlist(meal.idMeal);
      });

      // console.log(meal);
    });
  } catch (err) {
    //   console.log(response.meals[0]);

    console.log(err);
    recipeContainer.innerHTML = "<h2>Error in fatching recipes...</h2>";
  }
};

// Function to Fetch Indredents and measurements:

const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
  <h2 class="recipeName">${meal.strMeal}</h2>
  <h3>Ingredents:</h3>
  <ul class="ingredientsList">${fetchIngredients(meal)}</ul>
  <div class="recipeInstructions">
    <h3>Instructions:</h3>
    <p ">${meal.strInstructions}</p>
  </div>
  `;

  recipeDetailsContent.parentElement.style.display = "block";
};

// function for close button
recipeCloseBtn.addEventListener("click", () => {
  recipeDetailsContent.parentElement.style.display = "none";
});

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (searchInput != "") fetchRecipes(searchInput);
  else {
    recipeContainer.innerHTML = "<h2>Please enter recipe in search Box...</h2>";
    return;
  }
  // console.log("button-clicked");
});

// // Adding Id to favlistArray

function arrayRemove(arr, value) {
  return arr.filter(function (geeks) {
    return geeks != value;
  });
}

function favlist(id) {
  if (favListArray.includes(id)) {
    favListArray = arrayRemove(favListArray, id);
  } else {
    favListArray.push(id);
  }
  console.log(favListArray);
}

// Fetching meals via Id's
const fetchmeals = async (id) => {
  const data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const response = await data.json();
  // console.log("fav meal=", response.meals[0]["idMeal"]);
  console.log("this is response meals", response);
  openfavpopuphelper(response.meals[0]);
};

//  Pop up for Favourites
function openfavpopup() {
  favDivContainer.innerHTML = "";
  favListArray.forEach((id) => {
    const meal = fetchmeals(id);
  });
}

function openfavpopuphelper(meal) {
  // console.log(meal);

  const favDiv = document.createElement("div");
  favDiv.classList.add("favdiv");
  favDiv.setAttribute("id", favDiv);
  favDiv.innerHTML = `
    <img src="${meal.strMealThumb}">
    <h4>${meal.strMeal}</h4>
    <p><span>${meal.strArea}</span>Dish</p>
    <p>Belongs to <span>${meal.strCategory}</span>Category</p>
    `;
  favDivContainer.append(favDiv);
}
