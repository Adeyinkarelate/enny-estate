CREATE TYPE "public"."property_status" AS ENUM('for_sale', 'for_rent', 'sold', 'rented');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('house', 'apartment', 'duplex', 'land', 'commercial');--> statement-breakpoint
CREATE TABLE "properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric(15, 2) NOT NULL,
	"location" text NOT NULL,
	"address" text NOT NULL,
	"bedrooms" integer DEFAULT 0 NOT NULL,
	"bathrooms" integer DEFAULT 0 NOT NULL,
	"area" numeric(10, 2) NOT NULL,
	"type" "property_type" NOT NULL,
	"status" "property_status" DEFAULT 'for_sale' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"images" text[] DEFAULT '{}' NOT NULL,
	"amenities" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
