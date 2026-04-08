import React, { useContext } from "react";

import { UserContxt } from "../App";

const InfoCard = () => {
  const userObj = useContext(UserContxt);
  return (
    <div>
      <div>Name:{userObj.name}</div>
      <div>Description:{userObj.description}</div>
      <div className="py-[20px]">
        <span
          className={`${userObj.status ? "bg-[#06abe7]" : "bg-[#e90707]"} text-[#fff] p-[5px_10px] rounded-lg`}
        >
          {userObj.status ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
};

export default InfoCard;
