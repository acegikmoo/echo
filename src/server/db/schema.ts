import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  json,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const messageRoleEnum = pgEnum("MessageRole", ["USER", "ASSISTANT"]);
export const typeEnum = pgEnum("Type", ["RESULT", "ERROR"]);

export const projects = pgTable("Project", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  userId: text("userId").notNull(),
});

export const messages = pgTable("Message", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  role: messageRoleEnum("role").notNull(),
  type: typeEnum("type").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
});

export const fragments = pgTable("Fragment", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: uuid("messageId")
    .notNull()
    .unique()
    .references(() => messages.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  sandboxUrl: text("sandboxUrl").notNull(),
  title: text("title").notNull(),
  files: json("files").notNull(),
});

// Relations
export const projectsRelations = relations(projects, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  project: one(projects, {
    fields: [messages.projectId],
    references: [projects.id],
  }),
  fragment: one(fragments, {
    fields: [messages.id],
    references: [fragments.messageId],
  }),
}));

export const fragmentsRelations = relations(fragments, ({ one }) => ({
  message: one(messages, {
    fields: [fragments.messageId],
    references: [messages.id],
  }),
}));

export * from "./auth-schema";
