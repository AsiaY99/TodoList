package com.digitazon.TodoList.repositories;


import com.digitazon.TodoList.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
