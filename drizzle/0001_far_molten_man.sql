CREATE TABLE "ai_calls" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"kind" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"user_id" text NOT NULL,
	"solution_id" text NOT NULL,
	"scores" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_user_id_solution_id_pk" PRIMARY KEY("user_id","solution_id")
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"kind" text NOT NULL,
	"ref_id" text NOT NULL,
	"lang" text NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "translations_kind_ref_id_lang_pk" PRIMARY KEY("kind","ref_id","lang")
);
--> statement-breakpoint
ALTER TABLE "solutions" ADD COLUMN "ai_status" text DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "solutions" ADD COLUMN "ai" jsonb;--> statement-breakpoint
ALTER TABLE "solutions" ADD COLUMN "ai_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ai_calls" ADD CONSTRAINT "ai_calls_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_calls_user_kind" ON "ai_calls" USING btree ("user_id","kind","created_at");