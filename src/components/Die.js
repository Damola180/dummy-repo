import React from "react";
import { nanoid } from "nanoid";

export default function Die(props) {
  const backgroundColor = props.isHeld ? "whitesmoke" : "black";
  const dots = Array.from({ length: props.value }, () => {
    const uniqueId = nanoid();
    return <div key={uniqueId} className="dot" />;
  });
  return (
    <div
      style={{ backgroundColor: backgroundColor }}
      className="die-face"
      onClick={props.holdDice}
    >
      <div
        style={{ backgroundColor: backgroundColor }}
        onClick={props.onClick}
        className="dot-container"
      >
        {dots}
      </div>
    </div>
  );
}
