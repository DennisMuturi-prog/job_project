import { Toaster } from "sonner";
import SortinClothes from "./screens/sorting_clothes";

export default function App() {
  return (
    <div className="p-4">
      <SortinClothes/>
      <Toaster/>
    </div>
  );
}