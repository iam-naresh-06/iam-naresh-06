package com.examly.springapp.service;

import com.examly.springapp.entity.Book;
import com.examly.springapp.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    public Book addBook(Book book) {
        if (bookRepository.existsByIsbn(book.getIsbn())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "ISBN already exists");
        }
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book bookDetails) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));

        if (bookDetails.getTitle() != null) book.setTitle(bookDetails.getTitle());
        if (bookDetails.getAuthor() != null) book.setAuthor(bookDetails.getAuthor());
        if (bookDetails.getIsbn() != null) book.setIsbn(bookDetails.getIsbn());
        if (bookDetails.getPublicationYear() != null) book.setPublicationYear(bookDetails.getPublicationYear());
        if (bookDetails.getGenre() != null) book.setGenre(bookDetails.getGenre());
        if (bookDetails.getPublisher() != null) book.setPublisher(bookDetails.getPublisher());
        if (bookDetails.getDescription() != null) book.setDescription(bookDetails.getDescription());
        if (bookDetails.getLocation() != null) book.setLocation(bookDetails.getLocation());
        if (bookDetails.getTotalCopies() != null) book.setTotalCopies(bookDetails.getTotalCopies());
        if (bookDetails.getAvailableCopies() != null) book.setAvailableCopies(bookDetails.getAvailableCopies());

        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));
        bookRepository.delete(book);
    }

    public List<Book> searchBooks(String query, String author, String genre, Boolean available) {
        if (query != null && !query.trim().isEmpty()) {
            return bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrIsbnContainingIgnoreCase(query, query, query);
        } else if (author != null && !author.trim().isEmpty()) {
            return bookRepository.findByAuthorContainingIgnoreCase(author);
        } else if (genre != null && !genre.trim().isEmpty()) {
            return bookRepository.findByGenreContainingIgnoreCase(genre);
        } else if (available != null) {
            if (available) {
                return bookRepository.findByAvailableCopiesGreaterThan(0);
            } else {
                return bookRepository.findByAvailableCopies(0);
            }
        } else {
            return bookRepository.findAll();
        }
    }

    public List<Book> advancedSearch(String title, String author, String isbn, String genre, Integer publicationYear, Boolean available) {
        return bookRepository.findAll().stream()
                .filter(book -> title == null || book.getTitle().toLowerCase().contains(title.toLowerCase()))
                .filter(book -> author == null || book.getAuthor().toLowerCase().contains(author.toLowerCase()))
                .filter(book -> isbn == null || book.getIsbn().contains(isbn))
                .filter(book -> genre == null || (book.getGenre() != null && book.getGenre().toLowerCase().contains(genre.toLowerCase())))
                .filter(book -> publicationYear == null || book.getPublicationYear().equals(publicationYear))
                .filter(book -> available == null || book.isAvailable() == available)
                .collect(Collectors.toList());
    }
}