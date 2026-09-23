CREATE TABLE "NewsletterDelivery" (
  "id" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "subscriberId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "sentAt" TIMESTAMP(3),
  "error" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "NewsletterDelivery_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NewsletterDelivery_postId_subscriberId_key" ON "NewsletterDelivery"("postId", "subscriberId");
CREATE INDEX "NewsletterDelivery_status_createdAt_idx" ON "NewsletterDelivery"("status", "createdAt");
CREATE INDEX "NewsletterDelivery_sentAt_idx" ON "NewsletterDelivery"("sentAt");

ALTER TABLE "NewsletterDelivery" ADD CONSTRAINT "NewsletterDelivery_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NewsletterDelivery" ADD CONSTRAINT "NewsletterDelivery_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
