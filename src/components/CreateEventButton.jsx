import { useContext } from "react";
import plusImg from "../assets/plus.svg";
import GlobalContext from "../context/GlobalContext";
const CreateEventButton = () => {
  const { setShowEventModal } = useContext(GlobalContext);
  return (
    <button
      onClick={() => setShowEventModal(true)}
      className="p-2 ml-4 border rounded-full flex justify-center items-center shadow-md hover:shadow-lg"
    >
      <img src={plusImg} alt="create event" className="w-7 h-7" />
      <span className="pl-3 pr-7">New event</span>
    </button>
  );
};

export default CreateEventButton;
