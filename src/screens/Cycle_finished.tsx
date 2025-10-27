import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Stepper } from '@/App';
import confetti from "canvas-confetti";
import closedDrumImg from '@/assets/closed drum-small.webp';

function Cycle_finished({title}:{title:string}) {
    const { next } = Stepper.useStepper();
    confetti()
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <img
                src={closedDrumImg}
                alt="Map"
                height={300}
                width={300}
                className="w-full h-auto max-h-[70vh] object-contain block"
              />
              <p>Congratulations</p>
            </CardContent>
            <CardFooter>
                <Button onClick={next}>Next</Button>
            </CardFooter>
        </Card>
    )
}

export default Cycle_finished