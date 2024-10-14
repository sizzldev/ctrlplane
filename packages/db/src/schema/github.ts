import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "./auth.js";
import { deployment } from "./deployment.js";
import { workspace } from "./workspace.js";

export const githubUser = pgTable("github_user", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  githubUserId: integer("github_user_id").notNull(),
  githubUsername: text("github_username").notNull(),
});

export type GithubUser = InferSelectModel<typeof githubUser>;

export const githubOrganization = pgTable(
  "github_organization",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    installationId: integer("installation_id").notNull(),
    organizationName: text("organization_name").notNull(),
    addedByUserId: uuid("added_by_user_id").references(() => githubUser.id, {
      onDelete: "set null",
    }),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    unique: uniqueIndex("unique_installation_workspace").on(
      t.installationId,
      t.workspaceId,
    ),
  }),
);

export const githubOrganizationRelations = relations(
  githubOrganization,
  ({ one, many }) => ({
    configFiles: many(githubConfigFile),
    addedByUser: one(githubUser, {
      fields: [githubOrganization.addedByUserId],
      references: [githubUser.id],
    }),
  }),
);

export type GithubOrganization = InferSelectModel<typeof githubOrganization>;
export type GithubOrganizationInsert = InferInsertModel<
  typeof githubOrganization
>;

export const githubOrganizationInsert = createInsertSchema(githubOrganization);

export const githubConfigFile = pgTable(
  "github_config_file",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => githubOrganization.id, { onDelete: "cascade" }),
    repositoryName: text("repository_name").notNull(),
    path: text("path").notNull(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    lastSyncedAt: timestamp("last_synced_at", {
      withTimezone: true,
    }).defaultNow(),
    connected: boolean("connected").notNull().default(false),
    branch: text("branch").notNull().default("main"),
  },
  (t) => ({
    unique: uniqueIndex("unique_organization_repository_path").on(
      t.organizationId,
      t.repositoryName,
      t.path,
    ),
  }),
);

export const githubConfigFileRelations = relations(
  githubConfigFile,
  ({ one, many }) => ({
    organization: one(githubOrganization, {
      fields: [githubConfigFile.organizationId],
      references: [githubOrganization.id],
    }),
    deployments: many(deployment),
  }),
);

export type GithubConfigFile = InferSelectModel<typeof githubConfigFile>;
