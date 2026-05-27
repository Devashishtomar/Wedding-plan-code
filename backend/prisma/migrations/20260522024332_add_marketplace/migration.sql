-- CreateEnum
CREATE TYPE "VendorCategory" AS ENUM ('VENUE', 'PHOTOGRAPHER', 'MAKEUP_ARTIST', 'CATERER', 'DECORATOR', 'PLANNER', 'MEHNDI_ARTIST');

-- CreateEnum
CREATE TYPE "PricingUnit" AS ENUM ('PER_DAY', 'PER_EVENT', 'PER_PLATE', 'PACKAGE');

-- CreateEnum
CREATE TYPE "VenueType" AS ENUM ('BANQUET', 'HOTEL', 'LAWN', 'RESORT');

-- CreateEnum
CREATE TYPE "PolicyType" AS ENUM ('IN_HOUSE', 'EXTERNAL_ALLOWED', 'NOT_ALLOWED');

-- CreateEnum
CREATE TYPE "PricingModel" AS ENUM ('FIXED', 'PERCENTAGE');

-- AlterTable
ALTER TABLE "HotelRoom" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SeatingTable" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "VendorCategory" NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "pincode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "whatsapp" TEXT,
    "website" TEXT,
    "images" TEXT[],
    "videos" TEXT[],
    "startingPrice" INTEGER,
    "pricingUnit" "PricingUnit",
    "avgRating" DOUBLE PRECISION DEFAULT 0,
    "totalReviews" INTEGER DEFAULT 0,
    "externalRating" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "services" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueDetails" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "venueType" "VenueType" NOT NULL,
    "hallCapacity" INTEGER,
    "lawnCapacity" INTEGER,
    "roomsAvailable" INTEGER,
    "bridalSuite" BOOLEAN NOT NULL DEFAULT false,
    "groomRoom" BOOLEAN NOT NULL DEFAULT false,
    "amenities" TEXT[],
    "parkingAvailable" BOOLEAN NOT NULL DEFAULT false,
    "parkingCapacity" INTEGER,
    "cateringPolicy" "PolicyType" NOT NULL,
    "alcoholPolicy" "PolicyType" NOT NULL,
    "decorationPolicy" "PolicyType" NOT NULL,
    "starRating" INTEGER,
    "peakSeasonPrice" INTEGER,
    "offSeasonPrice" INTEGER,

    CONSTRAINT "VenueDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MakeupArtistDetails" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "servicesOffered" TEXT[],
    "experienceYears" INTEGER NOT NULL,
    "travels" BOOLEAN NOT NULL DEFAULT false,
    "travelCost" INTEGER,
    "bridalPrice" INTEGER,
    "partyPrice" INTEGER,
    "brandsUsed" TEXT[],
    "trialAvailable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MakeupArtistDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotographerDetails" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "services" TEXT[],
    "experienceYears" INTEGER NOT NULL,
    "deliveryDays" INTEGER NOT NULL,
    "teamSize" INTEGER,
    "equipment" TEXT[],
    "pricePerDay" INTEGER,
    "fullPackagePrice" INTEGER,
    "albumIncluded" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PhotographerDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatererDetails" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "cuisines" TEXT[],
    "vegOnly" BOOLEAN NOT NULL DEFAULT false,
    "vegPricePerPlate" INTEGER,
    "nonVegPricePerPlate" INTEGER,
    "minGuestCount" INTEGER,
    "services" TEXT[],

    CONSTRAINT "CatererDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecoratorDetails" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "decorationTypes" TEXT[],
    "experienceYears" INTEGER NOT NULL,
    "basicPrice" INTEGER,
    "premiumPrice" INTEGER,
    "materialsUsed" TEXT[],
    "customizable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DecoratorDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannerDetails" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "services" TEXT[],
    "experienceYears" INTEGER NOT NULL,
    "eventsManaged" INTEGER NOT NULL,
    "teamSize" INTEGER,
    "pricingModel" "PricingModel" NOT NULL,

    CONSTRAINT "PlannerDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MehndiArtistDetails" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "styles" TEXT[],
    "experienceYears" INTEGER NOT NULL,
    "bridalPrice" INTEGER,
    "pricePerHand" INTEGER,
    "travels" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MehndiArtistDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortlistedVendor" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "eventId" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'SHARED',
    "vendorId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShortlistedVendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorReview" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VendorReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vendor_city_idx" ON "Vendor"("city");

-- CreateIndex
CREATE INDEX "Vendor_category_idx" ON "Vendor"("category");

-- CreateIndex
CREATE INDEX "Vendor_startingPrice_idx" ON "Vendor"("startingPrice");

-- CreateIndex
CREATE INDEX "Vendor_avgRating_idx" ON "Vendor"("avgRating");

-- CreateIndex
CREATE UNIQUE INDEX "VenueDetails_vendorId_key" ON "VenueDetails"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "MakeupArtistDetails_vendorId_key" ON "MakeupArtistDetails"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "PhotographerDetails_vendorId_key" ON "PhotographerDetails"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "CatererDetails_vendorId_key" ON "CatererDetails"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "DecoratorDetails_vendorId_key" ON "DecoratorDetails"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "PlannerDetails_vendorId_key" ON "PlannerDetails"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "MehndiArtistDetails_vendorId_key" ON "MehndiArtistDetails"("vendorId");

-- CreateIndex
CREATE INDEX "ShortlistedVendor_weddingId_idx" ON "ShortlistedVendor"("weddingId");

-- CreateIndex
CREATE INDEX "ShortlistedVendor_eventId_idx" ON "ShortlistedVendor"("eventId");

-- CreateIndex
CREATE INDEX "ShortlistedVendor_vendorId_idx" ON "ShortlistedVendor"("vendorId");

-- CreateIndex
CREATE INDEX "ShortlistedVendor_weddingId_visibility_eventId_idx" ON "ShortlistedVendor"("weddingId", "visibility", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "ShortlistedVendor_weddingId_eventId_vendorId_visibility_key" ON "ShortlistedVendor"("weddingId", "eventId", "vendorId", "visibility");

-- CreateIndex
CREATE INDEX "VendorReview_vendorId_idx" ON "VendorReview"("vendorId");

-- CreateIndex
CREATE INDEX "VendorReview_userId_idx" ON "VendorReview"("userId");

-- AddForeignKey
ALTER TABLE "VenueDetails" ADD CONSTRAINT "VenueDetails_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MakeupArtistDetails" ADD CONSTRAINT "MakeupArtistDetails_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotographerDetails" ADD CONSTRAINT "PhotographerDetails_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatererDetails" ADD CONSTRAINT "CatererDetails_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecoratorDetails" ADD CONSTRAINT "DecoratorDetails_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannerDetails" ADD CONSTRAINT "PlannerDetails_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MehndiArtistDetails" ADD CONSTRAINT "MehndiArtistDetails_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortlistedVendor" ADD CONSTRAINT "ShortlistedVendor_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortlistedVendor" ADD CONSTRAINT "ShortlistedVendor_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortlistedVendor" ADD CONSTRAINT "ShortlistedVendor_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortlistedVendor" ADD CONSTRAINT "ShortlistedVendor_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorReview" ADD CONSTRAINT "VendorReview_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorReview" ADD CONSTRAINT "VendorReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
