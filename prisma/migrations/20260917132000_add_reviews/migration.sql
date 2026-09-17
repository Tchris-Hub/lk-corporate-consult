CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "role" TEXT,
    "company" TEXT,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Review_published_createdAt_idx" ON "Review"("published", "createdAt");
