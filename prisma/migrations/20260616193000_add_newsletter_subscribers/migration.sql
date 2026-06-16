CREATE TABLE "NewsletterSubscriber" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'subscribed',
  "unsubscribeToken" TEXT NOT NULL,
  "source" TEXT NOT NULL DEFAULT 'homepage',
  "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "unsubscribedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");
CREATE UNIQUE INDEX "NewsletterSubscriber_unsubscribeToken_key" ON "NewsletterSubscriber"("unsubscribeToken");
CREATE INDEX "NewsletterSubscriber_status_idx" ON "NewsletterSubscriber"("status");
CREATE INDEX "NewsletterSubscriber_subscribedAt_idx" ON "NewsletterSubscriber"("subscribedAt");
