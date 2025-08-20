package com.examly.springapp.controller;

import com.examly.springapp.entity.Book;
import com.examly.springapp.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// import java.util.Optional;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public Book getBookById(@PathVariable Long id) {
        return bookService.getBookById(id).orElseThrow(() -> new RuntimeException("Book not found"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public Book addBook(@RequestBody Book book) {
        return bookService.addBook(book);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('LIBRARIAN', 'ADMIN')")
    public Book updateBook(@PathVariable Long id, @RequestBody Book bookDetails) {
        return bookService.updateBook(id, bookDetails);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }

    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam(required = false) String query,
                                  @RequestParam(required = false) String author,
                                  @RequestParam(required = false) String genre,
                                  @RequestParam(required = false) Boolean available) {
        return bookService.searchBooks(query, author, genre, available);
    }

    @GetMapping("/search/advanced")
    public List<Book> advancedSearch(@RequestParam(required = false) String title,
                                     @RequestParam(required = false) String author,
                                     @RequestParam(required = false) String isbn,
                                     @RequestParam(required = false) String genre,
                                     @RequestParam(required = false) Integer publicationYear,
                                     @RequestParam(required = false) Boolean available) {
        return bookService.advancedSearch(title, author, isbn, genre, publicationYear, available);
    }
}