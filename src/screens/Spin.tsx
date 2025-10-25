import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Wheel, type Prize } from "@/components/Wheel"
const prizes:Prize[]=[
    {label:'cap',
        img_src:`${import.meta.env.BASE_URL}/green_cap-small.webp`
    },
    {label:'better luck',
        img_src:`${import.meta.env.BASE_URL}/better_luck-small.webp`
    },
    {label:'detergent and downy',
        img_src:`${import.meta.env.BASE_URL}/Ariel Original-small.webp`
    },
    {label:'better luck',
        img_src:`${import.meta.env.BASE_URL}/better_luck-small.webp`
    },
    {label:'bottle top',
        img_src:`${import.meta.env.BASE_URL}/green_bottle-small.webp`
    },
    {label:'better luck',
        img_src:`${import.meta.env.BASE_URL}/better_luck-small.webp`
    },
    {label:'tshirt',
        img_src:`${import.meta.env.BASE_URL}/green_tshirt.webp`
    },
    {label:'better luck',
        img_src:`${import.meta.env.BASE_URL}/better_luck-small.webp`
    },

]

function Spin({ title }: { title: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Wheel prizes={prizes}/>
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
    )
}

export default Spin