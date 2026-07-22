import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="alert alert-error bg-base-100/90">
          <div>
            <h1 className="text-2xl font-bold">Page not found</h1>
            <p className="mt-2">The route you requested does not exist in the archive.</p>
            <Link to="/" className="btn btn-primary mt-4">Return home</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
