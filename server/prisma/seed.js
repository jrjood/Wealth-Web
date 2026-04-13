import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@wealthholding.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin User',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample projects
  const sampleProjects = [
    {
      title: 'Marina Bay Residences',
      location: 'Dubai Marina, UAE',
      type: 'Residential',
      status: 'Completed',
      description:
        'Luxury waterfront living with panoramic marina views. This stunning development offers world-class amenities and breathtaking views.',
      details:
        'Experience unparalleled luxury at Marina Bay Residences. Each unit features floor-to-ceiling windows, premium finishes, and smart home technology.',
      imageUrl:
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80',
      featured: true,
      amenities:
        'Infinity Pool\nFitness Center\nSpa & Wellness\nPrivate Beach\nValet Parking\n24/7 Concierge',
      specifications:
        'Smart Home Technology\nFloor-to-ceiling Windows\nPremium Finishes\nPrivate Balconies\n1-4 Bedrooms\n850-4,500 sqft',
    },
    {
      title: 'The Sky Penthouses',
      location: 'Downtown Dubai, UAE',
      type: 'Luxury Residential',
      status: 'Selling Now',
      description:
        'Exclusive penthouses in the heart of the city. Experience luxury living at its finest with unparalleled city views.',
      details:
        'The Sky Penthouses represent the pinnacle of luxury living. Each residence features private elevators, custom interiors, and breathtaking views of the Burj Khalifa.',
      imageUrl:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80',
      featured: true,
      amenities:
        'Rooftop Infinity Pool\nPrivate Cinema\nExecutive Lounge\nHelipad Access\n24/7 Security\nWine Cellar',
      specifications:
        'Private Elevator\nCustom Interiors\nHome Automation\n3-5 Bedrooms\n5,000-12,000 sqft\nPremium Appliances',
    },
    {
      title: 'Green Business Tower',
      location: 'Business Bay, UAE',
      type: 'Commercial',
      status: 'Under Construction',
      description:
        'Sustainable commercial spaces for modern businesses. Built with the latest green technology and eco-friendly materials.',
      details:
        'Green Business Tower sets a new standard for sustainable commercial development. LEED Platinum certified with cutting-edge technology and flexible office spaces.',
      imageUrl:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
      featured: false,
      amenities:
        'Conference Facilities\nBusiness Lounge\nGreen Spaces\nEV Charging Stations\nRetail Plaza\nCafeteria',
      specifications:
        'LEED Platinum Certified\nSmart Building Systems\nHigh-speed Connectivity\nFlexible Floor Plates\n500-50,000 sqft\nNatural Ventilation',
    },
  ];

  for (const project of sampleProjects) {
    await prisma.project.create({
      data: project,
    });
  }

  console.log('✅ Sample projects created');

  // Create sample jobs
  const sampleJobs = [
    {
      title: 'Senior Project Manager',
      department: 'Development',
      location: 'Dubai, UAE',
      type: 'Full-time',
      description:
        'Lead complex real estate development projects from conception to completion. We are looking for an experienced project manager with a proven track record.',
      published: true,
    },
    {
      title: 'Sales Executive',
      department: 'Sales',
      location: 'Abu Dhabi, UAE',
      type: 'Full-time',
      description:
        'Drive property sales and build relationships with high-net-worth clients. Excellent communication and negotiation skills required.',
      published: true,
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Dubai, UAE',
      type: 'Full-time',
      description:
        'Develop and execute marketing strategies for our premium developments. Experience in luxury real estate marketing preferred.',
      published: true,
    },
  ];

  for (const job of sampleJobs) {
    await prisma.job.create({
      data: job,
    });
  }

  console.log('✅ Sample jobs created');

  // ── Blog Posts ──────────────────────────────────────────────────────────────
  const blogPosts = [
    {
      title: 'The Future of Luxury Living in Dubai',
      slug: 'the-future-of-luxury-living-in-dubai',
      excerpt: 'Explore how Dubai is redefining ultra-luxury real estate with smart homes, sustainability, and world-class design.',
      content: `## A New Era of Luxury\n\nDubai continues to push the boundaries of what luxury living means. From AI-integrated smart homes to sustainable skyscrapers, the emirate is setting global benchmarks.\n\n### Smart Home Integration\n\nModern luxury residences now feature:\n- **Voice-controlled environments** that adapt to resident preferences\n- **IoT-connected appliances** for seamless daily routines\n- **Energy management systems** that reduce carbon footprints\n\n### Sustainability Meets Opulence\n\nThe latest developments incorporate:\n- Solar panels integrated into architectural design\n- Greywater recycling systems\n- Vertical gardens that purify air naturally\n\n## What This Means for Investors\n\nProperties that combine luxury with sustainability are seeing **15-20% higher appreciation** compared to traditional luxury developments. The trend is clear: the future is both premium and responsible.\n\n### Key Takeaways\n\n1. Smart home technology is now standard in premium developments\n2. Sustainability certifications like LEED are becoming major selling points\n3. Dubai's Vision 2030 is accelerating green luxury development`,
      coverImageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200',
      tags: JSON.stringify(['Luxury', 'Dubai', 'Smart Homes', 'Sustainability']),
      category: 'Market Insights',
      authorName: 'Sarah Al-Hassan',
      isFeatured: true,
      readingTime: 6,
      publishedAt: new Date('2026-02-20'),
    },
    {
      title: 'Investment Guide: Commercial Real Estate in 2026',
      slug: 'investment-guide-commercial-real-estate-2026',
      excerpt: 'A comprehensive guide to navigating commercial property investments in the current market landscape.',
      content: `## Why Commercial Real Estate in 2026?\n\nThe commercial property sector is experiencing a renaissance, driven by hybrid work models, e-commerce logistics demands, and urban revitalization projects.\n\n### Office Spaces Are Evolving\n\nForget the cubicle farms of the past. Today's office investments focus on:\n- **Flexible co-working hubs** with premium amenities\n- **Wellness-oriented workspaces** with natural light and green areas\n- **Tech-enabled conference centers** for hybrid meetings\n\n### Retail Reinvented\n\nPhysical retail isn't dead — it's transforming:\n- Experience-driven retail spaces\n- Mixed-use developments combining shopping, dining, and entertainment\n- Last-mile logistics facilities integrated into urban centers\n\n## Risk Assessment\n\nKey metrics to evaluate:\n\n| Metric | Target |\n|--------|--------|\n| Cap Rate | 5-8% |\n| Occupancy Rate | >90% |\n| Lease Duration | 5+ years |\n| Location Grade | A or B+ |\n\n### Final Thoughts\n\nCommercial real estate offers compelling returns when approached with proper due diligence and a long-term perspective.`,
      coverImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
      tags: JSON.stringify(['Investment', 'Commercial', 'Guide', '2026']),
      category: 'Investment',
      authorName: 'Ahmed Mansour',
      isFeatured: true,
      readingTime: 8,
      publishedAt: new Date('2026-02-15'),
    },
    {
      title: 'Interior Design Trends Shaping Premium Residences',
      slug: 'interior-design-trends-premium-residences',
      excerpt: 'From biophilic design to minimalist luxury, discover the trends transforming high-end living spaces.',
      content: `## The Art of Living\n\nInterior design in premium residences has evolved beyond mere aesthetics. It's about creating environments that enhance well-being, productivity, and emotional connection.\n\n### Biophilic Design\n\nBringing nature indoors is no longer optional in luxury spaces:\n- Living walls and indoor gardens\n- Natural materials: stone, wood, bamboo\n- Water features integrated into living areas\n- Maximized natural light through floor-to-ceiling glazing\n\n### Minimalist Luxury\n\nThe "less is more" philosophy takes on new meaning:\n- Custom furniture with clean lines and premium materials\n- Hidden storage solutions that eliminate visual clutter\n- Statement art pieces as focal points\n- Monochromatic palettes with textural variation\n\n### Technology Integration\n\nSeamless tech that disappears when not in use:\n- Motorized walls that transform spaces\n- Invisible speakers built into architecture\n- Smart glass that shifts from transparent to opaque\n\n## Color Palettes for 2026\n\n- **Warm neutrals:** Sand, clay, terracotta\n- **Ocean tones:** Deep navy, seafoam, pearl\n- **Earth luxe:** Forest green, walnut, brass`,
      coverImageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
      tags: JSON.stringify(['Design', 'Interior', 'Trends', 'Luxury']),
      category: 'Design',
      authorName: 'Layla Farouk',
      isFeatured: true,
      readingTime: 5,
      publishedAt: new Date('2026-02-10'),
    },
    {
      title: 'How to Choose the Right Neighborhood for Your Family',
      slug: 'how-to-choose-right-neighborhood-family',
      excerpt: 'Key factors every family should consider when selecting a neighborhood, from schools to community amenities.',
      content: `## Finding Your Family's Perfect Fit\n\nChoosing a neighborhood is one of the most important decisions a family can make. It affects daily commutes, children's education, social connections, and long-term property value.\n\n### Education Quality\n\nResearch these factors:\n- Proximity to top-rated schools\n- Availability of international curricula\n- After-school activity programs\n- School transportation options\n\n### Safety & Community\n\nA safe, connected community matters:\n- Crime statistics and trends\n- Gated community options\n- Active neighborhood associations\n- Community events and social programs\n\n### Amenities & Lifestyle\n\nConsider the daily quality of life:\n- Parks, playgrounds, and green spaces\n- Healthcare facilities nearby\n- Shopping and dining options\n- Sports and recreation centers\n\n### Future Development\n\nLook ahead:\n- Planned infrastructure projects\n- Upcoming commercial developments\n- Public transportation improvements\n- Zoning changes that may affect property values\n\n## Our Top Recommendations\n\nContact our team for personalized neighborhood recommendations based on your family's specific needs and budget.`,
      coverImageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200',
      tags: JSON.stringify(['Family', 'Neighborhood', 'Tips', 'Lifestyle']),
      category: 'Lifestyle',
      authorName: 'Omar Khalid',
      isFeatured: true,
      readingTime: 7,
      publishedAt: new Date('2026-02-05'),
    },
    {
      title: 'Understanding Property Valuation: A Beginner\'s Guide',
      slug: 'understanding-property-valuation-beginners-guide',
      excerpt: 'Learn how property valuation works, the methods appraisers use, and how to estimate a property\'s true market value.',
      content: `## What Is Property Valuation?\n\nProperty valuation is the process of determining the economic value of a real estate property. Whether you're buying, selling, or investing, understanding valuation is crucial.\n\n### The Three Main Approaches\n\n**1. Sales Comparison Approach**\nCompares the property to recently sold similar properties in the area. Adjustments are made for differences in:\n- Size and layout\n- Condition and age\n- Location and amenities\n- Market conditions at time of sale\n\n**2. Income Approach**\nUsed primarily for investment properties, this method calculates value based on:\n- Net Operating Income (NOI)\n- Capitalization Rate\n- Potential rental yield\n\n**3. Cost Approach**\nEstimates the cost to rebuild the property from scratch:\n- Land value + Construction costs\n- Minus depreciation\n- Plus any improvements\n\n### Factors That Affect Value\n\n- **Location:** The golden rule of real estate\n- **Market conditions:** Supply and demand dynamics\n- **Property condition:** Maintenance and upgrades\n- **Economic factors:** Interest rates, employment\n\n## Getting a Professional Valuation\n\nWhile online tools provide estimates, a professional appraisal is essential for:\n- Mortgage applications\n- Insurance purposes\n- Investment decisions\n- Estate planning`,
      coverImageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200',
      tags: JSON.stringify(['Valuation', 'Guide', 'Investment', 'Education']),
      category: 'Education',
      authorName: 'Fatima Al-Rashid',
      isFeatured: false,
      readingTime: 9,
      publishedAt: new Date('2026-01-28'),
    },
    {
      title: 'Sustainable Architecture: Building for Tomorrow',
      slug: 'sustainable-architecture-building-for-tomorrow',
      excerpt: 'How sustainable architecture is reshaping the construction industry and creating healthier living environments.',
      content: `## The Green Building Revolution\n\nSustainable architecture is no longer a niche — it's becoming the standard. With climate change driving policy and consumer preference, green buildings are the future.\n\n### Key Principles\n\n**Energy Efficiency**\n- Passive solar design\n- High-performance insulation\n- LED lighting systems\n- Smart HVAC controls\n\n**Water Conservation**\n- Rainwater harvesting\n- Low-flow fixtures\n- Drought-resistant landscaping\n- Greywater recycling\n\n**Material Selection**\n- Recycled and reclaimed materials\n- Locally sourced components\n- Low-VOC paints and finishes\n- Sustainable timber certifications\n\n### Certifications That Matter\n\n- **LEED** (Leadership in Energy and Environmental Design)\n- **BREEAM** (Building Research Establishment Environmental Assessment Method)\n- **Estidama** (Abu Dhabi's Pearl Rating System)\n- **WELL Building Standard** (focus on occupant health)\n\n### The Business Case\n\nGreen buildings offer:\n- 20-30% lower operating costs\n- Higher tenant retention rates\n- Premium rental yields\n- Future-proofed asset values\n\n## Looking Ahead\n\nNet-zero buildings are the next frontier. Expect to see more developments that generate as much energy as they consume.`,
      coverImageUrl: 'https://images.unsplash.com/photo-1518005068251-37900150dfca?auto=format&fit=crop&q=80&w=1200',
      tags: JSON.stringify(['Sustainability', 'Architecture', 'Green Building']),
      category: 'Industry',
      authorName: 'Hassan El-Sayed',
      isFeatured: false,
      readingTime: 7,
      publishedAt: new Date('2026-01-20'),
    },
  ];

  for (const post of blogPosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log('✅ Sample blog posts created');
  console.log('🎉 Database seeding completed successfully!');
  console.log(`\n📧 Admin Login:`);
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(
    `\n⚠️  Remember to change the admin password after first login!\n`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
