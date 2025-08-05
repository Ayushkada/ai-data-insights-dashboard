export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-10">
      <h1 className="text-3xl font-bold mb-4 text-gradient-primary">Page Not Found</h1>
      <p className="text-muted-foreground mb-6">The dashboard section you requested does not exist.</p>
      <a href="/dashboard" className="text-accent underline">Back to Dashboard Overview</a>
    </div>
  );
} 