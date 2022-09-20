import useScript from "../useScript";
import LibraryContext from "./LibraryContext";

const LibraryWrapper = ({ children }) => {
  const [apiLoading, apiError] = useScript("https://apis.google.com/js/api.js");
  const [gsiLoading, gsiError] = useScript(
    "https://accounts.google.com/gsi/client"
  );

  if (apiLoading || gsiLoading) return <p>loading</p>;
  if (apiError || gsiError) return <p>error</p>;

  const { gapi, google } = window;

  return (
    <LibraryContext.Provider value={{ gapi, google }}>
      {children}
    </LibraryContext.Provider>
  );
};

export default LibraryWrapper;
