import curryChickenImg from "../assets/images/curry-chicken.jpg";
import redFishImg from "../assets/images/redfish.jpg";
import cakeImg from "../assets/images/chocolate-cake.jpg";
import lobsterImg from "../assets/images/lobster.jpg";
import shrimpImg from "../assets/images/scampi-shrimp.jpg";
import steakImg from "../assets/images/steak.jpg";
import spaghettiImg from "../assets/images/spaghetti.jpg";
import grilledMeatImg from "../assets/images/grilled-meat.jpg";
import saladImg from "../assets/images/caesar-salad.jpg";
import burritoImg from "../assets/images/burrito.jpg";

// Auth
export const signin = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ token: "fake-signin-token" }), 500);
  });
};

export const signup = () => {
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
    title: "Curry Chicken",
    image: curryChickenImg,
    ingredients: [
      "Chicken",
      "Curry Powder",
      "Onions",
      "Garlic",
      "Ginger",
      "Thyme",
      "Scotch Bonnet Pepper",
      "Potatoes",
      "Coconut Milk",
    ],
    instructions:
      "Season and marinate chicken with curry spices, then sauté aromatics, add chicken, potatoes, and water (or coconut milk), and simmer until tender and flavorful.",
  },

  {
    _id: "2",
    title: "Red Fish",
    image: redFishImg,
    ingredients: ["Fishlime, garlic, onion, thyme, peppers, and spices"],
    instructions:
      "Red fish is made with whole red snapper seasoned with lime, garlic, onion, thyme, peppers, and spices, then cooked with tomatoes or coconut-based sauce.",
  },

  {
    _id: "3",
    title: "Chocolate Cake",
    image: cakeImg,
    ingredients: [
      "Flour, sugar, cocoa powder, eggs, butter or oil, baking powder or soda, milk, vanilla.",
    ],
    instructions:
      "Mix dry and wet ingredients separately, combine into a smooth batter, pour into a greased pan, and bake until set and fluffy",
  },

  {
    _id: "4",
    title: "Lobster",
    image: lobsterImg,
    ingredients: [
      "fresh lobster, butter, garlic, lemon, parsley, salt, and black pepper.",
    ],
    instructions:
      "Boil or steam the lobster until cooked, then split and serve with melted butter, garlic, lemon juice, and a sprinkle of parsley.",
  },

  {
    _id: "5",
    title: "Scampi Schrimp",
    image: shrimpImg,
    ingredients: [
      "Shrimp, garlic, butter, olive oil, lemon juice, white wine (optional), parsley, salt, and black pepper.",
    ],
    instructions:
      "Sauté garlic in butter and olive oil, add shrimp and cook until pink, then finish with lemon juice, white wine (if using), and parsley..",
  },

  {
    _id: "6",
    title: "Steak",
    image: steakImg,
    ingredients: [
      "beef steak, salt, black pepper, and optionally garlic, herbs, and oil",
    ],
    instructions:
      "Season the steak with salt and pepper, sear in a hot pan or grill with oil or butter until desired doneness, then rest before serving.",
  },

  {
    _id: "7",
    title: "Spaghetti",
    image: spaghettiImg,
    ingredients: [
      "spaghetti pasta, tomatoes or tomato sauce, garlic, onions, olive oil, salt, black pepper",
    ],
    instructions:
      "Cook spaghetti pasta until al dente, sauté garlic and onions in olive oil, add tomatoes or sauce and seasonings, simmer, then toss with the drained pasta",
  },

  {
    _id: "8",
    title: "Grilled Meat",
    image: grilledMeatImg,
    ingredients: [
      "Beef, salt, black pepper, oil, spices such as garlic, paprika, herbs, or barbecue sauce.",
    ],
    instructions:
      "Season or marinate the meat, preheat the grill, cook over medium-high heat until desired doneness, turning as needed, and let rest before serving.",
  },

  {
    _id: "9",
    title: "Caesar Salad",
    description:
      "A classic salad featuring crisp romaine lettuce, crunchy croutons, and shaved Parmesan cheese",
    image: saladImg,
  },

  {
    _id: "9",
    title: "Burrito",
    description:
      " A warm flour tortilla loaded with savory ground beef, seasoned rice, hearty beans, and melted cheese, all rolled into a satisfying handheld meal.",
    image: burritoImg,
  },
];

// {
//   _id: "1",
//   title: "Classic Hamburger",
//   image: hamburgerImg,
//   ingredients: ["Bun", "Beef Patty", "Cheese", "Lettuce", "Tomato"],
//   instructions: "Grill patty, assemble burger with toppings, serve.",
// },
// {
//   _id: "2",
//   title: "Italian Meatballs",
//   image: meatballsImg,
//   ingredients: ["Ground Beef", "Breadcrumbs", "Eggs", "Tomato Sauce"],
//   instructions: "Mix beef with seasoning, roll into balls, simmer in sauce.",
// },
// {
//   _id: "3",
//   title: "Pesto Pasta",
//   image: pestoPastaImg,
//   ingredients: ["Pasta", "Basil Pesto", "Parmesan", "Olive Oil"],
//   instructions: "Boil pasta, toss with pesto, garnish with parmesan.",
// },
// {
//   _id: "4",
//   title: "Desserts Platter",
//   image: dessertsImg,
//   ingredients: ["Cakes", "Cookies", "Fruits", "Cream"],
//   instructions: "Arrange desserts nicely on a serving platter.",
// },
// {
//   _id: "5",
//   title: "Sushi Rolls",
//   image: sushiRollsImg,
//   ingredients: ["Rice", "Nori", "Fish", "Vegetables"],
//   instructions: "Roll rice and fillings in nori, slice into pieces.",
// },
// {
//   _id: "6",
//   title: "Grilled Steak",
//   image: steakImg,
//   ingredients: ["Steak", "Salt", "Pepper", "Garlic Butter"],
//   instructions: "Season steak, grill to preferred doneness, serve hot.",
// },

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
