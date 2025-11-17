import { query } from "../db/db.js";
import { CategoryNotFoundError, ConflictError } from "../plugins/errors.js";
import { type Static } from "@sinclair/typebox";
import { Category } from "../model/category-model.js";

type CategoryType = Static<typeof Category>;

type CreateCategoryInput = {
  name: string;
  description?: string | null;
};

type UpdateCategoryInput = Partial<CreateCategoryInput>;

class CategoryRepository {
  static async findAll(): Promise<CategoryType[]> {
    const sql = `
      SELECT id, name, description, created_at
      FROM categories
      ORDER BY name ASC
    `;
    const { rows } = await query(sql);
    return rows as CategoryType[];
  }

  static async findById(id: number): Promise<CategoryType | null> {
    const sql = `
      SELECT id, name, description, created_at
      FROM categories
      WHERE id = $1
    `;
    const { rows } = await query(sql, [id]);
    return (rows[0] as CategoryType) || null;
  }

  static async create({
    name,
    description,
  }: CreateCategoryInput): Promise<CategoryType> {
    try {
      const sql = `
        INSERT INTO categories (name, description)
        VALUES ($1, $2)
        RETURNING id, name, description, created_at
      `;
      const { rows } = await query(sql, [name.trim(), description ?? null]);
      return rows[0] as CategoryType;
    } catch (error: any) {
      if (error?.code === "23505") {
        throw new ConflictError();
      }
      throw error;
    }
  }

  static async update(
    id: number,
    payload: UpdateCategoryInput
  ): Promise<CategoryType> {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (payload.name !== undefined) {
      fields.push(`name = $${index++}`);
      values.push(payload.name.trim());
    }

    if (payload.description !== undefined) {
      fields.push(`description = $${index++}`);
      values.push(payload.description ?? null);
    }

    if (!fields.length) {
      const existing = await this.findById(id);
      if (!existing) throw new CategoryNotFoundError();
      return existing;
    }

    try {
      const sql = `
        UPDATE categories
        SET ${fields.join(", ")}
        WHERE id = $${index}
        RETURNING id, name, description, created_at
      `;
      values.push(id);
      const { rows } = await query(sql, values);
      const category = rows[0] as CategoryType | undefined;
      if (!category) throw new CategoryNotFoundError();
      return category;
    } catch (error: any) {
      if (error?.code === "23505") {
        throw new ConflictError();
      }
      throw error;
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      const sql = `
        DELETE FROM categories
        WHERE id = $1
        RETURNING id
      `;
      const { rows } = await query(sql, [id]);
      if (!rows[0]) throw new CategoryNotFoundError();
    } catch (error: any) {
      if (error?.code === "23503") {
        throw new ConflictError();
      }
      throw error;
    }
  }
}

export default CategoryRepository;
