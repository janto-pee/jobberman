import { Request, Response } from "express";
import {
  createUserService,
  findEmailService,
  findUserService,
  forgotUserService,
  passwordResetService,
  verifyUserService,
} from "../service/user.service";

import {
  createUserInput,
  forgotPasswordInput,
  resetPasswordInput,
  verifyUserInput,
} from "../schema/user.schema";
import { v4 } from "uuid";
import { omit } from "lodash";
import sendEmail from "../utils/sendemail";
export async function getCurrentUserHandler(_: Request, res: Response) {
  try {
    res.status(201).send(res.locals.user);
    return;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
      error: error,
    });
  }
}

/**
 *
 * ! MUTATIONS
 *
 */

export async function CreateUserHandler(
  req: Request<{}, {}, createUserInput["body"]>,
  res: Response,
) {
  try {
    const body = req.body;
    const verification = v4();
    const user = await createUserService({
      ...body,
      verificationCode: verification,
    });
    await sendEmail({
      from: `"Jobby Recruitment Platform 👻" <lakabosch@gmail.com>`,
      to: user.email,
      subject: "Kindly verify your email ✔",
      text: `click on the link https://jobberman.onrender.com/api/users/verify/${user.id}/${user.verificationCode}`,
      html: `<b>Hello, click on the link https://jobberman.onrender.com/api/users/verify/${user.id}/${user.verificationCode}</b>`,
    });
    const savedUser = omit(
      user,
      "hashed_password",
      "verificationCode",
      "passwordResetCode",
    );

    res.status(201).json({
      status: true,
      message: `kindly check your email for verification code`,
      data: savedUser,
    });
    return;
  } catch (error: any) {
    if (error.code == "28000") {
      res.status(500).json({
        status: false,
        message: "unique contraint violation on either username or email",
      });
      return;
    }
    res.status(500).json({
      status: false,
      message: "server error",
      error: error,
    });
    return;
  }
}

export async function verifyUserHandler(
  req: Request<verifyUserInput["params"]>,
  res: Response,
) {
  try {
    const { id, verificationcode } = req.params;

    const user = await findUserService(id);
    if (!user) {
      res.send("could not find user");
      return;
    }
    if (user.is_email_verified) {
      res.send("user already verified");
      return;
    }

    if (user.verificationCode === verificationcode) {
      await verifyUserService(id);

      res.status(201).send("user successfully verified");
      return;
    }
    res.status(201).json({
      status: true,
      message: "User now verified",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
      error: error,
    });
    return;
  }
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, forgotPasswordInput["body"]>,
  res: Response,
) {
  try {
    const { email } = req.body;
    const user = await findEmailService(email);
    if (!user) {
      res.send("could not find user");
      return;
    }
    if (!user.is_email_verified) {
      res.send("please verify first");
      return;
    }
    const pRC = v4();
    const updatedUser = await forgotUserService(email, pRC);
    await sendEmail({
      from: `"Jobby Recruitment Platform 👻" <lakabosch@gmail.com>`,
      to: user.email,
      subject: "Kindly verify your email ✔",
      // text: `verification code: ${user.verificationCode}. username: ${user.username}`,
      text: `click on the link https://jobberman.onrender.com/api/users/passwordreset/${updatedUser.id}/${pRC}`,
      html: "<b>Hello world?</b>",
    });

    res.status(201).json({
      status: true,
      message: `please check your email to reset password https://jobberman.onrender.com/api/users/passwordreset/${updatedUser.id}/${pRC}`,
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
      error: error,
    });
    return;
  }
}

export async function passwordResetHandler(
  req: Request<resetPasswordInput["params"], {}, resetPasswordInput["body"]>,
  res: Response,
) {
  try {
    const { id, passwordresetcode } = req.params;
    const { password } = req.body;
    const user = await findUserService(id);
    if (
      !user ||
      !user.passwordResetCode ||
      user.passwordResetCode !== passwordresetcode
    ) {
      res.sendStatus(400);
      return;
    }

    const updatedUser = await passwordResetService(id, password);
    const savedUser = omit(
      updatedUser,
      "hashed_password",
      "verificationCode",
      "passwordResetCode",
    );
    res.status(201).json({
      status: true,
      message: "password changed successfully",
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
      error: error,
    });
    return;
  }
}
