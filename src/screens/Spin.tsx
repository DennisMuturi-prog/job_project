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
        img_src:'green_cap-small.webp'
    },
    {label:'better luck',
        img_src:'better_luck-small.webp'
    },
    {label:'detergent and downy',
        img_src:'Ariel original-small.webp'
    },
    {label:'better luck',
        img_src:'better_luck-small.webp'
    },
    {label:'bottle top',
        img_src:'green_bottle-small.webp'
    },
    {label:'better luck',
        img_src:'better_luck-small.webp'
    },
    {label:'tshirt',
        img_src:'green_tshirt.webp'
    },
    {label:'better luck',
        img_src:'better_luck-small.webp'
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
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    )
}

export default Spin