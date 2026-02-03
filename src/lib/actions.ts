'use server'

import prisma from './db'
import { revalidatePath } from 'next/cache'

export async function getBooks(status?: string) {
  return prisma.book.findMany({
    where: status ? { status } : undefined,
    include: { author: true, genre: true },
    orderBy: { dateAdded: 'desc' }
  })
}

export async function getBook(id: string) {
  return prisma.book.findUnique({
    where: { id },
    include: { author: true, genre: true }
  })
}

export async function getAuthors() {
  return prisma.author.findMany({ orderBy: { name: 'asc' } })
}

export async function getGenres() {
  return prisma.genre.findMany({ orderBy: { name: 'asc' } })
}

export async function getStats() {
  const [total, reading, completed, wantToRead] = await Promise.all([
    prisma.book.count(),
    prisma.book.count({ where: { status: 'reading' } }),
    prisma.book.count({ where: { status: 'completed' } }),
    prisma.book.count({ where: { status: 'want-to-read' } })
  ])
  return { total, reading, completed, wantToRead }
}

export async function createBook(data: {
  title: string
  authorId?: string
  genreId?: string
  isbn?: string
  coverUrl?: string
  description?: string
  pageCount?: number
  publishedYear?: number
  status?: string
  notes?: string
}) {
  const book = await prisma.book.create({ data })
  revalidatePath('/books')
  revalidatePath('/')
  return book
}

export async function updateBook(id: string, data: {
  title?: string
  authorId?: string
  genreId?: string
  isbn?: string
  coverUrl?: string
  description?: string
  pageCount?: number
  publishedYear?: number
  status?: string
  rating?: number
  currentPage?: number
  notes?: string
}) {
  const book = await prisma.book.update({ where: { id }, data })
  revalidatePath('/books')
  revalidatePath(`/books/${id}`)
  revalidatePath('/')
  return book
}

export async function deleteBook(id: string) {
  await prisma.book.delete({ where: { id } })
  revalidatePath('/books')
  revalidatePath('/')
}

export async function updateReadingProgress(id: string, currentPage: number) {
  const book = await prisma.book.update({
    where: { id },
    data: { currentPage }
  })
  revalidatePath(`/books/${id}`)
  revalidatePath('/')
  return book
}
