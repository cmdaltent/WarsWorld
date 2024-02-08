import COCalculator from "./COCalculator";
import type { PlayerInMatch } from "shared/types/server-match-state";


type Props = {
    playerAttack: PlayerInMatch
    playerDefend: PlayerInMatch
}

export default function Calculator({playerAttack,playerDefend}:Props) {
    console.log(playerAttack);
    return (<>

        <p>Calculator</p>

        <div className="@m-auto @grid @grid-cols-12 @gap-2 @bg-bg-primary laptop:@w-1/2">

            <div className="@col-span-12 @flex @flex-initial @bg-bg-tertiary @align-middle @justify-between @p-2">
                <p>Attacker</p>
                <button className="btn ">Swap</button>
                <p>Defender</p>
            </div>


            <COCalculator gold={playerAttack.funds} co={playerAttack.coId.name} capture={10} commtower={1} coPower={"no-power"}/>

            <COCalculator gold={playerDefend.funds} co={playerDefend.coId.name} capture={10} commtower={1} coPower={"no-power"}/>


            <div className="@col-span-6 @flex-row  @flex-initial @bg-bg-secondary">
                <div className="@flex">
                    UNIT ATTACKER #1
                </div>

                <div className="@flex">
                    UNIT ATTACKER #2
                </div>
            </div>


            <div className="@col-span-6 @flex  @flex-initial @bg-bg-secondary">
                <div className="@flex">
                    CounterAttack
                </div>
                <div className="@flex">
                    UNIT Defender
                </div>
            </div>


            <div className="@col-span-6 @flex @flex-initial @bg-bg-tertiary">
                TOTAL UNIT
            </div>

            <div className="@col-span-6 @flex @flex-initial @bg-bg-tertiary">
                KO Chance
            </div>


            <div className="@col-span-6 @flex @flex-initial @bg-bg-secondary">
                TOTAL Gold/Bar made #1
            </div>

            <div className="@col-span-6 @flex @flex-initial @bg-bg-secondary">
                TOTAL Gold/Bar made #2
            </div>


        </div>
    </>)
}