import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl md:text-4xl font-heading mb-4">Page Not Found</h1>
      <p className="text-lg text-text-sub mb-6 max-w-md">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
