import { createContext } from "react";

const LibraryContext = createContext({
  gapi: null,
  google: null,
});

export default LibraryContext;
