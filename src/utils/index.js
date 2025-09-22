import * as apiMock from "./api.mock";
import * as apiReal from "./api";

const useMock = true;

const apiModule = useMock ? apiMock : apiReal;

export const {
  signup,
  signin,
  getCurrentUser,
  saveRecipe,
  deleteRecipe,
  fetchData,
} = apiModule;
