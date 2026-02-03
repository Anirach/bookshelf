import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createBook, getAuthors, getGenres } from "@/lib/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewBookPage() {
  const [authors, genres] = await Promise.all([getAuthors(), getGenres()]);

  async function handleSubmit(formData: FormData) {
    'use server';
    await createBook({
      title: formData.get('title') as string,
      authorId: formData.get('authorId') as string || undefined,
      genreId: formData.get('genreId') as string || undefined,
      isbn: formData.get('isbn') as string || undefined,
      coverUrl: formData.get('coverUrl') as string || undefined,
      description: formData.get('description') as string || undefined,
      pageCount: parseInt(formData.get('pageCount') as string) || 0,
      publishedYear: parseInt(formData.get('publishedYear') as string) || undefined,
      status: formData.get('status') as string || 'want-to-read',
      notes: formData.get('notes') as string || undefined,
    });
    redirect('/books');
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/books" className="text-muted-foreground hover:text-foreground">
        ← Back to Books
      </Link>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Add New Book</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authorId">Author</Label>
                <Select name="authorId">
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
                <Select name="genreId">
                  <SelectTrigger><SelectValue placeholder="Select genre" /></SelectTrigger>
                  <SelectContent>
                    {genres.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue="want-to-read">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="want-to-read">Want to Read</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="pageCount">Pages</Label>
                <Input id="pageCount" name="pageCount" type="number" min="0" />
              </div>
              <div>
                <Label htmlFor="publishedYear">Year</Label>
                <Input id="publishedYear" name="publishedYear" type="number" />
              </div>
              <div>
                <Label htmlFor="isbn">ISBN</Label>
                <Input id="isbn" name="isbn" />
              </div>
            </div>

            <div>
              <Label htmlFor="coverUrl">Cover URL</Label>
              <Input id="coverUrl" name="coverUrl" type="url" placeholder="https://..." />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={3} />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={3} />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Add Book</Button>
              <Link href="/books"><Button variant="outline">Cancel</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
