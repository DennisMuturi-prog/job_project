import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Wheel, type Prize } from "@/components/Wheel"
import capImg from '@/assets/green_cap-small.webp';
import betterLuckImg from '@/assets/better_luck-small.webp';
import detergentImg from '@/assets/Ariel Original-small.webp';
import bottleTopImg from '@/assets/green_bottle-small.webp';
import tshirtImg from '@/assets/green_tshirt.webp';

const prizes: Prize[] = [
    {
        label: 'cap',
        img_src: capImg
    },
    {
        label: 'better luck',
        img_src: betterLuckImg
    },
    {
        label: 'detergent and downy',
        img_src: detergentImg
    },
    {
        label: 'better luck',
        img_src: betterLuckImg
    },
    {
        label: 'bottle top',
        img_src: bottleTopImg
    },
    {
        label: 'better luck',
        img_src: betterLuckImg
    },
    {
        label: 'tshirt',
        img_src: tshirtImg
    },
    {
        label: 'better luck',
        img_src: betterLuckImg
    },
];

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