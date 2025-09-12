import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";

export const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/contact", component: Contact },
  { path: "*", component: NotFound },
];
