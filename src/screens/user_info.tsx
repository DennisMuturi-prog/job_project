import { useForm } from "@tanstack/react-form";
import { object as z_object, string as z_string} from 'zod';
import { Stepper } from '@/App';

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const isValidKenyanPhone = (phone: string): boolean => {
    // Remove all spaces, dashes, and parentheses
    const cleaned = phone.replace(/[\s\-()]/g, '');
    
    // Kenyan phone number patterns:
    // 1. +254 followed by 9 digits (712345678, 722345678, 733345678, 745345678, etc.)
    // 2. 254 followed by 9 digits
    // 3. 0 followed by 9 digits (0712345678, 0722345678, etc.)
    
    const patterns = [
        /^\+254[17]\d{8}$/,           // +254712345678 or +254112345678
        /^254[17]\d{8}$/,             // 254712345678
        /^0[17]\d{8}$/,               // 0712345678
    ];
    
    return patterns.some(pattern => pattern.test(cleaned));
};
const formSchema = z_object({
    name: z_string()
        .min(2, "name must be at least 2 characters.")
        .max(32, "name title must be at most 32 characters."),
    phone_number: z_string().refine(isValidKenyanPhone, { 
            message: 'Invalid Kenyan phone number. Use format: +254712345678, 254712345678, or 0712345678' 
        }),
    detergent: z_string()
        .min(3, "detergent name  must be at least 2 characters.")
        .max(32, "detergent name must be at most 32 characters."),
    softener: z_string()
        .min(3, "softener name  must be at least 2 characters.")
        .max(32, "softener name must be at most 32 characters."),
})

function UserInfo() {
    const { next } = Stepper.useStepper();
    const form = useForm({
        defaultValues: {
            name: "",
            phone_number: "",
            detergent: "",
            softener: "",


        },
        validators: {
            onBlur: formSchema,
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            // toast("You submitted the following values:", {
            //     description: (
            //         <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
            //             <code>{JSON.stringify(value, null, 2)}</code>
            //         </pre>
            //     ),
            //     position: "bottom-right",
            //     classNames: {
            //         content: "flex flex-col gap-2",
            //     },
            //     style: {
            //         "--border-radius": "calc(var(--radius)  + 4px)",
            //     } as React.CSSProperties,
            // })
            console.log(value)
            next()
        },
    })

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>WASH AND WIN CHALLENGE</CardTitle>
                <CardDescription>
                    MASTER THE CYCLE, UNLOCK HUGE PRIZES.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    id="user-info-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                >
                    <FieldGroup>
                        <form.Field
                            name="name"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isBlurred && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="example: John Doe"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        />
                        <form.Field
                            name="phone_number"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isBlurred && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="example: +254721 234 277"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        />
                        <form.Field
                            name="detergent"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isBlurred && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>What detergent do you use?</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="example:Ariel"
                                            autoComplete="off"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        />
                        <form.Field
                            name="softener"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isBlurred && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>What downy do you use?</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="example :Downy"
                                            autoComplete="off"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        />

                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                        Reset
                    </Button>
                    <Button type="submit" form="user-info-form">
                        Submit
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}
export default UserInfo;
