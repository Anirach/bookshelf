import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBook, updateReadingProgress, deleteBook } from "@/lib/actions";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) notFound();

  const progress = book.pageCount > 0 ? Math.round((book.currentPage / book.pageCount) * 100) : 0;

  async function handleDelete() {
    'use server';
    await deleteBook(id);
    redirect('/books');
  }

  async function handleProgressUpdate(formData: FormData) {
    'use server';
    const page = parseInt(formData.get('currentPage') as string);
    await updateReadingProgress(id, page);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <Link href="/books" className="text-muted-foreground hover:text-foreground">
          ← Back to Books
        </Link>
        <div className="flex gap-2">
          <Link href={`/books/${id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <form action={handleDelete}>
            <Button variant="destructive">Delete</Button>
          </form>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cover */}
        <div>
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} className="w-full rounded-lg shadow-lg" />
          ) : (
            <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg flex items-center justify-center text-6xl">📕</div>
          )}
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            {book.author && <p className="text-xl text-muted-foreground">by {book.author.name}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={
              book.status === 'completed' ? 'bg-green-600' :
              book.status === 'reading' ? 'bg-blue-600' : ''
            } variant={book.status === 'want-to-read' ? 'outline' : 'default'}>
              {book.status === 'want-to-read' ? 'Want to Read' :
               book.status === 'reading' ? 'Reading' : 'Completed'}
            </Badge>
            {book.genre && (
              <Badge style={{ backgroundColor: book.genre.color }}>{book.genre.name}</Badge>
            )}
          </div>

          {book.rating && (
            <div className="text-2xl">{'⭐'.repeat(book.rating)}</div>
          )}

          {book.description && (
            <Card>
              <CardHeader><CardTitle>Description</CardTitle></CardHeader>
              <CardContent><p>{book.description}</p></CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {book.pageCount > 0 && (
              <div><span className="text-muted-foreground">Pages:</span> {book.pageCount}</div>
            )}
            {book.publishedYear && (
              <div><span className="text-muted-foreground">Published:</span> {book.publishedYear}</div>
            )}
            {book.isbn && (
              <div><span className="text-muted-foreground">ISBN:</span> {book.isbn}</div>
            )}
          </div>

          {/* Reading Progress */}
          {book.status === 'reading' && book.pageCount > 0 && (
            <Card>
              <CardHeader><CardTitle>Reading Progress</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Page {book.currentPage} of {book.pageCount}</span>
                    <span className="font-bold">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <form action={handleProgressUpdate} className="flex gap-2">
                    <input
                      type="number"
                      name="currentPage"
                      defaultValue={book.currentPage}
                      min={0}
                      max={book.pageCount}
                      className="flex-1 px-3 py-2 bg-background border rounded-md"
                    />
                    <Button type="submit">Update</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {book.notes && (
            <Card>
              <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
              <CardContent><p className="whitespace-pre-wrap">{book.notes}</p></CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
