-- Wealth Holding manual seed for phpMyAdmin
-- Import this into your MySQL database after the tables have been created.
-- This script clears existing seeded content for the main app tables and re-inserts sample data.

START TRANSACTION;
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM `JobApplication`;
DELETE FROM `ContactMessage`;
DELETE FROM `PaymentPlan`;
DELETE FROM `NearbyLocation`;
DELETE FROM `GalleryImage`;
DELETE FROM `Post`;
DELETE FROM `Job`;
DELETE FROM `Project`;
DELETE FROM `Admin`;

INSERT INTO `Admin` (`id`, `email`, `password`, `name`, `updatedAt`) VALUES
('adm_wealth_001', 'admin@wealthholding-eg.com', '$2b$10$k7LyhR//EPOw6FleLux4SO3JVfRJrcBtaSr2jIY/qG8dga1t011VW', 'Wealth Holding Admin', NOW());

INSERT INTO `Project` (
  `id`,
  `title`,
  `location`,
  `type`,
  `status`,
  `description`,
  `details`,
  `imageUrl`,
  `projectLogoUrl`,
  `masterPlanImage`,
  `videoUrl`,
  `locationImage`,
  `locationMapUrl`,
  `brochureUrl`,
  `featured`,
  `amenities`,
  `specifications`,
  `updatedAt`
) VALUES
(
  'prj_once_mall',
  'Once Mall',
  '6th of October, Cairo, Egypt',
  'Commercial',
  'Selling Now',
  'A next-generation mixed-use destination designed for retail, dining, and lifestyle experiences in the heart of west Cairo.',
  'Once Mall blends flagship retail, flexible office inventory, entertainment anchors, and a polished public realm. The project is positioned to serve both daily footfall and destination-driven visitors with layered circulation and strong visibility from the main approach roads.',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600',
  '/emblem.png',
  'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=1600',
  NULL,
  'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600',
  'https://www.google.com/maps/search/?api=1&query=Once%20Mall%206th%20of%20October%20Egypt',
  NULL,
  1,
  'Double-height retail frontage\nUnderground parking\nFood hall zone\nCinema-ready entertainment floor\nIntegrated digital signage\n24/7 facility management',
  'Retail units from 45 sqm\nAdministrative offices from 60 sqm\nSmart access systems\nOutdoor plaza activation\nHigh-efficiency HVAC\nPremium facade lighting',
  NOW()
),
(
  'prj_jeval_business_complex',
  'Jeval Business Complex',
  'New Cairo, Egypt',
  'Commercial',
  'Under Construction',
  'A premium business campus that combines boutique office space, curated retail, and hospitality-grade common areas for modern companies.',
  'Jeval Business Complex is planned as a high-image destination for brands and professional firms that need accessibility, premium finishes, and a business-first environment. The layout prioritizes visibility, efficient circulation, and flexible unit combinations.',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1600',
  '/emblem.png',
  'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&q=80&w=1600',
  NULL,
  'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&q=80&w=1600',
  'https://www.google.com/maps/search/?api=1&query=Jeval%20Business%20Complex%20New%20Cairo%20Egypt',
  NULL,
  1,
  'Concierge reception\nBoardroom suites\nBusiness lounge\nBranded meeting rooms\nValet-ready drop-off\nRoof terrace',
  'Office modules from 55 sqm\nTriple-height lobby\nBackup power support\nTouchless access\nFiber-ready infrastructure\nFacade-integrated shading',
  NOW()
),
(
  'prj_citra_residence',
  'Citra Residence',
  'Sheikh Zayed, Egypt',
  'Luxury Residential',
  'Selling Now',
  'A refined residential address centered on landscaped living, low-density planning, and family-oriented amenities.',
  'Citra Residence brings together private apartment buildings, lush open spaces, and a quiet neighborhood rhythm. The master plan emphasizes walkability, layered greenery, and amenity pockets that support both day-to-day comfort and long-term value.',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600',
  '/emblem.png',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1600',
  NULL,
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1600',
  'https://www.google.com/maps/search/?api=1&query=Citra%20Residence%20Sheikh%20Zayed%20Egypt',
  NULL,
  0,
  'Clubhouse\nKids play areas\nLagoon-style pool\nJogging track\nYoga lawn\nCommunity retail strip',
  'Apartments from 120 sqm\nDuplex options\nUnderground parking\nSmart home ready\nPrivate terraces\nLow-density planning',
  NOW()
);

