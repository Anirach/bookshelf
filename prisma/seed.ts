import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.book.deleteMany()
  await prisma.author.deleteMany()
  await prisma.genre.deleteMany()

  // Create genres
  const fiction = await prisma.genre.create({
    data: { name: 'Fiction', color: '#8b5cf6' }
  })
  const scifi = await prisma.genre.create({
    data: { name: 'Science Fiction', color: '#06b6d4' }
  })
  const selfHelp = await prisma.genre.create({
    data: { name: 'Self-Help', color: '#22c55e' }
  })
  const biography = await prisma.genre.create({
    data: { name: 'Biography', color: '#f59e0b' }
  })

  // Create authors
  const orwell = await prisma.author.create({
    data: { name: 'George Orwell', bio: 'English novelist and essayist' }
  })
  const asimov = await prisma.author.create({
    data: { name: 'Isaac Asimov', bio: 'American writer and professor of biochemistry' }
  })
  const clear = await prisma.author.create({
    data: { name: 'James Clear', bio: 'Author and speaker focused on habits' }
  })
  const isaacson = await prisma.author.create({
    data: { name: 'Walter Isaacson', bio: 'American author and journalist' }
  })
  const tolkien = await prisma.author.create({
    data: { name: 'J.R.R. Tolkien', bio: 'English writer and philologist' }
  })

  // Create books
  await prisma.book.create({
    data: {
      title: '1984',
      authorId: orwell.id,
      genreId: fiction.id,
      isbn: '978-0451524935',
      coverUrl: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
      description: 'A dystopian novel about totalitarianism.',
      pageCount: 328,
      publishedYear: 1949,
      status: 'completed',
      rating: 5,
      currentPage: 328,
      notes: 'A masterpiece. Big Brother is more relevant than ever.'
    }
  })

  await prisma.book.create({
    data: {
      title: 'Foundation',
      authorId: asimov.id,
      genreId: scifi.id,
      isbn: '978-0553293357',
      coverUrl: 'https://covers.openlibrary.org/b/isbn/9780553293357-L.jpg',
      description: 'Classic science-fiction masterpiece.',
      pageCount: 244,
      publishedYear: 1951,
      status: 'reading',
      currentPage: 156,
      notes: 'Fascinating concept of psychohistory.'
    }
  })

  await prisma.book.create({
    data: {
      title: 'Atomic Habits',
      authorId: clear.id,
      genreId: selfHelp.id,
      isbn: '978-0735211292',
      coverUrl: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
      description: 'Build good habits and break bad ones.',
      pageCount: 320,
      publishedYear: 2018,
      status: 'completed',
      rating: 4,
      currentPage: 320,
      notes: 'The 1% improvement concept is powerful.'
    }
  })

  await prisma.book.create({
    data: {
      title: 'Steve Jobs',
      authorId: isaacson.id,
      genreId: biography.id,
      isbn: '978-1451648539',
      coverUrl: 'https://covers.openlibrary.org/b/isbn/9781451648539-L.jpg',
      description: 'The exclusive biography of Steve Jobs.',
      pageCount: 656,
      publishedYear: 2011,
      status: 'want-to-read',
      notes: 'Recommended by colleagues.'
    }
  })

  await prisma.book.create({
    data: {
      title: 'The Lord of the Rings',
      authorId: tolkien.id,
      genreId: fiction.id,
      isbn: '978-0618640157',
      coverUrl: 'https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg',
      description: 'Complete one-volume edition of Tolkien masterpiece.',
      pageCount: 1178,
      publishedYear: 1954,
      status: 'want-to-read'
    }
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
