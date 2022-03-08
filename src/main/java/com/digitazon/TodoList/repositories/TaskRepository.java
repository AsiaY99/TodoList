package com.digitazon.TodoList.repositories;

import com.digitazon.TodoList.entities.Task;
import org.springframework.data.repository.CrudRepository;

public interface TaskRepository extends CrudRepository<Task, Integer> {
}
