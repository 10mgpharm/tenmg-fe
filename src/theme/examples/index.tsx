import { Button, Card, Chip, CircularProgress, Skeleton } from '@nextui-org/react'
import React from 'react'

export default function ExampleComponent() {
    return (
        <main className="flex flex-col gap-5">

            <Card className="w-[200px] h-[400px] space-y-5 p-4" radius="lg">
                <Skeleton className="rounded-lg">
                    <div className="h-24 rounded-lg bg-default-300"></div>
                </Skeleton>
                <div className="space-y-3">
                    <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-4/5 rounded-lg">
                        <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-2/5 rounded-lg">
                        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                    </Skeleton>
                </div>
            </Card>

            <div className="flex gap-4 mb-5">
                <CircularProgress color="default" aria-label="Loading..." />
                <CircularProgress color="primary" aria-label="Loading..." />
                <CircularProgress color="secondary" aria-label="Loading..." />
                <CircularProgress color="success" aria-label="Loading..." />
                <CircularProgress color="warning" aria-label="Loading..." />
                <CircularProgress color="danger" aria-label="Loading..." />
            </div>

            <div className="flex gap-4 mb-5">
                <Chip color="default">Default</Chip>
                <Chip color="primary">Primary</Chip>
                <Chip color="secondary">Secondary</Chip>
                <Chip color="success">Success</Chip>
                <Chip color="warning">Warning</Chip>
                <Chip color="danger">Danger</Chip>
            </div>

            <div className="flex flex-row gap-10 mt-5 bg-green-900">
                <Button color="primary" size="sm" radius='sm'>Apply for 10MG Credit</Button>
                <Button color="primary" size="md" radius='md'>Apply for 10MG Credit</Button>
                <Button color="primary" size="lg">Apply for 10MG Credit</Button>
            </div>

            <div className="flex gap-5 mt-5">
                <Button color="secondary" size="sm">Apply for 10MG Credit</Button>
                <Button color="secondary" size="md">Apply for 10MG Credit</Button>
                <Button color="secondary" size="lg">Apply for 10MG Credit</Button>
            </div>

            <div className="flex gap-5 mt-5">
                <Button color="success" size="sm">Apply for 10MG Credit</Button>
                <Button color="success" size="md">Apply for 10MG Credit</Button>
                <Button color="success" size="lg">Apply for 10MG Credit</Button>
            </div>

            <div className="flex gap-5 mt-5">
                <Button color="warning" size="sm">Apply for 10MG Credit</Button>
                <Button color="warning" size="md">Apply for 10MG Credit</Button>
                <Button color="warning" size="lg">Apply for 10MG Credit</Button>
            </div>

            <div className="flex gap-5 mt-5">
                <Button color="danger" size="sm">Apply for 10MG Credit</Button>
                <Button color="danger" size="md">Apply for 10MG Credit</Button>
                <Button color="danger" size="lg">Apply for 10MG Credit</Button>
            </div>

            <div className="flex gap-5 mt-5">
                <Button color="default" size="sm">Apply for 10MG Credit</Button>
                <Button color="default" size="md">Apply for 10MG Credit</Button>
                <Button color="default" size="lg">Apply for 10MG Credit</Button>
            </div>
        </main>
    )
}
