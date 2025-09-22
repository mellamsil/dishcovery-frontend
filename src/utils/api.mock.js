import dessertsImg from "../assets/images/desserts.jpg";
import hamburgerImg from "../assets/images/hamburger.jpg";
import meatballsImg from "../assets/images/meatballs.jpg";
import pestoPastaImg from "../assets/images/pesto-pasta.jpg";
import sushiRollsImg from "../assets/images/shushi-rolls.jpg";
import steakImg from "../assets/images/steak.jpg";

// --- Auth ---
export const signin = (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ token: "fake-signin-token" }), 500);
  });
};

export const signup = (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ token: "fake-signup-token" }), 500);
  });
};

export const getCurrentUser = (token) => {
  return new Promise((resolve) => {
    if (!token) return resolve(null);
    resolve({
      _id: "fake-user-id",
      name: "Fake User",
      email: "fake@example.com",
    });
  });
};

// --- Fake recipes ---
let fakeRecipes = [
  {
    _id: "1",
    title: "Classic Hamburger",
    image: hamburgerImg,
    ingredients: ["Bun", "Beef Patty", "Cheese", "Lettuce", "Tomato"],
    instructions: "Grill patty, assemble burger with toppings, serve.",
  },
  {
    _id: "2",
    title: "Italian Meatballs",
    image: meatballsImg,
    ingredients: ["Ground Beef", "Breadcrumbs", "Eggs", "Tomato Sauce"],
    instructions: "Mix beef with seasoning, roll into balls, simmer in sauce.",
  },
  {
    _id: "3",
    title: "Pesto Pasta",
    image: pestoPastaImg,
    ingredients: ["Pasta", "Basil Pesto", "Parmesan", "Olive Oil"],
    instructions: "Boil pasta, toss with pesto, garnish with parmesan.",
  },
  {
    _id: "4",
    title: "Desserts Platter",
    image: dessertsImg,
    ingredients: ["Cakes", "Cookies", "Fruits", "Cream"],
    instructions: "Arrange desserts nicely on a serving platter.",
  },
  {
    _id: "5",
    title: "Sushi Rolls",
    image: sushiRollsImg,
    ingredients: ["Rice", "Nori", "Fish", "Vegetables"],
    instructions: "Roll rice and fillings in nori, slice into pieces.",
  },
  {
    _id: "6",
    title: "Grilled Steak",
    image: steakImg,
    ingredients: ["Steak", "Salt", "Pepper", "Garlic Butter"],
    instructions: "Season steak, grill to preferred doneness, serve hot.",
  },
];

// --- Recipe functions ---
export const saveRecipe = (recipe) => {
  return new Promise((resolve) => {
    if (recipe._id) {
      fakeRecipes = fakeRecipes.map((r) => (r._id === recipe._id ? recipe : r));
    } else {
      recipe._id = Date.now().toString();
      fakeRecipes.push(recipe);
    }
    resolve({ success: true, saved: recipe });
  });
};

export const deleteRecipe = (id) => {
  return new Promise((resolve) => {
    fakeRecipes = fakeRecipes.filter((r) => r._id !== id);
    resolve({ success: true, deletedId: id });
  });
};

export const fetchData = (endpoint) => {
  return new Promise((resolve) => {
    if (endpoint === "cookbook") resolve({ success: true, data: fakeRecipes });
    else resolve({ data: [] });
  });
};
