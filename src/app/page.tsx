import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBooks, getStats } from "@/lib/actions";
import Link from "next/link";

export default async function Dashboard() {
  const [stats, books] = await Promise.all([
    getStats(),
    getBooks()
  ]);

  const currentlyReading = books.filter(b => b.status === 'reading');
  const recentBooks = books.slice(0, 5);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{stats.reading}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Want to Read</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-500">{stats.wantToRead}</div>
          </CardContent>
        </Card>
      </div>

      {/* Currently Reading */}
      {currentlyReading.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">📖 Currently Reading</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentlyReading.map(book => {
              const progress = book.pageCount > 0 ? Math.round((book.currentPage / book.pageCount) * 100) : 0;
              return (
                <Link key={book.id} href={`/books/${book.id}`}>
                  <Card className="hover:bg-accent transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        {book.coverUrl && (
                          <img src={book.coverUrl} alt={book.title} className="w-16 h-24 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">{book.author?.name}</p>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{book.currentPage} / {book.pageCount}</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Recently Added */}
      <div>
        <h2 className="text-xl font-semibold mb-4">🕐 Recently Added</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentBooks.map(book => (
            <Link key={book.id} href={`/books/${book.id}`}>
              <Card className="hover:bg-accent transition-colors">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {book.coverUrl && (
                      <img src={book.coverUrl} alt={book.title} className="w-16 h-24 object-cover rounded" />
                    )}
                    <div>
                      <h3 className="font-semibold">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author?.name}</p>
                      <Badge variant={
                        book.status === 'completed' ? 'default' : 
                        book.status === 'reading' ? 'secondary' : 'outline'
                      } className="mt-2">
                        {book.status === 'want-to-read' ? 'Want to Read' : 
                         book.status === 'reading' ? 'Reading' : 'Completed'}
                      </Badge>
                      {book.rating && (
                        <div className="mt-1">{'⭐'.repeat(book.rating)}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
