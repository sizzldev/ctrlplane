ALTER TABLE "github_organization" DROP CONSTRAINT "github_organization_added_by_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "github_organization" ALTER COLUMN "added_by_user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "github_config_file" ADD COLUMN "connected" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "github_config_file" ADD COLUMN "branch" text DEFAULT 'main' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "github_organization" ADD CONSTRAINT "github_organization_added_by_user_id_github_user_id_fk" FOREIGN KEY ("added_by_user_id") REFERENCES "public"."github_user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "github_organization" DROP COLUMN IF EXISTS "branch";