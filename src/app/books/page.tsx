import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBooks } from "@/lib/actions";
import Link from "next/link";

export default async function BooksPage() {
  const books = await getBooks();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'reading':
        return <Badge className="bg-blue-600">Reading</Badge>;
      default:
        return <Badge variant="outline">Want to Read</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Books</h1>
        <Link href="/books/new">
          <Button>+ Add Book</Button>
        </Link>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map(book => {
              const progress = book.pageCount > 0 ? Math.round((book.currentPage / book.pageCount) * 100) : 0;
              return (
                <TableRow key={book.id}>
                  <TableCell>
                    <Link href={`/books/${book.id}`}>
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} className="w-12 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-16 bg-gray-700 rounded flex items-center justify-center">📕</div>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/books/${book.id}`} className="font-medium hover:underline">
                      {book.title}
                    </Link>
                  </TableCell>
                  <TableCell>{book.author?.name || '-'}</TableCell>
                  <TableCell>
                    {book.genre && (
                      <Badge style={{ backgroundColor: book.genre.color }}>{book.genre.name}</Badge>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(book.status)}</TableCell>
                  <TableCell>{book.rating ? '⭐'.repeat(book.rating) : '-'}</TableCell>
                  <TableCell>
                    {book.status === 'reading' && (
                      <div className="w-20">
                        <div className="text-xs mb-1">{progress}%</div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid gap-4">
        {books.map(book => (
          <Link key={book.id} href={`/books/${book.id}`}>
            <Card>
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-16 h-24 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-24 bg-gray-700 rounded flex items-center justify-center text-2xl">📕</div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author?.name}</p>
                    <div className="flex gap-2 mt-2">
                      {getStatusBadge(book.status)}
                      {book.genre && (
                        <Badge style={{ backgroundColor: book.genre.color }}>{book.genre.name}</Badge>
                      )}
                    </div>
                    {book.rating && <div className="mt-1">{'⭐'.repeat(book.rating)}</div>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