INSERT INTO `GalleryImage` (`id`, `projectId`, `imageUrl`, `title`, `sortOrder`, `updatedAt`) VALUES
('gal_once_001', 'prj_once_mall', 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&q=80&w=1400', 'Retail Atrium', 0, NOW()),
('gal_once_002', 'prj_once_mall', 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&q=80&w=1400', 'Dining Zone', 1, NOW()),
('gal_once_003', 'prj_once_mall', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1400', 'Main Promenade', 2, NOW()),
('gal_once_004', 'prj_once_mall', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1400', 'Office Lounge', 3, NOW()),
('gal_jeval_001', 'prj_jeval_business_complex', 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80&w=1400', 'Executive Workspace', 0, NOW()),
('gal_jeval_002', 'prj_jeval_business_complex', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1400', 'Business Lobby', 1, NOW()),
('gal_jeval_003', 'prj_jeval_business_complex', 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&q=80&w=1400', 'Meeting Suite', 2, NOW()),
('gal_jeval_004', 'prj_jeval_business_complex', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1400', 'Open Office', 3, NOW()),
('gal_citra_001', 'prj_citra_residence', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1400', 'Living Room', 0, NOW()),
('gal_citra_002', 'prj_citra_residence', 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&q=80&w=1400', 'Resident Lounge', 1, NOW()),
('gal_citra_003', 'prj_citra_residence', 'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&q=80&w=1400', 'Bedroom Suite', 2, NOW()),
('gal_citra_004', 'prj_citra_residence', 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&q=80&w=1400', 'Facade View', 3, NOW());

INSERT INTO `NearbyLocation` (`id`, `projectId`, `name`, `distance`, `sortOrder`, `updatedAt`) VALUES
('loc_once_001', 'prj_once_mall', 'Mall of Arabia', '2 min', 0, NOW()),
('loc_once_002', 'prj_once_mall', 'Juhayna Square', '4 min', 1, NOW()),
('loc_once_003', 'prj_once_mall', '26th of July Corridor', '3 min', 2, NOW()),
('loc_once_004', 'prj_once_mall', 'Sphinx Airport', '18 min', 3, NOW()),
('loc_jeval_001', 'prj_jeval_business_complex', 'South 90 Road', '2 min', 0, NOW()),
('loc_jeval_002', 'prj_jeval_business_complex', 'American University in Cairo', '7 min', 1, NOW()),
('loc_jeval_003', 'prj_jeval_business_complex', 'Cairo Festival City', '10 min', 2, NOW()),
('loc_jeval_004', 'prj_jeval_business_complex', 'Ring Road', '12 min', 3, NOW()),
('loc_citra_001', 'prj_citra_residence', 'Arkan Plaza', '8 min', 0, NOW()),
('loc_citra_002', 'prj_citra_residence', 'Beverly Hills', '6 min', 1, NOW()),
('loc_citra_003', 'prj_citra_residence', 'Smart Village', '15 min', 2, NOW()),
('loc_citra_004', 'prj_citra_residence', 'Alex Desert Road', '5 min', 3, NOW());

INSERT INTO `PaymentPlan` (`id`, `projectId`, `downPayment`, `installments`, `startingPrice`, `updatedAt`) VALUES
('pay_once_001', 'prj_once_mall', '10%', '6 Years', '3,500,000 EGP', NOW()),
('pay_jeval_001', 'prj_jeval_business_complex', '15%', '7 Years', '4,250,000 EGP', NOW()),
('pay_citra_001', 'prj_citra_residence', '5%', '8 Years', '5,900,000 EGP', NOW());

INSERT INTO `ContactMessage` (`id`, `name`, `email`, `phone`, `projectId`, `projectTitle`, `message`, `createdAt`, `updatedAt`) VALUES
('cm_wealth_001', 'Nadia Hassan', 'nadia.hassan@example.com', '+20 10 1234 5678', 'prj_once_mall', 'Once Mall', 'I would like to know more about retail availability and delivery timelines for Once Mall.', NOW(), NOW()),
('cm_wealth_002', 'Karim El-Toukhy', 'karim.eltoukhy@example.com', '+20 11 2345 6789', 'prj_citra_residence', 'Citra Residence', 'I am interested in family apartments and payment plans for Citra Residence.', NOW(), NOW()),
('cm_wealth_003', 'Dina Saleh', 'dina.saleh@example.com', '+20 12 3456 7890', 'prj_jeval_business_complex', 'Jeval Business Complex', 'Please share office unit sizes, floor plans, and commercial pricing for Jeval Business Complex.', NOW(), NOW());

INSERT INTO `Job` (`id`, `title`, `department`, `location`, `type`, `description`, `published`, `updatedAt`) VALUES
('job_wealth_001', 'Senior Project Manager', 'Development', 'New Cairo, Cairo, Egypt', 'Full-time', 'Lead real estate development projects from planning to handover across Wealth Holding communities in Egypt. Strong delivery, coordination, and budget control experience is required.', 1, NOW()),
('job_wealth_002', 'Sales Executive', 'Sales', '6th of October, Giza, Egypt', 'Full-time', 'Drive property sales, support client visits, and build long-term relationships with buyers interested in Wealth Holding projects across Egypt.', 1, NOW()),
('job_wealth_003', 'Marketing Manager', 'Marketing', 'Cairo, Egypt', 'Full-time', 'Develop and execute marketing strategies for Egyptian residential and commercial developments. Experience in premium real estate marketing is preferred.', 1, NOW());

INSERT INTO `JobApplication` (`id`, `jobId`, `jobTitle`, `jobDepartment`, `jobLocation`, `jobType`, `name`, `email`, `phone`, `message`, `cvStoredName`, `cvOriginalName`, `cvMimeType`, `cvSize`, `status`, `createdAt`, `updatedAt`) VALUES
('app_seed_001', 'job_wealth_001', 'Senior Project Manager', 'Development', 'New Cairo, Cairo, Egypt', 'Full-time', 'Omar Hassan', 'omar.hassan@example.com', '+20 10 5555 0101', 'I have led mixed-use project delivery and would like to join Wealth Holding.', 'seed-cv-senior-project-manager.pdf', 'Omar-Hassan-CV.pdf', 'application/pdf', 184320, 'shortlisted', NOW(), NOW()),
('app_seed_002', 'job_wealth_002', 'Sales Executive', 'Sales', '6th of October, Giza, Egypt', 'Full-time', 'Mona Adel', 'mona.adel@example.com', '+20 11 5555 0202', 'I am focused on premium property sales and client relationship management.', 'seed-cv-sales-executive.pdf', 'Mona-Adel-CV.pdf', 'application/pdf', 176128, 'in_review', NOW(), NOW()),
('app_seed_003', 'job_wealth_003', 'Marketing Manager', 'Marketing', 'Cairo, Egypt', 'Full-time', 'Hassan El-Sayed', 'hassan.elsayed@example.com', '+20 12 5555 0303', 'I can help grow awareness for Wealth Holding projects across digital and offline channels.', 'seed-cv-marketing-manager.pdf', 'Hassan-El-Sayed-CV.pdf', 'application/pdf', 193536, 'new', NOW(), NOW());

INSERT INTO `Post` (`id`, `title`, `slug`, `excerpt`, `content`, `coverImageUrl`, `tags`, `category`, `authorName`, `publishedAt`, `isFeatured`, `readingTime`, `updatedAt`) VALUES
('pst_wealth_001', 'Why New Cairo Remains a Strong Investment Corridor in 2026', 'why-new-cairo-remains-a-strong-investment-corridor-in-2026', 'Infrastructure, schools, and business districts keep driving demand in East Cairo.', '## East Cairo Momentum\n\nNew Cairo continues to attract buyers because it combines education, employment, retail, and transport access.\n\n### Key drivers\n\n- Strong road connections\n- Mixed-use growth\n- Family-focused communities\n- Stable demand for premium units\n\n### Investor takeaway\n\nProperties near major roads and established services often keep strong resale and rental demand.', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200', '["Egypt","New Cairo","Investment","Market Trends"]', 'Market Insights', 'Mona El-Sayed', '2026-03-10 00:00:00', 1, 6, NOW()),
('pst_wealth_002', 'Commercial Real Estate Trends Shaping West Cairo', 'commercial-real-estate-trends-shaping-west-cairo', 'West Cairo is expanding with retail, office, and mixed-use demand across key corridors.', '## West Cairo Expansion\n\n6th of October and Sheikh Zayed continue to attract brands and businesses looking for visibility and easy access.\n\n### What tenants want\n\n- Clear frontage\n- Flexible unit sizes\n- Parking capacity\n- Strong service infrastructure\n\n### For developers\n\nProjects that combine retail, offices, and daily convenience tend to perform best in mature neighborhoods.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200', '["West Cairo","Commercial","Retail","Office"]', 'Investment', 'Ahmed Mansour', '2026-03-02 00:00:00', 1, 7, NOW()),
('pst_wealth_003', 'Interior Design Trends for Premium Egyptian Homes', 'interior-design-trends-for-premium-egyptian-homes', 'Warm palettes, natural materials, and brighter daylight are shaping premium home design in Egypt.', '## Design Direction\n\nPremium homes in Egypt are moving toward lighter interiors, clean lines, and more natural textures.\n\n### Popular choices\n\n- Warm neutrals\n- Stone and wood finishes\n- Open living plans\n- Smart home systems\n\n### Why it matters\n\nGood design improves comfort and supports long-term value.', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200', '["Design","Interiors","Luxury","Homes"]', 'Design', 'Layla Farouk', '2026-02-24 00:00:00', 1, 5, NOW()),
('pst_wealth_004', 'How to Choose the Right Neighborhood for Your Family in Cairo', 'how-to-choose-the-right-neighborhood-for-your-family-in-cairo', 'Schools, access, and community amenities remain the most important family buying factors.', '## Finding the Right Fit\n\nChoosing between Cairo communities means balancing lifestyle, commute, and long-term value.\n\n### Consider these factors\n\n- School access\n- Healthcare and retail\n- Road connectivity\n- Community layout\n\n### Good family communities\n\nNeighborhoods with strong services and open spaces often support comfortable everyday living.', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200', '["Family","Cairo","Lifestyle","Community"]', 'Lifestyle', 'Omar Khalid', '2026-02-18 00:00:00', 1, 7, NOW()),
('pst_wealth_005', 'Understanding Property Valuation in the Egyptian Market', 'understanding-property-valuation-in-the-egyptian-market', 'Learn the main methods used to estimate property value in Egypt and how to compare opportunities.', '## What Valuation Means\n\nProperty value is shaped by location, unit size, finishing, market demand, and payment terms.\n\n### Main methods\n\n- Sales comparison\n- Income approach\n- Cost approach\n\n### Practical advice\n\nCompare similar units, review the developer profile, and study the community around the project.', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200', '["Valuation","Guide","Investment","Egypt"]', 'Education', 'Fatima Al-Rashid', '2026-02-10 00:00:00', 0, 8, NOW()),
('pst_wealth_006', 'Why Sustainable Architecture Matters for Egypt', 'why-sustainable-architecture-matters-for-egypt', 'Energy-efficient design and better materials are becoming standard in new Egyptian developments.', '## Building for Tomorrow\n\nSustainable design helps reduce operating costs and improves day-to-day comfort.\n\n### Core principles\n\n- Passive cooling\n- Better insulation\n- Efficient lighting\n- Water saving systems\n\n### Why it matters\n\nProjects that plan for energy and water efficiency are better prepared for long-term growth in Egypt.', 'https://images.unsplash.com/photo-1518005068251-37900150dfca?auto=format&fit=crop&q=80&w=1200', '["Sustainability","Architecture","Egypt","Development"]', 'Industry', 'Hassan El-Sayed', '2026-01-30 00:00:00', 0, 6, NOW());

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
