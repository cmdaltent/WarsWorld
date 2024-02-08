
import { CO, type COID, coSchema } from "../../../shared/schemas/co";
import { useState } from "react";

//todo: be able to insert ban list and other features
// since it would be nice if we re-use this CO menu across the board
type Props = {
  setCO: any
  show: boolean
  setShow: any
}

export default function COMenu({  setCO, show, setShow }: Props) {


    return (
      (show ? <div
        className="@overflow-visible @grid @grid-cols-4 @absolute  @z-10  @bg-bg-secondary @outline-black @outline-2 @gap-1">
        {coSchema._def.values.map((co) => {
          return (<div
            onClick={() => {
              setCO(co)
              setShow(false);

            }}
            key={co}
            className={`@flex @items-center @p-1 @bg-bg-primary hover:@bg-primary 
                    @cursor-pointer @duration-300`}
          >
            <img
              src={`/img/CO/pixelated/${co}-small.png`}
              className="[image-rendering:pixelated]"
              alt=""
            />
          </div>);
        })}
      </div> : <></>)
    )


}
