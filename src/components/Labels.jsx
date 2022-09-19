import { useContext } from "react";
import GlobalContext from "../context/GlobalContext";

// const getTextColor = (label) => {
//   const color = label.substring(3, label.length - 4);
//   const result = `text-${color}-400`;
//   console.log(result);

//   return result;
// };

// const getColorText = (label) => label.substring(3, label.length - 4);

const Labels = () => {
  const { labels, updateLabel } = useContext(GlobalContext);

  return (
    <>
      <p className="text-gray-500 font-bold mt-10">Label</p>
      {labels.map(({ label, checked }, index) => (
        <label className="items-center mt-3 block" key={index}>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => updateLabel({ label, checked: !checked })}
            className={`form-checkbox h-5 w-5 text-${label}-400 rounded focus:ring-0 cursor-pointer`}
          />
          <span className="ml-2 text-gray-700 capitalize">{label}</span>
        </label>
      ))}
    </>
  );
};

export default Labels;
