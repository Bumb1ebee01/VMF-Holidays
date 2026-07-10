import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, type Prisma } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { packages } from "../lib/data/packages";
import { destinations } from "../lib/data/destinations";
import { testimonials } from "../lib/data/testimonials";
import { posts } from "../lib/data/posts";
import { seedOffers, seedGallery } from "../lib/data/promos";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  for (const d of destinations) {
    // Guide content (/guides/[slug]) is sourced from this file, so it's refreshed on
    // every re-seed. Core fields (name/blurb/tags) stay create-only so admin edits
    // to them are never clobbered.
    const guideData = {
      guideIntro: d.guideIntro ?? null,
      guideBestTime: d.guideBestTime ?? null,
      guideThingsToDo: d.guideThingsToDo ?? [],
      guideTip: d.guideTip ?? null,
      guideGallery: d.guideGallery ?? [],
      guideSections: (d.guideSections ?? []) as unknown as Prisma.InputJsonValue,
    };
    await db.destination.upsert({
      where: { slug: d.slug },
      create: {
        slug: d.slug,
        name: d.name,
        country: d.country,
        state: d.state ?? null,
        region: d.region,
        heroImage: d.heroImage,
        fromPrice: d.fromPrice,
        blurb: d.blurb,
        tags: d.tags,
        ...guideData,
      },
      update: guideData,
    });
  }
  console.log(`Seeded ${destinations.length} destinations`);

  for (const p of packages) {
    await db.package.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        title: p.title,
        destination: p.destination,
        destinationSlug: p.destinationSlug,
        category: p.category,
        duration: p.duration,
        nights: p.nights,
        heroImage: p.heroImage,
        gallery: p.gallery,
        fromPrice: p.fromPrice,
        highlights: p.highlights,
        inclusions: p.inclusions,
        exclusions: p.exclusions,
        itinerary: p.itinerary as unknown as Prisma.InputJsonValue,
        featured: p.featured,
        badge: p.badge ?? null,
      },
      update: {},
    });
  }
  console.log(`Seeded ${packages.length} packages`);

  const testimonialCount = await db.testimonial.count();
  if (testimonialCount === 0) {
    await db.testimonial.createMany({
      data: testimonials.map((t) => ({
        name: t.name,
        location: t.location,
        trip: t.trip,
        rating: t.rating,
        quote: t.quote,
      })),
    });
    console.log(`Seeded ${testimonials.length} testimonials`);
  }

  for (const p of posts) {
    await db.post.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        coverImage: p.coverImage,
        author: p.author,
        tags: p.tags,
        published: true,
        publishedAt: new Date(),
      },
      update: {},
    });
  }
  console.log(`Seeded ${posts.length} blog posts`);

  const offerCount = await db.offer.count();
  if (offerCount === 0) {
    await db.offer.createMany({ data: seedOffers });
    console.log(`Seeded ${seedOffers.length} offers`);
  }

  const galleryCount = await db.galleryPhoto.count();
  if (galleryCount === 0) {
    await db.galleryPhoto.createMany({ data: seedGallery });
    console.log(`Seeded ${seedGallery.length} gallery photos`);
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "info@vmfholidays.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe@2026";
  const existing = await db.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    await db.user.create({
      data: {
        email: adminEmail,
        name: process.env.ADMIN_NAME ?? "VMF Admin",
        passwordHash: await bcrypt.hash(adminPassword, 12),
        role: "ADMIN",
      },
    });
    console.log(`Created admin user ${adminEmail} (password from ADMIN_PASSWORD env)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
