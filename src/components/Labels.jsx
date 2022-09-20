import { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import { getColor } from "../util";

const Labels = () => {
  const { labels, updateLabel } = useContext(GlobalContext);

  return (
    <>
      <p className="text-gray-500 mt-8 font-bold">Label</p>
      {labels.map(({ colorId, checked }, index) => (
        <label className="items-center mt-3 block" key={index}>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => updateLabel({ colorId, checked: !checked })}
            className={`form-checkbox h-5 w-5 text-${getColor(
              colorId
            )} rounded focus:ring-0 cursor-pointer`}
          />
          <span className="ml-2 text-gray-700 capitalize">
            {getColor(colorId)}
          </span>
        </label>
      ))}
    </>
  );
};

export default Labels;
