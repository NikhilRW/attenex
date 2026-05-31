import * as v from "valibot";

export const resetPasswordQueryParams = v.object({
  token: v.pipe(v.string(), v.trim(), v.minLength(1)),
  email: v.pipe(v.string(), v.trim(), v.email()),
});


export const verifyEmailQueryParams = resetPasswordQueryParams;

