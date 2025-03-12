import { Request, Response } from "express";

import { createcompanyInput } from "../schema/company.schema";
import {
  createCompanyService,
  deleteCompanyService,
  fiilterManyCompanyService,
  findAllCompanyService,
  findCompanyService,
  findManyCompanyService,
  totalCompanyCountService,
  updateCompanyAddressService,
  updateCompanyService,
} from "../service/company.service";
import { createAddressInput } from "../schema/address.schema";

export async function findCompanyHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const company = await findCompanyService(id);
    if (!company) {
      res.status(404).send("company not found");
      return;
    }

    res.status(200).json({
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

export async function findAllCompanysHandler(req: Request, res: Response) {
  try {
    let page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    let limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const company = await findAllCompanyService(page, limit);
    const total = await totalCompanyCountService();
    if (!company) {
      res.status(404).send("no company found");
      return;
    }

    res.status(200).json({
      status: true,
      total,
      "company limit per page": limit,
      page: page + 1,
      company: company,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function findCompanyByLocationHandler(
  req: Request<{ location: string }, { page: number; lmino: number }, {}>,
  res: Response
) {
  try {
    let page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    let limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 5;
    const location = req.params.location;
    const company = await findManyCompanyService(location, page, limit);
    if (company.length == 0) {
      res.status(404).send("No company for this location");
      return;
    }

    res.status(200).json({
      status: true,
      "company displayed": limit,
      page: page + 1,
      company: company,
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
    return;
  }
}

export async function FilterCompanyHandler(req: Request, res: Response) {
  try {
    let page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    let limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const city = req.query.city;
    const size = req.query.size;
    const country = req.query.country;
    const name = req.query.name;

    const company = await fiilterManyCompanyService(
      { city: city, size, country, name },
      page,
      limit
    );
    if (company.length == 0) {
      res.status(404).send("No company found");
      return;
    }
    res.status(200).json({
      status: true,
      "company displayed per page": limit,
      page: page + 1,
      company: company,
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

/**
 *
 * MUTTIONS
 * NOT EXPOSED
 *
 */
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
      message: `company Successfully Created`,
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

export async function updateCompanyHandler(
  req: Request<{ id: string }, {}, createcompanyInput["body"]>,
  res: Response
) {
  try {
    const { id } = req.params;
    const body = req.body;
    const company = await findCompanyService(id);
    if (!company) {
      res.status(404).sendStatus(400);
      return;
    }
    const updatedCompany = await updateCompanyService(id, body);

    res.status(201).json({
      status: true,
      message: "company updated successfully",
      data: updatedCompany,
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
    return;
  }
}

export async function updateCompanyAddressHandler(
  req: Request<
    { companyId: string; addressId: string },
    {},
    createAddressInput["body"]
  >,
  res: Response
) {
  try {
    const { companyId, addressId } = req.params;
    const body = req.body;
    const company = await findCompanyService(companyId);
    if (!company) {
      res.status(404).sendStatus(400);
      return;
    }

    const updatedCompany = await updateCompanyAddressService(
      companyId,
      addressId,
      { ...body }
    );

    res.status(201).json({
      status: true,
      message: "company updated successfully",
      data: updatedCompany,
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
    return;
  }
}

export async function deleteCompanyHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const company = await deleteCompanyService(id);
    res.status(200).json({
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
    return;
  }
}
