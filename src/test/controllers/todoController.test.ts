import { expect } from "chai";
import sinon from "sinon";
import { Request, Response } from "express";
import * as todoService from "../../services/todoService";
import * as todoController from "../../controllers/todoController";

describe("Todo Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let sendStub: sinon.SinonStub;

  beforeEach(() => {
    req = {};
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    statusStub = res.status as sinon.SinonStub;
    sendStub = res.send as sinon.SinonStub;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("fetchAllTodoByUser", () => {
    it("should return a list of tasks for a valid user", async () => {
      const mockTasks = [
        {
          id: 1,
          priority: "high",
          heading: "Test Task",
          content: "Task Content",
          completed: false,
          deadline: new Date(),
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      sinon.stub(todoService, "fetchAllTodoByUserService").resolves(mockTasks);
      req.headers = { authorization: "Bearer validToken" };
      sinon.stub(todoController, "extractUserIdFromToken").returns(1);

      await todoController.fetchAllTodoByUser(req as Request, res as Response);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(sendStub.calledWith(mockTasks)).to.be.true;
    });

    it("should return 401 if token is invalid", async () => {
      req.headers = { authorization: "Bearer invalidToken" };
      sinon.stub(todoController, "extractUserIdFromToken").throws(new Error("Unauthorized"));

      await todoController.fetchAllTodoByUser(req as Request, res as Response);

      expect(statusStub.calledWith(401)).to.be.true;
      expect(sendStub.calledWith({ message: "Unauthorized" })).to.be.true;
    });
  });

  describe("addTask", () => {
    it("should add a new task and return it", async () => {
      const mockTask = {
        id: 1,
        priority: "medium",
        heading: "New Task",
        content: "Task Content",
        completed: false,
        deadline: new Date(),
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      sinon.stub(todoService, "addTaskService").resolves(mockTask);
      req.headers = { authorization: "Bearer validToken" };
      req.body = { heading: "New Task", content: "Task Content", priority: "medium", deadline: new Date() };
      sinon.stub(todoController, "extractUserIdFromToken").returns(1);

      await todoController.addTask(req as Request, res as Response);

      expect(statusStub.calledWith(201)).to.be.true;
      expect(sendStub.calledWith(mockTask)).to.be.true;
    });

    it("should return 401 if token is invalid", async () => {
      req.headers = { authorization: "Bearer invalidToken" };
      sinon.stub(todoController, "extractUserIdFromToken").throws(new Error("Unauthorized"));

      await todoController.addTask(req as Request, res as Response);

      expect(statusStub.calledWith(401)).to.be.true;
      expect(sendStub.calledWith({ message: "Unauthorized" })).to.be.true;
    });
  });

  describe("editTaskByTaskId", () => {
    it("should edit a task and return the updated task", async () => {
      const mockUpdatedTask = {
        id: 1,
        priority: "low",
        heading: "Updated Task",
        content: "Updated Content",
        completed: true,
        deadline: new Date(),
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      sinon.stub(todoService, "editTaskByTaskIdService").resolves(mockUpdatedTask);
      req.headers = { authorization: "Bearer validToken" };
      req.params = { id: "1" };
      req.body = { heading: "Updated Task" };
      sinon.stub(todoController, "extractUserIdFromToken").returns(1);

      await todoController.editTaskByTaskId(req as Request, res as Response);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(sendStub.calledWith(mockUpdatedTask)).to.be.true;
    });

    it("should return 404 if task is not found", async () => {
      sinon.stub(todoService, "editTaskByTaskIdService").throws({ name: "NotFoundError", message: "Task not found" });
      req.headers = { authorization: "Bearer validToken" };
      req.params = { id: "1" };
      req.body = { heading: "Updated Task" };
      sinon.stub(todoController, "extractUserIdFromToken").returns(1);

      await todoController.editTaskByTaskId(req as Request, res as Response);

      expect(statusStub.calledWith(404)).to.be.true;
      expect(sendStub.calledWith({ message: "Task not found" })).to.be.true;
    });
  });

  describe("deleteTask", () => {
    it("should delete a task and return success message", async () => {
      sinon.stub(todoService, "deleteTaskService").resolves(true);
      req.params = { id: "1" };

      await todoController.deleteTask(req as Request, res as Response);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(sendStub.calledWith({ message: "Task deleted successfully" })).to.be.true;
    });

    it("should return 404 if task is not found", async () => {
      sinon.stub(todoService, "deleteTaskService").throws({ name: "NotFoundError", message: "Task not found" });
      req.params = { id: "1" };

      await todoController.deleteTask(req as Request, res as Response);

      expect(statusStub.calledWith(404)).to.be.true;
      expect(sendStub.calledWith({ message: "Task not found" })).to.be.true;
    });
  });
});
