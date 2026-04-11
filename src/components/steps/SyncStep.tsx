"use client";

import { useSheetToTasks } from '@/context/SheetToTasksContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, CheckCircle, RefreshCw, ArrowLeft, History, AlertCircle, Link as LinkIcon, ExternalLink, Settings2, Trash2, Calendar, Globe, Database, Mail } from 'lucide-react';
import { exportAsCsv, exportAsJson, exportAsMarkdown } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useMemo } from 'react';
import { Separator } from '@/components/ui/separator';
import { useFirebase } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Import Adapters
import { GoogleTasksAdapter } from '@/lib/sync/adapters/GoogleTasksAdapter';
import { JiraAdapter } from '@/lib/sync/adapters/JiraAdapter';
import { HubSpotAdapter } from '@/lib/sync/adapters/HubSpotAdapter';
import { SlackAdapter } from '@/lib/sync/adapters/SlackAdapter';
import { SyncManager } from '@/lib/sync/SyncManager';

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  'google-tasks': <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><title>Google Tasks</title><path d="M12.438 12L7.125 6.635l-1.05 1.05L10.338 12l-4.263 4.315 1.05 1.05L12.438 12zM18 6.685l-1.05-1.05-4.263 4.315 1.05 1.05L18 6.685zm0 9.68l-4.263-4.315 1.05-1.05L18 15.315l1.05 1.05-1.05-1.05z" fill="currentColor"/></svg>,
  'notion': <Database className="h-5 w-5" />,
  'microsoft-todo': <Mail className="h-5 w-5" />,
  'microsoft-calendar': <Calendar className="h-5 w-5" />,
  'google-calendar': <Calendar className="h-5 w-5" />,
  'jira': <Settings2 className="h-5 w-5" />,
  'hubspot': <Globe className="h-5 w-5" />,
  'slack': <MessageSquare className="h-5 w-5" />,
};

