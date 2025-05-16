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
import { logger } from "../utils/logger";

/**
 * Get current authenticated user information
 * @route GET /api/users/me
 * @access Private
 */
export async function getCurrentUserHandler(_: Request, res: Response) {
  try {
    res.status(200).json({
      status: true,
      message: "Current user retrieved successfully",
      data: res.locals.user,
    });
    return;
  } catch (error) {
    logger.error("Error retrieving current user:", error);
    res.status(500).json({
      status: false,
      message: "Failed to retrieve user information",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
    return;
  }
}

/**
 * Create a new user account
 * @route POST /api/users
 * @access Public
 */
export async function CreateUserHandler(
  req: Request<{}, {}, createUserInput["body"]>,
  res: Response
) {
  try {
    const body = req.body;
    const verification = v4();

    const user = await createUserService({
      ...body,
      verificationCode: verification,
    });

    // Send verification email with improved template
    await sendEmail({
      from: `"Jobby Recruitment Platform 👻" <lakabosch@gmail.com>`,
      to: user.email,
      subject: "Verify Your Email Address ✔",
      text: `Welcome to Jobby! Please verify your email by clicking this link: https://jobberman.onrender.com/api/users/verify/${user.id}/${user.verificationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2>Welcome to Jobby Recruitment Platform!</h2>
          <p>Thank you for signing up. To complete your registration, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://jobberman.onrender.com/api/users/verify/${user.id}/${user.verificationCode}" 
               style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p>https://jobberman.onrender.com/api/users/verify/${user.id}/${user.verificationCode}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    });

    // Remove sensitive information before sending response
    const savedUser = omit(
      user,
      "hashed_password",
      "verificationCode",
      "passwordResetCode"
    );

    res.status(201).json({
      status: true,
      message:
        "Account created successfully. Please check your email for verification instructions.",
      data: savedUser,
    });
  } catch (error: any) {
    logger.error("Error creating user:", error);

    // Handle specific error cases
    if (error.code === "P2002") {
      res.status(409).json({
        status: false,
        message: "An account with this email or username already exists",
      });
      return;
    } else if (error.code == "28000") {
      res.status(409).json({
        status: false,
        message: "Unique constraint violation on either username or email",
      });
      return;
    }

    res.status(500).json({
      status: false,
      message: "Failed to create user account",
      error: error.message || "Unknown error occurred",
    });
    return;
  }
}

/**
 * Verify user email with verification code
 * @route GET /api/users/verify/:id/:verificationcode
 * @access Public
 */
export async function verifyUserHandler(
  req: Request<verifyUserInput["params"]>,
  res: Response
) {
  try {
    const { id, verificationcode } = req.params;

    const user = await findUserService(id);
    if (!user) {
      res.status(404).json({
        status: false,
        message: "User not found",
      });
      return;
    }

    if (user.is_email_verified) {
      res.status(200).json({
        status: true,
        message: "Email already verified. You can now log in to your account.",
      });
      return;
    }

    if (user.verificationCode === verificationcode) {
      await verifyUserService(id);
      res.status(200).json({
        status: true,
        message:
          "Email verification successful. You can now log in to your account.",
      });
      return;
    } else {
      res.status(400).json({
        status: false,
        message: "Invalid verification code",
      });
      return;
    }
  } catch (error) {
    logger.error("Error verifying user:", error);
    res.status(500).json({
      status: false,
      message: "Failed to verify email",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
    return;
  }
}

/**
 * Handle forgot password request
 * @route POST /api/users/forgot-password
 * @access Public
 */
export async function forgotPasswordHandler(
  req: Request<{}, {}, forgotPasswordInput["body"]>,
  res: Response
) {
  try {
    const { email } = req.body;
    const user = await findEmailService(email);

    // For security reasons, don't reveal if user exists or not
    if (!user) {
      res.status(200).json({
        status: true,
        message:
          "If your email is registered, you will receive password reset instructions",
      });
      return;
    }

    if (!user.is_email_verified) {
      res.status(400).json({
        status: false,
        message:
          "Please verify your email address before resetting your password",
      });
      return;
    }

    const pRC = v4();
    const updatedUser = await forgotUserService(email, pRC);

    // Send password reset email with improved template
    await sendEmail({
      from: `"Jobby Recruitment Platform 👻" <lakabosch@gmail.com>`,
      to: user.email,
      subject: "Reset Your Password",
      text: `Click on the link to reset your password: https://jobberman.onrender.com/api/users/passwordreset/${updatedUser.id}/${pRC}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://jobberman.onrender.com/api/users/passwordreset/${updatedUser.id}/${pRC}" 
               style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour for security reasons.</p>
        </div>
      `,
    });

    res.status(200).json({
      status: true,
      message:
        "If your email is registered, you will receive password reset instructions",
    });
    return;
  } catch (error) {
    logger.error("Error in forgot password process:", error);
    res.status(500).json({
      status: false,
      message: "Failed to process password reset request",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
    return;
  }
}

/**
 * Reset password with reset code
 * @route POST /api/users/passwordreset/:id/:passwordresetcode
 * @access Public
 */
export async function passwordResetHandler(
  req: Request<resetPasswordInput["params"], {}, resetPasswordInput["body"]>,
  res: Response
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
      res.status(400).json({
        status: false,
        message: "Invalid or expired password reset link",
      });
      return;
    }

    const updatedUser = await passwordResetService(id, password);

    // Remove sensitive information before sending response
    const savedUser = omit(
      updatedUser,
      "hashed_password",
      "verificationCode",
      "passwordResetCode"
    );

    res.status(200).json({
      status: true,
      message:
        "Password updated successfully. You can now log in with your new password.",
      data: savedUser,
    });
    return;
  } catch (error) {
    logger.error("Error resetting password:", error);
    res.status(500).json({
      status: false,
      message: "Failed to reset password",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
    return;
  }
}
