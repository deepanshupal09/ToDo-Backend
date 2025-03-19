import { expect } from "chai";
import sinon from "sinon";
import { Request, Response } from "express";
import * as userService from "../../services/userService";
import * as userController from "../../controllers/userController";

describe("User Controller", () => {
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

  describe("signup", () => {
    it("should create a new user and return a token", async () => {
      const mockToken = "mockToken";
      sinon.stub(userService, "signupService").resolves(mockToken);
      req.body = { email: "test@test.com", password: "password", name: "Test User" };

      await userController.signup(req as Request, res as Response);

      expect(statusStub.calledWith(201)).to.be.true;
      expect(sendStub.calledWith({ token: mockToken })).to.be.true;
    });

    it("should return 409 if user already exists", async () => {
      sinon.stub(userService, "signupService").resolves(null);
      req.body = { email: "test@test.com", password: "password", name: "Test User" };

      await userController.signup(req as Request, res as Response);

      expect(statusStub.calledWith(409)).to.be.true;
      expect(sendStub.calledWith({ message: "User already exists" })).to.be.true;
    });

    it("should return 500 on internal server error", async () => {
      sinon.stub(userService, "signupService").throws(new Error("Internal Error"));
      req.body = { email: "test@test.com", password: "password", name: "Test User" };

      await userController.signup(req as Request, res as Response);

      expect(statusStub.calledWith(500)).to.be.true;
      expect(sendStub.calledWith({ message: "Internal Server Error" })).to.be.true;
    });
  });

  describe("login", () => {
    it("should log in a user and return a token", async () => {
      const mockToken = "mockToken";
      sinon.stub(userService, "loginService").resolves(mockToken);
      req.body = { email: "test@test.com", password: "password" };

      await userController.login(req as Request, res as Response);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(sendStub.calledWith({ token: mockToken })).to.be.true;
    });

    it("should return 400 if email or password is missing", async () => {
      req.body = { email: "", password: "" };

      await userController.login(req as Request, res as Response);

      expect(statusStub.calledWith(400)).to.be.true;
      expect(sendStub.calledWith({ message: "Email and password are required" })).to.be.true;
    });

    it("should return 401 if email or password is invalid", async () => {
      sinon.stub(userService, "loginService").resolves(null);
      req.body = { email: "test@test.com", password: "wrongpassword" };

      await userController.login(req as Request, res as Response);

      expect(statusStub.calledWith(401)).to.be.true;
      expect(sendStub.calledWith({ message: "Invalid email or password" })).to.be.true;
    });

    it("should return 500 on internal server error", async () => {
      sinon.stub(userService, "loginService").throws(new Error("Internal Error"));
      req.body = { email: "test@test.com", password: "password" };

      await userController.login(req as Request, res as Response);

      expect(statusStub.calledWith(500)).to.be.true;
      expect(sendStub.calledWith({ message: "Internal server error" })).to.be.true;
    });
  });
});
