const express = require("express");
const { uuid, isUuid } = require("uuidv4");

const api = express();

api.use(express.json());

const projects = [];

function logRequest(req, res, next) {
  const { method, url } = req;

  const label = `[${method.toUpperCase()}] - ${url}`;

  console.log(label);

  next();
}

function validateProjectid(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  next();
}

api.use(logRequest);
api.use("/projects/:id", validateProjectid);

api.get("/projects", (req, res) => {
  const { title } = req.query;

  const results = title
    ? projects.filter((project) =>
        project.title.toLowerCase().includes(title.toLowerCase())
      )
    : projects;

  return res.json(results);
});

api.post("/projects", (req, res) => {
  const { title, owner } = req.body;

  const project = {
    id: uuid(),
    title,
    owner,
  };

  projects.push(project);

  return res.json(project);
});

api.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const { title, owner } = req.body;

  const indexProject = projects.findIndex((item) => item.id === id);

  if (indexProject < 0) {
    return res.status(400).json({ message: "Project not found" });
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[indexProject] = project;

  return res.json(project);
});

api.delete("/projects/:id", (req, res) => {
  const { id } = req.params;

  const indexProject = projects.findIndex((project) => project.id === id);
  projects.splice(indexProject, 1);

  return res.status(204).send();
});

api.listen(3333, () => {
  console.log("🚀 Server OnTheLine");
});
