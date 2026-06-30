"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

// Fix A: static class strings so Tailwind v4 can detect them at build time
const swatches = [
  { cls: "bg-primary", label: "primary" },
  { cls: "bg-secondary", label: "secondary" },
  { cls: "bg-muted", label: "muted" },
  { cls: "bg-accent", label: "accent" },
  { cls: "bg-success", label: "success" },
  { cls: "bg-warning", label: "warning" },
  { cls: "bg-info", label: "info" },
  { cls: "bg-destructive", label: "destructive" },
];

const alertItems = [
  { variant: "info" as const, icon: <Info className="size-4" />, title: "Info" },
  { variant: "success" as const, icon: <CheckCircle className="size-4" />, title: "Success" },
  { variant: "warning" as const, icon: <AlertTriangle className="size-4" />, title: "Warning" },
  { variant: "destructive" as const, icon: <XCircle className="size-4" />, title: "Destructive" },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-8 space-y-12">
      <header>
        <h1 className="text-4xl font-bold">CourtChat Design System</h1>
        <p className="text-muted-foreground mt-2">
          Purple brand &middot; calm + human &middot; soft shell, compact core.
        </p>
      </header>

      {/* Colors */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Colors</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {swatches.map((s) => (
            <div
              key={s.label}
              className={`${s.cls} rounded-lg h-16 flex items-end p-2`}
            >
              <span className="text-xs bg-background/80 rounded px-1">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Typography</h2>
        <h1 className="text-4xl font-bold">Heading 1</h1>
        <h2 className="text-3xl font-semibold">Heading 2</h2>
        <h3 className="text-2xl font-medium">Heading 3</h3>
        <h4 className="text-xl font-medium">Heading 4</h4>
        <p className="prose-readable">
          Body copy at the 16px reading floor with line-height 1.6 for low reading effort.
          The prose-readable class keeps line length comfortable for sustained reading.
        </p>
        <p className="text-sm text-muted-foreground">Small / metadata text.</p>
      </section>

      {/* Buttons */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          {(
            [
              "default",
              "secondary",
              "outline",
              "ghost",
              "link",
              "destructive",
            ] as const
          ).map((v) => (
            <Button key={v} variant={v}>
              {v}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">sm</Button>
          <Button>default</Button>
          <Button size="lg">lg</Button>
          <Button disabled>disabled</Button>
        </div>
      </section>

      {/* Forms */}
      <section className="space-y-4 max-w-md">
        <h2 className="text-2xl font-semibold">Forms</h2>
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enrique" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email (error state)</Label>
          <Input id="email" aria-invalid defaultValue="bad@" />
        </div>
        <Textarea placeholder="Message" />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select court" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Cuyahoga</SelectItem>
            <SelectItem value="b">Garfield Heights</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Checkbox id="reminders" />
          <Label htmlFor="reminders">Send me reminders</Label>
        </div>
      </section>

      {/* Feedback */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Feedback</h2>
        <div className="flex flex-wrap gap-2">
          {(
            [
              "default",
              "secondary",
              "success",
              "warning",
              "info",
              "destructive",
            ] as const
          ).map((v) => (
            <Badge key={v} variant={v}>
              {v}
            </Badge>
          ))}
        </div>
        <div className="space-y-2">
          {alertItems.map(({ variant, icon, title }) => (
            <Alert key={variant} variant={variant}>
              {icon}
              <AlertTitle>{title}</AlertTitle>
              <AlertDescription>Harmonized semantic tone.</AlertDescription>
            </Alert>
          ))}
        </div>
      </section>

      {/* Data */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Data</h2>
        <Card>
          <CardHeader>
            <CardTitle>Cases</CardTitle>
            <CardDescription>Compact-core table</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case</TableHead>
                  <TableHead>Next date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>CR-1024</TableCell>
                  <TableCell>Jul 12</TableCell>
                  <TableCell>
                    <Badge variant="success">on track</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>CR-1099</TableCell>
                  <TableCell>Jul 18</TableCell>
                  <TableCell>
                    <Badge variant="warning">upcoming</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>CR-1142</TableCell>
                  <TableCell>Aug 3</TableCell>
                  <TableCell>
                    <Badge variant="info">scheduled</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Overlays — Fix B: all 4 Tier-2 imports rendered here */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Overlays</h2>

        {/* Tabs */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Tabs</h3>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-3">
              <p className="text-sm text-muted-foreground">
                Case overview: parties, charges, assigned judge.
              </p>
            </TabsContent>
            <TabsContent value="documents" className="mt-3">
              <p className="text-sm text-muted-foreground">
                Filings, motions, and court orders attached to this case.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Dialog */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Dialog</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm action</DialogTitle>
                <DialogDescription>
                  This will submit your hearing request to the clerk&apos;s office.
                  You can&apos;t undo this after confirmation.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tooltip */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Tooltip</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Info className="size-4 mr-1" />
                  What is a continuance?
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>A postponement of a court date to a later time.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </section>
    </main>
  );
}
