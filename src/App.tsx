import * as React from "react";
import { defineStepper } from "@stepperize/react";
import UserInfo from "./screens/user_info";
import loadable from '@loadable/component'
import { Toaster } from "sonner";
// import SortingClothes from "./screens/sorting_clothes";
// import LoadAndSetupWasher from "./screens/load_and_setup_washer";
// import Washing from "./screens/Washing";
// import Rinsing from "./screens/Rinsing";
// import Cycle_finished from "./screens/Cycle_finished";
// import Spin from "./screens/Spin";

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

const App = () => (
  <Stepper.Scoped>
    <StepContent />
    {/* <StepNavigation /> */}
  </Stepper.Scoped>
);

const StepContent = () => {
  const { when } = Stepper.useStepper();
  return (
    <React.Fragment>
      {when("registration", () => (
        <UserInfo/>
      ))}
      {when("sorting", (step) => (
        <SortingClothes title={step.title}/>
      ))}
      {when("load_and_setup", (step) => (
        <LoadAndSetupWasher title={step.title}/>
      ))}
      {when("washing", (step) => (
        <Washing title={step.title}/>
      ))}
      {when("rinsing", (step) => (
        <Rinsing title={step.title}/>
      ))}
      {when("cycle_finished", (step) => (
        <Cycle_finished title={step.title}/>
      ))}
      {when("spinning", (step) => (
        <Spin title={step.title}/>
      ))}
      <Toaster/>
    </React.Fragment>
  );
};

export const StepNavigation = () => {
  const { isLast,isFirst, reset, next,prev, when } = Stepper.useStepper();
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

export default App;