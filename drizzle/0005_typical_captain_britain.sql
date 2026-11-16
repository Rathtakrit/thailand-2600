CREATE TABLE "reports" (
	"solution_id" text NOT NULL,
	"reporter_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reports_solution_id_reporter_id_pk" PRIMARY KEY("solution_id","reporter_id")
);
--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;