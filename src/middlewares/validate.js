import { ZodError } from 'zod';

/**
 * validate({ body, params, query }) retourne un middleware Express
 * qui valide req.body / req.params / req.query avec Zod.
 */
export function validate(schemas = {}) {
  const { body, params, query } = schemas;

  return (req, res, next) => {
    try {
      if (body)   req.body   = body.parse(req.body);
      if (params) req.params = params.parse(req.params);
      if (query)  req.query  = query.parse(req.query);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: err.flatten(),
        });
      }
      next(err);
    }
  };
}