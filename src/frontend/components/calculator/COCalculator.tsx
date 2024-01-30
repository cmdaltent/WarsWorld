import { CO } from "../../../shared/schemas/co";
import IconText from "./IconText";
import COSelect from "./COSelect";
import { useEffect, useState } from "react";

type Props = {
  co: CO
  commtower: number
  gold: number
  capture: number
  coPower:  "superCOPower" | "COPower";
}

export default function COCalculator({ co,coPower,capture,commtower,gold }: Props) {
  

  return (<>
    <div className="@col-span-6 @flex @bg-bg-tertiary @justify-between @align-middle @items-center ">
      <div className="@flex">

        <COSelect CO={co}/>

        <IconText icon={"redstar"} style={coPower === "COPower" ? "" : "@brightness-50 @saturate-50"} />
        <IconText icon={"bluestar"} style={coPower === "superCOPower" ? "" : "@brightness-50 @saturate-50"}/>
      </div>

      <IconText icon={"commtower"} text={commtower}/>
      <IconText icon={"coin"} text={gold}/>
      <IconText icon={"capture"} text={capture}/>



    </div>
  </>);
}