import type { TargetCondition } from "@ctrlplane/validators/targets";
import type { VariableConfigType } from "@ctrlplane/validators/variables";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { AnyPgColumn, ColumnsWithTable } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import {
  foreignKey,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { targetCondition } from "@ctrlplane/validators/targets";
import { VariableConfig } from "@ctrlplane/validators/variables";

import { system } from "./system.js";

export const systemVariable = pgTable(
  "system_variable",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    key: text("key").notNull(),
    description: text("description").notNull().default(""),
    systemId: uuid("system_id")
      .notNull()
      .references(() => system.id),
    defaultValueId: uuid("default_value_id").default(sql`NULL`),
    config: jsonb("schema").$type<VariableConfigType>(),
  },
  (t) => ({
    uniq: uniqueIndex().on(t.systemId, t.key),
    defaultValueIdFK: foreignKey(defaultValueIdFKConstraint).onDelete(
      "set null",
    ),
  }),
);

export type SystemVariable = InferSelectModel<typeof systemVariable>;
export type InsertSystemVariable = InferInsertModel<typeof systemVariable>;
export const createSystemVariable = createInsertSchema(systemVariable, {
  key: z.string().min(1),
  config: VariableConfig,
}).omit({ id: true });
export const updateSystemVariable = createSystemVariable.partial();

export const systemVariableValue = pgTable(
  "system_variable_value",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    variableId: uuid("variable_id").notNull(),
    value: jsonb("value").$type<any>().notNull(),
    targetFilter: jsonb("target_filter")
      .$type<TargetCondition | null>()
      .default(sql`NULL`),
  },
  (t) => ({
    uniq: uniqueIndex().on(t.variableId, t.value),
    variableIdFk: foreignKey({
      columns: [t.variableId],
      foreignColumns: [systemVariable.id],
    })
      .onUpdate("restrict")
      .onDelete("cascade"),
  }),
);
export type SystemVariableValue = InferSelectModel<typeof systemVariableValue>;
export const createSystemVariableValue = createInsertSchema(
  systemVariableValue,
  { targetFilter: targetCondition },
)
  .omit({
    id: true,
  })
  .extend({
    default: z.boolean().optional(),
  });
export const updateSystemVariableValue = createSystemVariableValue.partial();

// workaround for cirular reference - https://www.answeroverflow.com/m/1194395880523042936
const defaultValueIdFKConstraint: {
  columns: [AnyPgColumn<{ tableName: "system_variable" }>];
  foreignColumns: ColumnsWithTable<
    "system_variable",
    "system_variable_value",
    [AnyPgColumn<{ tableName: "system_variable" }>]
  >;
} = {
  columns: [systemVariable.defaultValueId],
  foreignColumns: [systemVariableValue.id],
};
