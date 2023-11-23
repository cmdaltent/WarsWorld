import { NationEnum, SideEnum } from "frontend/utils/enums";
import Image from "next/image";
import React from "react";
import type { Army } from "shared/schemas/army";
import type { CO } from "shared/schemas/co";

type Props = {
  name: string | undefined;
  rank: string | undefined;
  armyIndex: number;
  iconSide: SideEnum;
  co?: CO | null;
  multi?: boolean;
};

export default function PlayerNameBar({ name = "Player", rank = "Unknown", armyIndex, iconSide, co = null, multi = false }: Props) {
  const isLeftIcon = iconSide === SideEnum.Left;
  // const borderStyle = isLeftIcon ? "@border-r-2" : "@border-l-2";
  const armyString = NationEnum[armyIndex] as Army;
  const nameDiv = (
    <div className="@flex @h-full @px-1 @min-w-[35px] @justify-center @items-center">
      <p className="@truncate @p-0">{name}</p>
    </div>
  );
  const rankDiv = (
    <div className="@flex @flex-col @flex-shrink-0 @h-full @font-light @px-1 @min-w-[32px] tablet:@min-w-[50px] @justify-center @items-center">
      <p className="@p-0">{rank}</p>
    </div>
  );
  const iconDiv = (
    <div className={`@flex @flex-col @w-[32px] @h-[32px]`}>
      <Image className={`@h-8 @mx-auto [image-rendering:pixelated]`} src={`/img/nations/${armyString}.gif`} alt={armyString} />
    </div>
  );
  const coDiv = co ? (
    <div className={`@relative @flex @flex-col @w-[32px] @h-[32px]`}>
      <div className={`@absolute @inset-0 @bg-black @opacity-50`}></div>
      <Image className={`@h-full @relative @z-10 ${!isLeftIcon && "@transform @scale-x-[-1]"}`} src={`/img/CO/pixelated/${co}-small.png`} alt={co} />
    </div>
  ) : null;

  const contentDivs = isLeftIcon ? [nameDiv, rankDiv] : [rankDiv, nameDiv];

  return (
    <div className={`@flex @flex-col @w-full ${multi ? "smallscreen:@w-[80%]" : "smallscreen:@w-[40%]"}`}>
      <div className={`@flex @items-center @justify-between @bg-${armyString}`}>
        {isLeftIcon && (
          <div className="@flex">
            {coDiv}
            {iconDiv}
          </div>
        )}
        {...contentDivs}
        {!isLeftIcon && (
          <div className="@flex">
            {iconDiv}
            {coDiv}
          </div>
        )}
      </div>
    </div>
  );
}