export default function SyncStep() {
  const { tasks, fileName, setStep, reset } = useSheetToTasks();
  const { toast } = useToast();
  const { auth } = useFirebase();
  
  const [syncing, setSyncing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['google-tasks']);
  
  // Dialog States
  const [isNotionDialogOpen, setIsNotionDialogOpen] = useState(false);
  const [isJiraDialogOpen, setIsJiraDialogOpen] = useState(false);
  const [isSlackDialogOpen, setIsSlackDialogOpen] = useState(false);
  
  const [notionConfig, setNotionConfig] = useState({ token: '', databaseId: '' });
  const [jiraConfig, setJiraConfig] = useState({ token: '', siteId: '', projectKey: '' });
  const [slackConfig, setSlackConfig] = useState({ webhookUrl: '' });

  // Initialize adapters
  const providers = useMemo(() => [
    new GoogleTasksAdapter(auth),
    new NotionAdapter(),
    new MicrosoftTodoAdapter(),
    new MicrosoftCalendarAdapter(),
    new GoogleCalendarAdapter(auth),
    new JiraAdapter(),
    new HubSpotAdapter(),
    new SlackAdapter(),
  ], [auth]);

  const [connectedIds, setConnectedIds] = useState<string[]>([]);

  useEffect(() => {
    // Check initial connections
    const connected = providers.filter(p => p.isConnected()).map(p => p.id);
    setConnectedIds(connected);
  }, [providers]);

  const handleConnect = async (provider: SyncProvider) => {
    try {
      if (provider.id === 'notion') {
        setIsNotionDialogOpen(true);
        return;
      }
      if (provider.id === 'jira') {
        setIsJiraDialogOpen(true);
        return;
      }
      if (provider.id === 'slack') {
        setIsSlackDialogOpen(true);
        return;
      }
      
      await provider.connect();
      setConnectedIds(prev => [...prev, provider.id]);
      toast({
        title: "Connected!",
        description: `Successfully connected to ${provider.name}.`,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: err.message,
      });
    }
  };

  const handleDisconnect = async (provider: SyncProvider) => {
    await provider.disconnect();
    setConnectedIds(prev => prev.filter(id => id !== provider.id));
    setSelectedProviders(prev => prev.filter(id => id !== provider.id));
  };

  const saveNotionConfig = () => {
    const notion = providers.find(p => p.id === 'notion') as NotionAdapter;
    if (notion) {
      notion.setCredentials(notionConfig.token, notionConfig.databaseId);
      setConnectedIds(prev => [...prev, 'notion']);
      setIsNotionDialogOpen(false);
      toast({ title: "Notion Connected!" });
    }
  };

  const saveJiraConfig = () => {
    const jira = providers.find(p => p.id === 'jira') as JiraAdapter;
    if (jira) {
      jira.setCredentials(jiraConfig.token, jiraConfig.siteId, jiraConfig.projectKey);
      setConnectedIds(prev => [...prev, 'jira']);
      setIsJiraDialogOpen(false);
      toast({ title: "Jira Connected!" });
    }
  };

  const saveSlackConfig = () => {
    const slack = providers.find(p => p.id === 'slack') as SlackAdapter;
    if (slack) {
      slack.setWebhookUrl(slackConfig.webhookUrl);
      setConnectedIds(prev => [...prev, 'slack']);
      setIsSlackDialogOpen(false);
      toast({ title: "Slack Hook Connected!" });
    }
  };

  const handleSyncAll = async () => {
    if (selectedProviders.length === 0) {
      toast({ title: "Select a provider", description: "Choose at least one connected service to sync.", variant: "destructive" });
      return;
    }

    setSyncing('active');
    setError(null);
    
    // Use the SyncManager for concurrent processing
    const manager = new SyncManager(5); // 5 concurrent tasks

    for (const providerId of selectedProviders) {
      const provider = providers.find(p => p.id === providerId);
      if (!provider) continue;

      try {
        toast({ title: `Syncing with ${provider.name}...`, description: `Using smart batching for ${tasks.length} tasks.` });
        
        const result = await manager.sync(provider, tasks, (progress) => {
            // We could show a progress bar here if we wanted
            console.log(`${provider.name} progress: ${progress.percent}%`);
        });
        
        if (result.success) {
          toast({
            title: `${provider.name} Sync Complete`,
            description: `Successfully sent ${result.syncedCount} tasks.`,
            action: <CheckCircle className="text-green-500" />
          });
        } else {
          throw new Error(result.error);
        }
      } catch (err: any) {
        setError(`${provider.name}: ${err.message}`);
      }
    }
    
    setSyncing(null);
  };

  const baseFileName = fileName?.split('.').slice(0, -1).join('.') || 'tasks';

  if (!tasks) {
    reset();
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Sync & Export</CardTitle>
        <CardDescription>Choose your destination. You can sync to multiple services at once or download locally.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Sync Providers Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Cloud Sync
            </h3>
            {connectedIds.length > 0 && (
                <Button onClick={handleSyncAll} disabled={!!syncing || selectedProviders.length === 0}>
                    {syncing ? <RefreshCw className="animate-spin mr-2 h-4 w-4" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    {syncing ? 'Syncing...' : 'Sync Selected Platforms'}
                </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map(provider => {
              const isConnected = connectedIds.includes(provider.id);
              const isSelected = selectedProviders.includes(provider.id);
              
              return (
                <div key={provider.id} className={`p-4 rounded-xl border-2 transition-all ${isConnected ? 'bg-card border-primary/20' : 'bg-muted/50 border-transparent opacity-70'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isConnected ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {PLATFORM_ICONS[provider.id]}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{provider.name}</h4>
                        <p className="text-xs text-muted-foreground">{isConnected ? 'Connected' : 'Not Connected'}</p>
                      </div>
                    </div>
                    {isConnected ? (
                      <Checkbox 
                        checked={isSelected} 
                        onCheckedChange={(checked) => {
                          if (checked) setSelectedProviders(prev => [...prev, provider.id]);
                          else setSelectedProviders(prev => prev.filter(id => id !== provider.id));
                        }}
                      />
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => handleConnect(provider)}>
                        Connect
                      </Button>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-3 leading-tight">{provider.description}</p>
                  
                  {isConnected && (
                    <div className="flex justify-end gap-2 border-t pt-2 mt-2">
                       <Button variant="ghost" size="sm" className="h-7 text-[10px] text-muted-foreground" onClick={() => handleDisconnect(provider)}>
                         <Trash2 className="mr-1 h-3 w-3" /> Disconnect
                       </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Sync Issue</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

        {/* Local Export Section */}
        <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Local Export
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button size="lg" variant="outline" className="justify-start text-base h-auto py-4 group" onClick={() => exportAsCsv(tasks, baseFileName)}>
                    <div className="p-2 bg-slate-100 rounded-lg mr-3 group-hover:bg-primary/10 transition-colors">
                        <Download className="h-5 w-5" />
                    </div>
                    Download .csv
                </Button>
                 <Button size="lg" variant="outline" className="justify-start text-base h-auto py-4 group" onClick={() => exportAsJson(tasks, baseFileName)}>
                    <div className="p-2 bg-slate-100 rounded-lg mr-3 group-hover:bg-primary/10 transition-colors">
                        <Download className="h-5 w-5" />
                    </div>
                    Download .json
                </Button>
                 <Button size="lg" variant="outline" className="justify-start text-base h-auto py-4 group" onClick={() => exportAsMarkdown(tasks, baseFileName)}>
                    <div className="p-2 bg-slate-100 rounded-lg mr-3 group-hover:bg-primary/10 transition-colors">
                        <Download className="h-5 w-5" />
                    </div>
                    Download .md
                </Button>
            </div>
        </div>

      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(3)}><ArrowLeft className="mr-2 h-4 w-4" />Back to Preview</Button>
        <Button variant="ghost" onClick={reset} className="text-muted-foreground"><History className="mr-2 h-4 w-4" />Start Over</Button>
      </CardFooter>

      {/* Jira Configuration Dialog */}
      <Dialog open={isJiraDialogOpen} onOpenChange={setIsJiraDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect Jira Cloud</DialogTitle>
            <DialogDescription>
              Configure Jira to create issues automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="jira_token">OAuth / API Token</Label>
              <Input 
                id="jira_token" 
                type="password" 
                value={jiraConfig.token}
                onChange={e => setJiraConfig(prev => ({ ...prev, token: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jira_site">Cloud ID (Site ID)</Label>
              <Input 
                id="jira_site" 
                placeholder="e.g. 1a2b3c..." 
                value={jiraConfig.siteId}
                onChange={e => setJiraConfig(prev => ({ ...prev, siteId: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jira_proj">Project Key</Label>
              <Input 
                id="jira_proj" 
                placeholder="e.g. PROJ" 
                value={jiraConfig.projectKey}
                onChange={e => setJiraConfig(prev => ({ ...prev, projectKey: e.target.value.toUpperCase() }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveJiraConfig} disabled={!jiraConfig.token || !jiraConfig.projectKey}>
                Connect Jira
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Slack Configuration Dialog */}
      <Dialog open={isSlackDialogOpen} onOpenChange={setIsSlackDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect Slack Hook</DialogTitle>
            <DialogDescription>
              Enter an Incoming Webhook URL to receive sync reports.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="slack_url">Webhook URL</Label>
              <Input 
                id="slack_url" 
                placeholder="https://hooks.slack.com/services/..." 
                value={slackConfig.webhookUrl}
                onChange={e => setSlackConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveSlackConfig} disabled={!slackConfig.webhookUrl}>
                Connect Slack
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Notion Configuration Dialog */}
      <Dialog open={isNotionDialogOpen} onOpenChange={setIsNotionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect Notion</DialogTitle>
            <DialogDescription>
              Enter your Notion Integration Token and Database ID. You can create these at <Link href="https://developers.notion.com" target="_blank" className="text-primary hover:underline inline-flex items-center">developers.notion.com <ExternalLink className="ml-1 h-3 w-3"/></Link>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="token">Internal Integration Token</Label>
              <Input 
                id="token" 
                type="password" 
                placeholder="secret_..." 
                value={notionConfig.token}
                onChange={e => setNotionConfig(prev => ({ ...prev, token: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="db_id">Database ID</Label>
              <Input 
                id="db_id" 
                placeholder="Database ID (32 characters)" 
                value={notionConfig.databaseId}
                onChange={e => setNotionConfig(prev => ({ ...prev, databaseId: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveNotionConfig} disabled={!notionConfig.token || !notionConfig.databaseId}>
                Connect Notion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
