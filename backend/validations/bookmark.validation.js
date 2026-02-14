const { z } = require("zod");

exports.createBookmarkSchema = z.object({
  title: z.string().optional(),
  url: z.string().url(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional()
});

exports.updateBookmarkSchema = z.object({
  title: z.string().optional(),
  url: z.string().url().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isFavorite: z.boolean().optional()
});
