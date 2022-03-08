package com.digitazon.TodoList.controllers;

import org.springframework.web.bind.annotation.*;
import com.digitazon.TodoList.repositories.TaskRepository;

@RestController
public class TaskController {
    private TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping("/")
    public String home() {
        long tot = taskRepository.count();
        System.out.println(tot);
        return "Benvenuti!";
    }
}
