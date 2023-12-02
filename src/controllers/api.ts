import { Response, Request, NextFunction } from "express"

/**
 * List of API examples.
 * @route GET /api
 */
export const getApi = (req: Request, res: Response) => {
  res.render("api/index", {
    title: "API Examples"
  })
}


