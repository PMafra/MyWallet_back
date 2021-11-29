CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"userId" integer NOT NULL,
	"token" TEXT NOT NULL,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "records" (
	"id" serial NOT NULL,
	"userId" integer NOT NULL,
	"records" TEXT,
	CONSTRAINT "records_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");
ALTER TABLE "records" ADD CONSTRAINT "records_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");