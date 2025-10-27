import { defineStepper } from "@stepperize/react";
import UserInfo from "./screens/user_info";
import loadable from '@loadable/component'
import { Toaster } from "sonner";
import { Activity, useEffect, useState } from "react";
import { Button } from "./components/ui/button";


const SortingClothes = loadable(() => import('./screens/sorting_clothes'))

const LoadAndSetupWasher = loadable(() => import('./screens/load_and_setup_washer'))
const Washing = loadable(() => import('./screens/Washing'))
const Rinsing = loadable(() => import('./screens/Rinsing'))
const Cycle_finished = loadable(() => import('./screens/Cycle_finished'))
const Spin = loadable(() => import('./screens/Spin'))

export const Stepper = defineStepper(
  { id: "registration", title: "First" },
  { id: "sorting", title: "SORT LAUNDRY" },
  { id: "load_and_setup", title: "LOAD AND SETUP WASHER" },
  { id: "washing", title: "WASH WITH ARIEL" },
  { id: "rinsing", title: "RINSE" },
  { id: "cycle_finished", title: "CYCLE FINISHED" },
  { id: "spinning", title: "SPIN TO WIN" },
  { id: "winning", title: "YOU WON" }
);




 

const App = () => {
  useEffect(() => {
    SortingClothes.preload();
    LoadAndSetupWasher.preload()
    Washing.preload()
    Rinsing.preload()
    Cycle_finished.preload()
    Spin.preload()
  }, []);
return (
  <Stepper.Scoped>
    <StepContent />
    {/* <StepNavigation /> */}
  </Stepper.Scoped>

)
};


const StepContent = () => {
  const { switch :switchStep} = Stepper.useStepper();
  return (
    <>
      {switchStep({
        registration: () => <UserInfo />,
        sorting: (step) => <SortingClothes title={step.title} />,
        load_and_setup: (step) => <LoadAndSetupWasher title={step.title} />,
        washing: (step) => <Washing title={step.title} />,
        rinsing: (step) => <Rinsing title={step.title} />,
        cycle_finished: (step) => <Cycle_finished title={step.title} />,
        spinning: (step) => <Spin title={step.title} />,
        winning: (step) => <p>You won! {step.title}</p>,
      })}
      <Toaster />
    </>
  );
};
export const StepNavigation = () => {
  const { isLast, isFirst, reset, next, prev, when } = Stepper.useStepper();
  return (
    <>
      {isFirst || <button onClick={prev}>
        prev
      </button>}

      <button onClick={isLast ? reset : next}>
        {when(
          "winning",
          () => "Reset",
          () => "Next"
        )}
      </button>
    </>
  );
};


export function App2() {
  const [screens] = useState([{ id: "registration", title: "First" },
  { id: "sorting", title: "SORT LAUNDRY" },
  { id: "load_and_setup", title: "LOAD AND SETUP WASHER" },
  { id: "washing", title: "WASH WITH ARIEL" },
  { id: "rinsing", title: "RINSE" },
  { id: "cycle_finished", title: "CYCLE FINISHED" },
  { id: "spinning", title: "SPIN TO WIN" },
  { id: "winning", title: "YOU WON" }]);

  const [currentPosition, setCurrentPosition] = useState(0);

  const currentScreen = screens[currentPosition].title;

  const changeScreenForward = () => {
    setCurrentPosition((prev) => prev + 1)
  }
  const changeScreenBackward = () => {
    setCurrentPosition((prev) => prev - 1)
  }
  return (
    <>
      <Activity mode={currentScreen === "First" ? "visible" : "hidden"}>
        <UserInfo />
      </Activity>
      <Activity mode={currentScreen === "SORT LAUNDRY" ? "visible" : "hidden"}>
        <SortingClothes title={screens[1].title} />
      </Activity>
      <Activity mode={currentScreen === "LOAD AND SETUP WASHER" ? "visible" : "hidden"}>
        <LoadAndSetupWasher title={screens[2].title} />
      </Activity>
      <Activity mode={currentScreen === "WASH WITH ARIEL" ? "visible" : "hidden"}>
        < Washing title={screens[3].title} />
      </Activity>
      <Activity mode={currentScreen === "RINSE" ? "visible" : "hidden"}>
        <Rinsing title={screens[4].title} />
      </Activity>
      <Activity mode={currentScreen === "CYCLE FINISHED" ? "visible" : "hidden"}>
        <Cycle_finished title={screens[5].title} />
      </Activity>
      <Activity mode={currentScreen === "SPIN TO WIN" ? "visible" : "hidden"}>
        <Spin title={screens[6].title} />
      </Activity>

      {currentPosition > 0 && <Button onClick={changeScreenBackward}>Prev</Button>}
      <Button onClick={changeScreenForward}>Next</Button>

    </>
  )
}
export default App;