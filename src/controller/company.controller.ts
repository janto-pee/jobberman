import { Request, Response } from "express";

import { createcompanyInput } from "../schema/company.schema";
import {
  createCompanyService,
  deleteCompanyService,
  findCompanyService,
  updateCompanyService,
} from "../service/company.service";

export async function CreateCompanyHandler(
  req: Request<{}, {}, createcompanyInput["body"]>,
  res: Response
) {
  try {
    const body = req.body;

    const company = await createCompanyService({
      ...body,
    });

    res.status(201).json({
      status: true,
      message: `ddress Successfully Created`,
      data: company,
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

export async function findCompanyHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const company = await findCompanyService(id);
    if (!company) {
      res.send("could not find user's company");
      return;
    }

    res.status(201).json({
      status: true,
      message: "User company found",
      company: company,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function updateCompanyHandler(
  req: Request<{ id: string }, {}, createcompanyInput["body"]>,
  res: Response
) {
  try {
    const { id } = req.params;
    const body = req.body;
    const company = await findCompanyService(id);
    if (!company) {
      res.sendStatus(400);
      return;
    }

    const updatedCompany = await updateCompanyService(id, body);

    res.status(201).json({
      status: true,
      message: "password changed successfully",
      data: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function deleteCompanyHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const company = await deleteCompanyService(id);
    res.status(201).json({
      status: true,
      message: `company Successfully Deleted`,
      data: company,
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
      error: error,
    });
  }
}
