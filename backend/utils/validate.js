import { z } from "zod";
import { errorHandler } from "./error.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const error = errorHandler(400, "VALIDATION_ERROR", "Invalid request data.");
    error.details = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      code: issue.message,
    }));
    return next(error);
  }

  req.body = result.data;
  next();
};

const username = z
  .string()
  .trim()
  .min(3, "USERNAME_TOO_SHORT")
  .max(30, "USERNAME_TOO_LONG")
  .regex(/^[a-zA-Z0-9._-]+$/, "USERNAME_INVALID_CHARS");
const email = z.string().trim().toLowerCase().pipe(z.email("EMAIL_INVALID"));
const password = z.string().min(8, "PASSWORD_TOO_SHORT").max(100, "PASSWORD_TOO_LONG");
const url = z.url("URL_INVALID");

export const schemas = {
  signup: z.object({ username, email, password }),
  signin: z.object({ email, password: z.string().min(1, "PASSWORD_REQUIRED") }),
  google: z.object({ idToken: z.string().min(1) }),
  updateUser: z
    .object({ username, email, password, picture: url })
    .partial()
    .refine((data) => Object.keys(data).length > 0, "NOTHING_TO_UPDATE"),
  post: z.object({
    title: z.string().trim().min(3, "TITLE_TOO_SHORT").max(150, "TITLE_TOO_LONG"),
    content: z.string().trim().min(20, "CONTENT_TOO_SHORT"),
    category: z.string().trim().max(40).optional(),
    image: url.optional(),
  }),
  comment: z.object({
    content: z.string().trim().min(1, "COMMENT_EMPTY").max(300, "COMMENT_TOO_LONG"),
    postId: z.string().min(1),
  }),
  editComment: z.object({
    content: z.string().trim().min(1, "COMMENT_EMPTY").max(300, "COMMENT_TOO_LONG"),
  }),
};
