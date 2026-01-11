
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Key, Bell, Palette, TestTube, PlusCircle, AlertTriangle, Copy, Check } from "lucide-react";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import React, { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { generateApiKey, listApiKeys, revokeApiKey } from "@/firebase/firestore/api-keys";
import { useCollection, useMemoFirebase } from "@/firebase";
import { ApiKey } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

function ApiKeyCard() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isGenerating, startTransition] = useTransition();

    const [newApiKey, setNewApiKey] = useState<string | null>(null);
    const [showKeyDialog, setShowKeyDialog] = useState(false);
    const [copied, setCopied] = useState(false);

    const apiKeysQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, 'users', user.uid, 'apiKeys');
    }, [firestore, user]);

    const { data: apiKeys, isLoading } = useCollection<ApiKey>(apiKeysQuery);

    const handleGenerateKey = () => {
        if (!firestore || !user) return;
        startTransition(async () => {
            try {
                const { plaintextKey } = await generateApiKey(firestore, user.uid);
                setNewApiKey(plaintextKey);
                setShowKeyDialog(true);
            } catch (error) {
                toast({ variant: "destructive", title: "Error Generating Key", description: "Could not generate a new API key." });
            }
        });
    };

    const handleRevokeKey = async (keyId: string) => {
        if (!firestore || !user) return;
        try {
            await revokeApiKey(firestore, user.uid, keyId);
            toast({ title: "API Key Revoked" });
        } catch (error) {
             toast({ variant: "destructive", title: "Error Revoking Key", description: "Could not revoke the API key." });
        }
    }

    const copyToClipboard = () => {
        if (!newApiKey) return;
        navigator.clipboard.writeText(newApiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Key className="size-5" /> API Keys</CardTitle>
                    <CardDescription>Manage API keys for programmatic access to Staylo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading && (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    )}
                    {!isLoading && apiKeys.length > 0 && (
                        <div className="space-y-2">
                            {apiKeys.map(key => (
                                <div key={key.id} className="flex items-center justify-between p-3 bg-secondary rounded-md">
                                    <div>
                                        <p className="font-mono text-sm font-semibold">sty_...{key.keyPrefix.slice(-4)}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Created on {format(key.createdAt.toDate(), 'PPP')}
                                            {key.status === 'revoked' && <span className="text-destructive font-bold ml-2">(Revoked)</span>}
                                        </p>
                                    </div>
                                    <Button variant="destructive" size="sm" onClick={() => handleRevokeKey(key.id)} disabled={key.status === 'revoked'}>
                                        Revoke
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                     {!isLoading && apiKeys.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No API keys found.</p>
                     )}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleGenerateKey} disabled={isGenerating}>
                        {isGenerating ? "Generating..." : <><PlusCircle className="size-4 mr-2" /> Generate New Key</>}
                    </Button>
                </CardFooter>
            </Card>

            <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New API Key Generated</DialogTitle>
                        <DialogDescription>
                            Please copy your new API key. For security reasons, you will not be able to see it again.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-destructive/10 p-4 rounded-md space-y-4">
                        <p className="text-destructive font-semibold flex items-center gap-2">
                           <AlertTriangle className="size-4" /> Store this key securely.
                        </p>
                        <div className="flex items-center gap-2 p-3 bg-background rounded-md">
                            <pre className="text-sm flex-grow overflow-x-auto">{newApiKey}</pre>
                            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                                {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowKeyDialog(false)}>I have saved my key</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}


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
                <ApiKeyCard />

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
