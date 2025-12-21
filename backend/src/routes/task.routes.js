router.post("/projects/:projectId/tasks", authenticate, createTask);
router.get("/projects/:projectId/tasks", authenticate, listTasks);
router.put("/tasks/:taskId", authenticate, updateTask);
