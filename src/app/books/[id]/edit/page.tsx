import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBook, getAuthors, getGenres, updateBook } from "@/lib/actions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [book, authors, genres] = await Promise.all([
    getBook(id),
    getAuthors(),
    getGenres()
  ]);

  if (!book) notFound();

  async function handleSubmit(formData: FormData) {
    'use server';
    await updateBook(id, {
      title: formData.get('title') as string,
      authorId: formData.get('authorId') as string || undefined,
      genreId: formData.get('genreId') as string || undefined,
      isbn: formData.get('isbn') as string || undefined,
      coverUrl: formData.get('coverUrl') as string || undefined,
      description: formData.get('description') as string || undefined,
      pageCount: parseInt(formData.get('pageCount') as string) || 0,
      publishedYear: parseInt(formData.get('publishedYear') as string) || undefined,
      status: formData.get('status') as string,
      rating: parseInt(formData.get('rating') as string) || undefined,
      currentPage: parseInt(formData.get('currentPage') as string) || 0,
      notes: formData.get('notes') as string || undefined,
    });
    redirect(`/books/${id}`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href={`/books/${id}`} className="text-muted-foreground hover:text-foreground">
        ← Back to Book
      </Link>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Edit: {book.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" defaultValue={book.title} required />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authorId">Author</Label>
                <Select name="authorId" defaultValue={book.authorId || ''}>
                  <SelectTrigger><SelectValue placeholder="Select author" /></SelectTrigger>
                  <SelectContent>
                    {authors.map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="genreId">Genre</Label>
                <Select name="genreId" defaultValue={book.genreId || ''}>
                  <SelectTrigger><SelectValue placeholder="Select genre" /></SelectTrigger>
                  <SelectContent>
                    {genres.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={book.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="want-to-read">Want to Read</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Select name="rating" defaultValue={book.rating?.toString() || ''}>
                  <SelectTrigger><SelectValue placeholder="Rate this book" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">⭐</SelectItem>
                    <SelectItem value="2">⭐⭐</SelectItem>
                    <SelectItem value="3">⭐⭐⭐</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="pageCount">Pages</Label>
                <Input id="pageCount" name="pageCount" type="number" min="0" defaultValue={book.pageCount} />
              </div>
              <div>
                <Label htmlFor="currentPage">Current Page</Label>
                <Input id="currentPage" name="currentPage" type="number" min="0" defaultValue={book.currentPage} />
              </div>
              <div>
                <Label htmlFor="publishedYear">Year</Label>
                <Input id="publishedYear" name="publishedYear" type="number" defaultValue={book.publishedYear || ''} />
              </div>
              <div>
                <Label htmlFor="isbn">ISBN</Label>
                <Input id="isbn" name="isbn" defaultValue={book.isbn || ''} />
              </div>
            </div>

            <div>
              <Label htmlFor="coverUrl">Cover URL</Label>
              <Input id="coverUrl" name="coverUrl" type="url" defaultValue={book.coverUrl || ''} />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={3} defaultValue={book.description || ''} />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={3} defaultValue={book.notes || ''} />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Save Changes</Button>
              <Link href={`/books/${id}`}><Button variant="outline">Cancel</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
