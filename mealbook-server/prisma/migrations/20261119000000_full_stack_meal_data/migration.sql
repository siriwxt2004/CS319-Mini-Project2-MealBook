ALTER TABLE "Meal"
ADD COLUMN "sourceId" TEXT,
ADD COLUMN "area" TEXT,
ADD COLUMN "tags" TEXT;

CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

INSERT INTO "Category" ("name")
SELECT DISTINCT "category" FROM "Meal"
WHERE "category" IS NOT NULL
ON CONFLICT ("name") DO NOTHING;

ALTER TABLE "Meal" ADD COLUMN "categoryId" INTEGER;

UPDATE "Meal"
SET "categoryId" = "Category"."id"
FROM "Category"
WHERE "Meal"."category" = "Category"."name";

ALTER TABLE "Meal" DROP COLUMN "ingredients";
ALTER TABLE "Meal" DROP COLUMN "category";

CREATE UNIQUE INDEX "Meal_sourceId_key" ON "Meal"("sourceId");
CREATE INDEX "Meal_categoryId_idx" ON "Meal"("categoryId");

ALTER TABLE "Meal"
ADD CONSTRAINT "Meal_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "MealIngredient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "measure" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "mealId" INTEGER NOT NULL,

    CONSTRAINT "MealIngredient_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MealIngredient_mealId_sortOrder_key" ON "MealIngredient"("mealId", "sortOrder");
CREATE INDEX "MealIngredient_mealId_idx" ON "MealIngredient"("mealId");

ALTER TABLE "MealIngredient"
ADD CONSTRAINT "MealIngredient_mealId_fkey"
FOREIGN KEY ("mealId") REFERENCES "Meal"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "MealPlan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mealId" INTEGER NOT NULL,
    "day" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealPlan_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MealPlan_userId_day_key" ON "MealPlan"("userId", "day");
CREATE INDEX "MealPlan_mealId_idx" ON "MealPlan"("mealId");

ALTER TABLE "MealPlan"
ADD CONSTRAINT "MealPlan_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MealPlan"
ADD CONSTRAINT "MealPlan_mealId_fkey"
FOREIGN KEY ("mealId") REFERENCES "Meal"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
