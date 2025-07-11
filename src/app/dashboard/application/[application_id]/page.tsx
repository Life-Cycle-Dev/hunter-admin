'use client';

import { useHelperContext } from '@/components/providers/helper-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { isErrorResponse } from '@/types/payload';
import { FormEvent, use, useEffect, useRef } from 'react';

type PageProps = {
    params: Promise<{ application_id: string }>;
};

export default function Index({ params }: PageProps) {
    const { backendClient, router, setTitle, setAlert } = useHelperContext()();
    const { application_id } = use(params);
    const isCreatePage = application_id === 'create';
    const formRef = useRef<HTMLFormElement | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = formRef.current;
        const title = form?.appName?.value ?? '';
        const description = form?.description?.value ?? '';
        const active = form?.active?.checked ?? true;
        const response = await backendClient.createApplication(title, description, active);

        if (isErrorResponse(response)) {
            setAlert('Error', response.error, undefined, true);
            return;
        }
        router.push('/dashboard/application');
    };

    useEffect(() => {
        setTitle(isCreatePage ? 'Create Applications' : `Application Name: ""`);
    });

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="py-4 px-5 w-full  flex flex-col items-center"
        >
            {isCreatePage ? (
                <div className="max-w-[600px] w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="appName">Application Name</Label>
                        <Input id="appName" placeholder="Application Name" className="" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Description" className="" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="active" defaultChecked={true} />
                        <Label htmlFor="active">Active</Label>
                    </div>

                    <div className="mt-4 w-full flex justify-end">
                        <Button type="submit">Submit</Button>
                    </div>
                </div>
            ) : (
                <div>{application_id}</div>
            )}
        </form>
    );
}
