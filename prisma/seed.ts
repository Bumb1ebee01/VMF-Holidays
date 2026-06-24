import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, type Prisma } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { packages } from "../lib/data/packages";
import { destinations } from "../lib/data/destinations";
import { testimonials } from "../lib/data/testimonials";
import { posts } from "../lib/data/posts";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  for (const d of destinations) {
    await db.destination.upsert({
      where: { slug: d.slug },
      create: {
        slug: d.slug,
        name: d.name,
        country: d.country,
        region: d.region,
        heroImage: d.heroImage,
        fromPrice: d.fromPrice,
        blurb: d.blurb,
        tags: d.tags,
      },
      update: {},
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
