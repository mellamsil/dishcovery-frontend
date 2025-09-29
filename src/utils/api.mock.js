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

// --- Helper to simulate fetch API ---
const mockFetch = (data, delay = 500) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        json: () => Promise.resolve(data),
      });
    }, delay);
  });

// Auth
export const signin = () =>
  mockFetch({ token: "fake-signin-token" }).then((res) =>
    res.ok ? res.json() : Promise.reject("Signin failed")
  );

export const signup = () =>
  mockFetch({ token: "fake-signup-token" }).then((res) =>
    res.ok ? res.json() : Promise.reject("Signup failed")
  );

export const getCurrentUser = (token) =>
  mockFetch(
    token
      ? { _id: "fake-user-id", name: "Fake User", email: "fake@example.com" }
      : null
  ).then((res) => (res.ok ? res.json() : Promise.reject("No token")));

// --- Recipe functions ---
export const fetchData = (endpoint) => {
  const data =
    endpoint === "cookbook"
      ? { success: true, data: fakeRecipes }
      : { data: [] };
  return mockFetch(data).then((res) =>
    res.ok ? res.json() : Promise.reject(`Failed to fetch ${endpoint}`)
  );
};

export const saveRecipe = (recipe) => {
  if (recipe._id) {
    fakeRecipes = fakeRecipes.map((r) => (r._id === recipe._id ? recipe : r));
  } else {
    recipe._id = Date.now().toString();
    fakeRecipes.push(recipe);
  }
  return mockFetch({ success: true, saved: recipe }).then((res) =>
    res.ok ? res.json() : Promise.reject("Failed to save recipe")
  );
};

export const deleteRecipe = (id) => {
  fakeRecipes = fakeRecipes.filter((r) => r._id !== id);
  return mockFetch({ success: true, deletedId: id }).then((res) =>
    res.ok ? res.json() : Promise.reject("Failed to delete recipe")
  );
};
