import { JobController } from "./controller/JobController";
import { PersonController } from "./controller/PersonController";
import { UserController } from "./controller/UserController";

export const Routes = [
  {
    method: "post",
    route: "/api/persons",
    controller: PersonController,
    action: "createPerson",
  },
  // person
  {
    method: "post",
    route: "/api/persons/:id/:verificationcode",
    controller: PersonController,
    action: "verifyPerson",
  },
  {
    method: "post",
    route: "/api/persons/forgotpassword",
    controller: PersonController,
    action: "forgotPassword",
  },
  {
    method: "post",
    route: "/api/persons/resetpassword/:id/:passwordresetcode",
    controller: PersonController,
    action: "resetPassword",
  },
  {
    method: "post",
    route: "/api/persons/me",
    controller: UserController,
    action: "accessAccount",
    // getcurrentuser
  },

  //

  {
    method: "post",
    route: "/api/session",
    controller: SessionC,
    action: "currentPerson",
  },

  {
    method: "post",
    route: "/api/session",
    controller: UserController,
    action: "updatePerson",
  },

  {
    method: "get",
    route: "/api/jobs",
    controller: JobController,
    action: "allJob",
  },
  {
    method: "get",
    route: "/api/jobs/:id",
    controller: JobController,
    action: "oneJob",
  },
  {
    method: "put",
    route: "/api/jobs",
    controller: JobController,
    action: "updatePerson",
  },
  {
    method: "delete",
    route: "/api/jobs/:id",
    controller: JobController,
    action: "removeJob",
  },

  //   start here

  // people routes

  {
    method: "get",
    route: "/api/users",
    controller: UserController,
    action: "all",
  },
  {
    method: "get",
    route: "/api/users/:id",
    controller: UserController,
    action: "one",
  },
  {
    method: "post",
    route: "/api/users",
    controller: UserController,
    action: "save",
  },
  {
    method: "delete",
    route: "/api/users/:id",
    controller: UserController,
    action: "remove",
  },

  // Sessions

  {
    method: "delete",
    route: "/api/users/:id",
    controller: UserController,
    action: "remove",
  },

  // Applicants

  // Applications

  // Employers

  // Jobs

  // Messages

  // Notification

  // Person

  // Rating

  // Verify Email
];
