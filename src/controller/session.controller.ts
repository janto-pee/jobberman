import { Request, Response } from "express";
import { validateUser } from "../service/user.service";
import {
  createSession,
  findSession,
  updateSession,
} from "../service/session.service";
import { signJwt } from "../utils/jwt";
import config from "config";
import { createSessionInput } from "../schema/session.schema";
import { omit } from "lodash";

export async function CreateSessionHandler(
  req: Request<{}, {}, createSessionInput["body"]>,
  res: Response
) {
  try {
    const { email, hashed_password } = req.body;
    const user = await validateUser(email, hashed_password);

    if (!user) {
      res.status(400).send(`user not found`);
      return;
    }

    const userAgent = req.get("userAgent") || "";
    const session = await createSession({
      id: user.id,
      user_agent: userAgent,
      client_ip: "",
    });
    const savedUser = omit(
      user,
      "hashed_password",
      "verificationCode",
      "passwordResetCode"
    );

    //   generate access and refresh token
    const accessToken = signJwt(
      { ...savedUser, session: session.id },
      "accessTokenPrivate",
      { expiresIn: config.get("accessTokenTtl") }
    );

    const refreshToken = signJwt(
      { ...savedUser, session: session.id },
      "refreshTokenPrivate",
      { expiresIn: config.get("refreshTokenTtl") }
    );

    res.status(201).send({
      session,
      accessToken: accessToken,
      refreshToken: refreshToken,
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

export async function findSessionHandler(_: Request, res: Response) {
  try {
    const id = res.locals.user.session;
    const session = await findSession(id);
    res.status(200).json({
      status: true,
      message: "session found",
      data: session,
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

export async function deleteSessionHandler(_: Request, res: Response) {
  try {
    const id = res.locals.user.session;
    const session = await updateSession(id);
    res.status(200).json({
      status: true,
      message: "session expired",
      data: session,
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
