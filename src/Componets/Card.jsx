import React, { useContext } from "react";
import { CntContext } from "../App";

const Card = () => {
  const cnt = useContext(CntContext);
  return <div>cnt: {cnt}</div>;
};

export default Card;
