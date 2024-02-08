import { CO, type COID, coSchema } from "../../../shared/schemas/co";
import COMenu from "./COMenu";
import { useState } from "react";


type Props = {
    CO: CO,
}


export default function COSelect({ CO }: Props) {

  const [showDropdown, setShowDropdown] = useState(false);
  const [currentCO, setCurrentCO] = useState(CO);


    return (
      <div className="@w-20" onClick={() => {
        console.log("click");
        setShowDropdown(!showDropdown)
      }}>
          <img className="@h-full @w-full [image-rendering:pixelated]" src={`/img/CO/pixelated/${currentCO}-small.png`}
               alt="image of the current CO" />
     <COMenu setCO={setCurrentCO} show={showDropdown} setShow={setShowDropdown}/>



      </div>

    )
}