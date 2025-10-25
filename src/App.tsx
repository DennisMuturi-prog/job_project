import * as React from "react";
import { defineStepper } from "@stepperize/react";
import UserInfo from "./screens/user_info";
import SortinClothes from "./screens/sorting_clothes";
import LoadAndSetupWasher from "./screens/load_and_setup_washer";
import { Toaster } from "sonner";
import Washing from "./screens/Washing";
import Rinsing from "./screens/Rinsing";
import Cycle_finsihed from "./screens/Cycle_finsihed";

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
    <StepNavigation />
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
        <SortinClothes title={step.title}/>
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
        <Cycle_finsihed title={step.title}/>
      ))}
      <Toaster/>
    </React.Fragment>
  );
};

const StepNavigation = () => {
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