'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHotelDrafts, publishHotelDraft } from "@/firebase/firestore/use-hotel-drafts";
import { HotelCardSkeleton } from "@/components/results/hotel-card-skeleton";
import type { hotel as Hotel } from "@/lib/types";
import { useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

function DraftCard({ draft, onPublished }: { draft: Hotel, onPublished: (id: string) => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublish = async () => {
        if (!firestore) {
            toast({ variant: 'destructive', title: 'Firestore not available' });
            return;
        }
        setIsPublishing(true);
        try {
            await publishHotelDraft(firestore, draft);
            toast({ title: 'Draft Published!', description: `${draft.name} is now live.` });
            onPublished(draft.id);
        } catch (error) {
            console.error("Publishing error: ", error);
            toast({ variant: 'destructive', title: 'Failed to publish', description: error instanceof Error ? error.message : 'See console for details.' });
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <Card className="flex flex-col sm:flex-row items-center p-4 gap-4">
            <div className="flex-grow">
                <h3 className="font-bold font-headline">{draft.name}</h3>
                <p className="text-sm text-muted-foreground">{draft.streetAddress}, {draft.city}</p>
            </div>
            <Button onClick={handlePublish} disabled={isPublishing}>
                 {isPublishing && <Loader2 className="animate-spin mr-2" />}
                {isPublishing ? 'Publishing...' : 'Publish'}
            </Button>
        </Card>
    );
}


export default function DraftsPage() {
    const { drafts, loading, error } = useHotelDrafts();
    const [publishedIds, setPublishedIds] = useState<string[]>([]);

    const handleDraftPublished = (id: string) => {
        setPublishedIds(prev => [...prev, id]);
    };

    const visibleDrafts = drafts.filter(d => !publishedIds.includes(d.id));

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Drafts</h1>
                    <p className="text-muted-foreground">Review and publish new property submissions.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Submitted Drafts</CardTitle>
                    <CardDescription>These properties are waiting for review. Publishing them will make them live on the site.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading && (
                        <div className="space-y-4">
                            <HotelCardSkeleton />
                            <HotelCardSkeleton />
                        </div>
                    )}
                    {error && <p className="text-destructive text-center py-8">{error}</p>}
                    {!loading && !error && (
                        visibleDrafts.length > 0 ? (
                            <div className="space-y-4">
                                {visibleDrafts.map((draft) => (
                                    <DraftCard key={draft.id} draft={draft} onPublished={handleDraftPublished} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-8">No pending drafts found.</p>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
