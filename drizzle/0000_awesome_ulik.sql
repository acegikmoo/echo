CREATE TYPE "public"."MessageRole" AS ENUM('USER', 'ASSISTANT');--> statement-breakpoint
CREATE TYPE "public"."Type" AS ENUM('RESULT', 'ERROR');--> statement-breakpoint
CREATE TABLE "Fragment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"messageId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"sandboxUrl" text NOT NULL,
	"title" text NOT NULL,
	"files" json NOT NULL,
	CONSTRAINT "Fragment_messageId_unique" UNIQUE("messageId")
);
--> statement-breakpoint
CREATE TABLE "Message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"role" "MessageRole" NOT NULL,
	"type" "Type" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"projectId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Fragment" ADD CONSTRAINT "Fragment_messageId_Message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Message" ADD CONSTRAINT "Message_projectId_Project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE cascade ON UPDATE no action;