import {
  boolean,
  decimal,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Portfolios table
export const portfolios = pgTable("portfolios", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Cryptocurrencies table
export const cryptocurrencies = pgTable("cryptocurrencies", {
  id: text("id").primaryKey(), // e.g., 'bitcoin', 'ethereum'
  symbol: text("symbol").notNull(), // e.g., 'BTC', 'ETH'
  name: text("name").notNull(), // e.g., 'Bitcoin', 'Ethereum'
  image: text("image"),
  currentPrice: decimal("current_price", { precision: 20, scale: 8 }),
  marketCap: decimal("market_cap", { precision: 20, scale: 2 }),
  marketCapRank: text("market_cap_rank"),
  priceChange24h: decimal("price_change_24h", { precision: 10, scale: 8 }),
  priceChangePercentage24h: decimal("price_change_percentage_24h", {
    precision: 10,
    scale: 2,
  }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Portfolio holdings table
export const holdings = pgTable("holdings", {
  id: uuid("id").primaryKey().defaultRandom(),
  portfolioId: uuid("portfolio_id")
    .references(() => portfolios.id)
    .notNull(),
  cryptoId: text("crypto_id")
    .references(() => cryptocurrencies.id)
    .notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  averageBuyPrice: decimal("average_buy_price", { precision: 20, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  portfolioId: uuid("portfolio_id")
    .references(() => portfolios.id)
    .notNull(),
  cryptoId: text("crypto_id")
    .references(() => cryptocurrencies.id)
    .notNull(),
  type: text("type", { enum: ["buy", "sell"] }).notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  totalValue: decimal("total_value", { precision: 20, scale: 2 }).notNull(),
  notes: text("notes"),
  transactionDate: timestamp("transaction_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Donations table
export const donations = pgTable("donations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  email: text("email"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USDC").notNull(),
  status: text("status", { enum: ["pending", "completed", "failed"] })
    .default("pending")
    .notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertPortfolioSchema = createInsertSchema(portfolios);
export const selectPortfolioSchema = createSelectSchema(portfolios);
export const insertCryptocurrencySchema = createInsertSchema(cryptocurrencies);
export const selectCryptocurrencySchema = createSelectSchema(cryptocurrencies);
export const insertHoldingSchema = createInsertSchema(holdings);
export const selectHoldingSchema = createSelectSchema(holdings);
export const insertTransactionSchema = createInsertSchema(transactions);
export const selectTransactionSchema = createSelectSchema(transactions);
export const insertDonationSchema = createInsertSchema(donations);
export const selectDonationSchema = createSelectSchema(donations);

//Types
export type User = typeof users.$inferSelect;
export type Portfolio = typeof portfolios.$inferSelect;
export type Cryptocurrency = typeof cryptocurrencies.$inferSelect;
export type Holding = typeof holdings.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Donation = typeof donations.$inferSelect;
