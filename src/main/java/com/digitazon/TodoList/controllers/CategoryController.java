package com.digitazon.TodoList.controllers;
import com.digitazon.TodoList.repositories.CategoryRepository;
import com.digitazon.TodoList.entities.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/all")
    public Iterable<Category> getAll() {
        return categoryRepository.findAll();
    }
}