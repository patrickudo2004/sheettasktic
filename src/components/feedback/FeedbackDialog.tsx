"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Send, Sparkles } from 'lucide-react';
import { useUser } from '@/firebase/provider';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export function FeedbackDialog() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const db = getFirestore();
      await addDoc(collection(db, 'feedback'), {
        userId: user?.uid,
        userEmail: user?.email,
        userName: user?.displayName,
        message: message.trim(),
        timestamp: serverTimestamp(),
      });

      toast({
        title: "Feedback Received!",
        description: "Thank you for helping us build SheetTasktic. We read every message!",
      });
      setMessage('');
      setOpen(false);
    } catch (err: any) {
      console.error("Feedback submission failed:", err);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "We couldn't save your feedback. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-primary/5 border-primary/20 hover:bg-primary/10">
          <MessageSquare className="h-4 w-4" />
          Give Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Shape the Future
          </DialogTitle>
          <DialogDescription>
            What features should we build next? Our founder reads all feedback personally.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="feedback">Your Message</Label>
            <Textarea
              id="feedback"
              placeholder="I wish I could sync with Slack..."
              className="min-h-[150px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading || !message.trim()} className="gap-2">
            {loading ? "Sending..." : "Send to Founder"}
            <Send className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
