export default function SafariPage({ params }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Safari Details: {params.id}
      </h1>
      <p>This is a placeholder for the safari details page.</p>
    </div>
  );
}