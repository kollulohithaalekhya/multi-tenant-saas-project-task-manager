router.post("/", authenticate, createProject);
router.get("/", authenticate, listProjects);
router.get("/:projectId", authenticate, getProjectDetails);
