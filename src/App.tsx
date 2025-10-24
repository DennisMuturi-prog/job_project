import * as React from "react";
import { defineStepper } from "@stepperize/react";
import UserInfo from "./screens/user_info";
import SortinClothes from "./screens/sorting_clothes";

const Stepper = defineStepper(
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
    </React.Fragment>
  );
};

const StepNavigation = () => {
  const { isLast, reset, next, when } = Stepper.useStepper();
  return (
    <button onClick={isLast ? reset : next}>
      {when(
        "winning",
        () => "Reset",
        () => "Next"
      )}
    </button>
  );
};

export default App;