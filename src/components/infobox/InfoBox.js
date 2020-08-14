import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import numeral from "numeral";

import "./InfoBox.css";

const InfoBox = ({ title, numCases, active, isRed, total, ...props }) => {
  const prettyPrintStat = (stat) =>
    stat ? `+${numeral(stat).format("0.0a")}` : "+0";

  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
      <CardContent>
        <Typography className="infoBox__title" color={"textSecondary"}>
          {title}
        </Typography>

        <h2 className={`infoBox__cases ${!isRed && "infoBox--cases--green"}`}>
          {prettyPrintStat(numCases)}
        </h2>

        <Typography className="infoBox__total" color={"textSecondary"}>
          Total: {total}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
