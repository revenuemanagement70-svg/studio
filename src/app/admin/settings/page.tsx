
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Key, Bell, Palette, TestTube } from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function SettingsPage() {
    const { toast } = useToast();
    const firestore = useFirestore();

    const handleSave = (section: string) => {
        toast({
            title: "Settings Saved",
            description: `Your ${section} settings have been updated. (This is a demo).`
        })
    }

    const handleTestWrite = () => {
        if (!firestore) {
            toast({ variant: "destructive", title: "Firestore not initialized." });
            return;
        }

        const draftsCollection = collection(firestore, 'hotels_draft');
        const testData = { name: "Debug Test Hotel", createdAt: new Date() };

        addDoc(draftsCollection, testData)
            .then((docRef) => {
                toast({
                    title: "Write Test Successful!",
                    description: `Document written with ID: ${docRef.id}`,
                });
            })
            .catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: draftsCollection.path,
                    operation: 'create',
                    requestResourceData: testData,
                });
                errorEmitter.emit('permission-error', permissionError);
                 toast({
                    variant: "destructive",
                    title: "Write Test Failed",
                    description: "Check the developer console for the full contextual error.",
                });
            });
    };


    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline">Settings</h1>
                <p className="text-muted-foreground">Manage your account and application settings.</p>
            </div>

            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><TestTube className="size-5" /> Firestore Write Test</CardTitle>
                        <CardDescription>Use this button to test if your account has permission to create documents in the 'hotels_draft' collection.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleTestWrite}>Test Draft Creation</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User className="size-5" /> Profile</CardTitle>
                        <CardDescription>Update your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue="Admin User" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue="email-1111@gmail.com" disabled />
                        </div>
                        <Button onClick={() => handleSave('Profile')}>Save Profile</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Key className="size-5" /> Security</CardTitle>
                        <CardDescription>Change your password.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                        </div>
                        <Button onClick={() => handleSave('Security')}>Change Password</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bell className="size-5" /> Notifications</CardTitle>
                        <CardDescription>Manage your notification preferences.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Notification settings are coming soon.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Palette className="size-5" /> Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Theme customization is coming soon.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
