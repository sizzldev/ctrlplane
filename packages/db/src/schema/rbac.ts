import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { z } from "zod";

export enum Permission {
  SystemCreate = "system.create",
  SystemUpdate = "system.update",
  SystemRead = "system.view",
  SystemDelete = "system.delete",

  TargetCreate = "target.create",
  TargetDelete = "target.delete",

  DeploymentCreate = "deployment.create",
  DeploymentUpdate = "deployment.update",
  DeploymentView = "deployment.view",
  DeploymentDelete = "deployment.delete",

  ReleaseCreate = "release.create",
  ReleaseView = "release.view",
}

export const role = pgTable("role", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
});

export const rolePermission = pgTable("role_permission", {
  id: uuid("id").primaryKey().defaultRandom(),
  roleId: uuid("role_id")
    .references(() => role.id, { onDelete: "cascade" })
    .notNull(),
  permission: text("permission"),
});

export const entityType = pgEnum("entity_type", ["user", "team"]);
export const entityTypeSchema = z.enum(entityType.enumValues);
export type EntityType = z.infer<typeof entityTypeSchema>;

export const scopeType = pgEnum("scope_type", [
  "workspace",
  "system",
  "deployment",
]);
export const scopeTypeSchema = z.enum(scopeType.enumValues);
export type ScopeType = z.infer<typeof scopeTypeSchema>;

export const entityRole = pgTable("entity_role", {
  id: uuid("id").primaryKey().defaultRandom(),

  roleId: uuid("id")
    .references(() => role.id, { onDelete: "cascade" })
    .notNull(),

  entityType: entityType("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),

  scopeId: uuid("scope_id").notNull(),
  scopeType: scopeType("scope_type").notNull(),
});
