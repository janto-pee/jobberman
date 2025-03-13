import { Request, Response } from "express";
import { createsalaryInput } from "../schema/salary.schema";
import {
  createSalaryService,
  deleteSalaryService,
  findAllSalaryService,
  findManySalaryService,
  findSalaryService,
  searchSalaryService,
  totalSalaryCountService,
  updateSalaryFKService,
  updateSalaryService,
} from "../service/salary.service";

/**
 *
 * QUERY END POINTS
 * EXPOSED
 *
 */

export async function findSalaryHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const salary = await findSalaryService(id);
    if (!salary) {
      res.send("No salary found");
      return;
    }

    res.status(200).json({
      status: true,
      message: "Salary found",
      salary: salary,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function findAllSalaryHandler(req: Request, res: Response) {
  try {
    let page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    let limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const salary = await findAllSalaryService(page, limit);
    const total = await totalSalaryCountService();
    if (!salary) {
      res.send("Salary not found");
      return;
    }
    res.status(200).json({
      status: true,
      total,
      "Salary limit per page": limit,
      page: page + 1,
      salary: salary,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function FilterSalaryHandler(
  req: Request<{}, createsalaryInput["query"], {}>,
  res: Response
) {
  try {
    let page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    let limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const currency = req.query.currency;
    const maximumMinor = req.query.maximumMinor;
    const minimumMinor = req.query.minimumMinor;
    const salaryMinor = req.query.salaryMinor;
    const workingHours = req.query.workingHours;

    const salary = await findManySalaryService(
      {
        currency,
        maximumMinor,
        minimumMinor,
        salaryMinor,
        workingHours,
      },
      page,
      limit
    );
    if (!salary) {
      res.send("No salary found");
      return;
    }
    res.status(200).json({
      status: true,
      "salary displayed per page": limit,
      page: page + 1,
      salary: salary,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function searchSalaryHandler(
  req: Request<{}, { page: number; lmino: number; search: string }, {}>,
  res: Response
) {
  try {
    let page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    let limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 5;
    const keyword = req.query.search;
    const salary = await searchSalaryService(keyword, page, limit);
    if (!salary) {
      res.send("Salary not found");
      return;
    }

    res.status(200).json({
      status: true,
      "salary displayed": limit,
      page: page + 1,
      salary: salary,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function autocompleteSalaryHandler(
  req: Request<{}, { page: number; lmino: number; currency: string }, {}>,
  res: Response
) {
  try {
    let page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    let limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 5;
    const keyword = req.query.currency;
    const salary = await findManySalaryService(
      {
        currency: {
          contains: keyword,
        },
      },
      page,
      limit
    );
    if (!salary) {
      res.send("Salary not found");
      return;
    }

    res.status(200).json({
      status: true,
      "Salary displayed per page": limit,
      page: page + 1,
      salary: salary,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

/**
 *
 *
 * MUTATIONS END POINT
 * NOT EXPOSED
 *
 */

export async function CreateFGSalaryHandler(
  req: Request<{}, {}, createsalaryInput["body"]>,
  res: Response
) {
  try {
    const body = req.body;

    const salary = await createSalaryService({
      ...body,
    });

    res.status(201).json({
      status: true,
      message: `Salary Successfully Created`,
      data: salary,
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

export async function updateSalaryHandler(
  req: Request<{ id: string }, {}, createsalaryInput["body"]>,
  res: Response
) {
  try {
    const { id } = req.params;
    const body = req.body;
    const salary = await findSalaryService(id);
    if (!salary) {
      res.sendStatus(400);
      return;
    }

    const updatedSalary = await updateSalaryService(id, body);

    res.status(201).json({
      status: true,
      message: "password changed successfully",
      data: updatedSalary,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function updateSalaryFKHandler(
  req: Request<
    { id: string; fgsId: string; tbsId: string },
    {},
    createsalaryInput["body"]
  >,
  res: Response
) {
  try {
    const { id, fgsId, tbsId } = req.params;
    const body = req.body;
    const salary = await findSalaryService(id);
    if (!salary) {
      res.status(404).sendStatus(400);
      return;
    }

    const updatedCompany = await updateSalaryFKService(id, fgsId, tbsId, {
      ...body,
    });

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

export async function deleteSalaryHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const salary = await deleteSalaryService(id);
    res.status(201).json({
      status: true,
      message: `Salary Successfully Deleted`,
      data: salary,
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
