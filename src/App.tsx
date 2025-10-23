import { Toaster } from "sonner";
import SortinClothes from "./screens/sorting_clothes";
import LoadAndSetupWasher from "./screens/load_and_setup_washer";
import EmptyWashingMachine from "./components/empty_washing_machine";

export default function App() {
  return (
    <div className="p-4">
      <SortinClothes/>
      <LoadAndSetupWasher/>
      <EmptyWashingMachine/>
      <Toaster/>
    </div>
  );
}