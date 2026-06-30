import { Button } from "@/components/ui/button";
export default function Page() {
  return (
    <div className="flex flex-wrap gap-3 p-8">
      {(["default","secondary","outline","ghost","link","destructive"] as const).map(v => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </div>
  );
}
