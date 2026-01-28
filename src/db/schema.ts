import { pgTable, uuid, text, timestamp, boolean, pgEnum, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- ENUMS ---
// Added 'completed' to the enum list
export const statusEnum = pgEnum('status', ['confirmed', 'cancelled', 'noshow', 'completed']);

// --- TABLES ---

export const businesses = pgTable('businesses', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: text('owner_id').notNull().unique(), // Clerk User ID
  name: text('name').notNull(),
  googleReviewLink: text('google_review_link'),
  timezone: text('timezone').default('UTC'),
  whatsappApiKey: text('whatsapp_api_key'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').references(() => businesses.id).notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  createdAt: timestamp('created_at').defaultNow(),
  // --- WIN-BACK ENGINE COLUMNS ---
  lastVisitAt: timestamp('last_visit_at'),
  marketingOptIn: boolean('marketing_opt_in').default(true),
  lastWinbackSentAt: timestamp('last_winback_sent_at'),
});

export const appointments = pgTable('appointments', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').references(() => businesses.id).notNull(),
  customerId: uuid('customer_id').references(() => customers.id).notNull(),
  startTime: timestamp('start_time').notNull(),
  status: statusEnum('status').default('confirmed'),
  reminderSent: boolean('reminder_sent').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const visits = pgTable('visits', {
  id: uuid('id').primaryKey().defaultRandom(),
  appointmentId: uuid('appointment_id').references(() => appointments.id).notNull(),
  rating: integer('rating'),
  feedback: text('feedback'),
  createdAt: timestamp('created_at').defaultNow(),
});

// --- RELATIONSHIPS (for easier querying) ---

export const businessesRelations = relations(businesses, ({ many }) => ({
  customers: many(customers),
  appointments: many(appointments),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  business: one(businesses, {
    fields: [customers.businessId],
    references: [businesses.id],
  }),
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  business: one(businesses, {
    fields: [appointments.businessId],
    references: [businesses.id],
  }),
  customer: one(customers, {
    fields: [appointments.customerId],
    references: [customers.id],
  }),
}));

export const visitsRelations = relations(visits, ({ one }) => ({
  appointment: one(appointments, {
    fields: [visits.appointmentId],
    references: [appointments.id],
  }),
}));
