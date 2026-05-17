const { sequelize, User, Category, Job, Booking } = require('./src/models');

async function seed() {
  console.log('Starting Moseva Tikiri Odisha demo seeder...');

  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // 1. Fetch Categories by Name
    const homeRepairCat = await Category.findOne({ where: { name: 'Home Repair' } });
    const cleaningCat = await Category.findOne({ where: { name: 'Cleaning' } });
    const techRemoteCat = await Category.findOne({ where: { name: 'Tech & Remote' } });
    const logisticsCat = await Category.findOne({ where: { name: 'Logistics' } });

    if (!homeRepairCat || !cleaningCat || !techRemoteCat || !logisticsCat) {
      throw new Error('Default categories not found. Please start the backend once to auto-sync and seed default categories.');
    }

    // 2. Create Users (2 Patrons, 2 Service Partners, 2 Stewards)
    console.log('Seeding demo users...');
    
    // Clear existing dummy users if they exist to avoid duplicate key errors
    await User.destroy({ where: { email: [
      'aarav@moseva.in', 'nisha@moseva.in', 
      'rajesh@moseva.in', 'sunita@moseva.in', 
      'devendra@moseva.in', 'priya@moseva.in'
    ]}});

    // Patrons (hiring clients)
    const patron1 = await User.create({
      username: 'aarav_patnaik',
      email: 'aarav@moseva.in',
      passwordHash: 'password123', // Will be auto-hashed by User model beforeCreate hook
      role: 'patron',
      firstName: 'Aarav',
      lastName: 'Patnaik',
      isVerified: true,
      phone: '9876543210',
      bio: 'Coffee planter and farm owner located in Tikiri, looking for handymen and transport support.'
    });

    const patron2 = await User.create({
      username: 'nisha_tripathy',
      email: 'nisha@moseva.in',
      passwordHash: 'password123',
      role: 'patron',
      firstName: 'Nisha',
      lastName: 'Tripathy',
      isVerified: true,
      phone: '9876543211',
      bio: 'School headmaster in Kashipur town center, looking for cleaning and academic services.'
    });

    // Service Partners (taskers/contractors)
    const partner1 = await User.create({
      username: 'rajesh_naik',
      email: 'rajesh@moseva.in',
      passwordHash: 'password123',
      role: 'service_partner',
      firstName: 'Rajesh',
      lastName: 'Naik',
      isVerified: true,
      phone: '9876543212',
      bio: 'Certified electrician and water pump mechanic from Sunger village. Expert in motor rewinding.'
    });

    const partner2 = await User.create({
      username: 'sunita_majhi',
      email: 'sunita@moseva.in',
      passwordHash: 'password123',
      role: 'service_partner',
      firstName: 'Sunita',
      lastName: 'Majhi',
      isVerified: true,
      phone: '9876543213',
      bio: 'Experienced in household support, sanitization, deep cleaning and festival setups. Located in Hadiguda.'
    });

    // Stewards (moderators)
    const steward1 = await User.create({
      username: 'devendra_mohanty',
      email: 'devendra@moseva.in',
      passwordHash: 'password123',
      role: 'steward',
      firstName: 'Devendra',
      lastName: 'Mohanty',
      isVerified: true,
      phone: '9876543214',
      bio: 'Operations supervisor in Rayagada district backoffice, verifying local listings.'
    });

    const steward2 = await User.create({
      username: 'priya_dash',
      email: 'priya@moseva.in',
      passwordHash: 'password123',
      role: 'steward',
      firstName: 'Priya',
      lastName: 'Dash',
      isVerified: true,
      phone: '9876543215',
      bio: 'Regional moderator centered in Tikiri, reviewing service partnership applications.'
    });

    console.log('Demo users created successfully.');

    // 3. Create Jobs
    console.log('Seeding active job listings...');

    const job1 = await Job.create({
      patronId: patron1.userId,
      categoryId: homeRepairCat.categoryId,
      title: 'Water Pump Installation & Electrical Fix',
      description: 'Need assistance fixing the agricultural water pump motor in Sunger village. The pump trips the breaker immediately on turning on. Requires toolkits and electrical multimeters.',
      budgetMin: 800.00,
      budgetMax: 1200.00,
      deadline: '2026-06-15',
      location: 'Sunger, Rayagada',
      locationType: 'onsite',
      status: 'approved', // Approved so it appears in the marketplace instantly
      priority: 'high',
      viewedCount: 14
    });

    const job2 = await Job.create({
      patronId: patron1.userId,
      categoryId: logisticsCat.categoryId,
      title: 'Transporting Paddy Harvest Bags to Tikiri Mandi',
      description: 'Require a partner with a small tractor or trolley to transport 25 bags of paddy harvest from Podapadi farm fields to the Tikiri cooperative procurement center (Mandi). Distance is approximately 8km.',
      budgetMin: 2000.00,
      budgetMax: 2500.00,
      deadline: '2026-06-12',
      location: 'Podapadi - Tikiri, Rayagada',
      locationType: 'onsite',
      status: 'approved',
      priority: 'medium',
      viewedCount: 9
    });

    const job3 = await Job.create({
      patronId: patron2.userId,
      categoryId: cleaningCat.categoryId,
      title: 'Deep House Cleaning before Raja Festival',
      description: 'Looking for home cleaning support before the upcoming Raja Parba festival. Includes dusting high walls, kitchen oil stain removal, courtyard cleaning, and washing windows in Kashipur town center.',
      budgetMin: 1200.00,
      budgetMax: 1500.00,
      deadline: '2026-06-18',
      location: 'Kashipur, Rayagada',
      locationType: 'onsite',
      status: 'approved',
      priority: 'medium',
      viewedCount: 18
    });

    console.log('Active job listings created successfully.');

    // 4. Create Active Bids (Bookings)
    console.log('Seeding proposal bids...');

    await Booking.create({
      jobId: job1.jobId,
      patronId: patron1.userId,
      servicePartnerId: partner1.userId,
      proposedPrice: 1100.00,
      proposalText: 'I can do this tomorrow morning. I live in Sunger village and have standard handtools and replacement capacitors.',
      proposedTimeline: 1, // 1 day
      status: 'pending'
    });

    await Booking.create({
      jobId: job3.jobId,
      patronId: patron2.userId,
      servicePartnerId: partner2.userId,
      proposedPrice: 1400.00,
      proposalText: 'I am available this Friday. I bring eco-friendly cleaning soaps and scrubbing tools from Hadiguda. Will clean your double-story home fully.',
      proposedTimeline: 2, // 2 days
      status: 'pending'
    });

    console.log('Bids seeded successfully.');

    console.log('\n==================================================');
    console.log('🎉 MOSEVA TIKIRI ODISHA SEEDING COMPLETED!');
    console.log('==================================================');
    console.log('You can now log in using the password "password123" for any account:');
    console.log('\n👥 PATRONS (Hiring Clients):');
    console.log(`- Aarav Patnaik    | Email: aarav@moseva.in   | ID: ${patron1.userId} | Location: Tikiri`);
    console.log(`- Nisha Tripathy   | Email: nisha@moseva.in   | ID: ${patron2.userId} | Location: Kashipur`);
    console.log('\n👥 SERVICE PARTNERS (Taskers):');
    console.log(`- Rajesh Naik      | Email: rajesh@moseva.in  | ID: ${partner1.userId} | Location: Sunger`);
    console.log(`- Sunita Majhi     | Email: sunita@moseva.in  | ID: ${partner2.userId} | Location: Hadiguda`);
    console.log('\n👥 STEWARDS (Moderators):');
    console.log(`- Devendra Mohanty | Email: devendra@moseva.in | ID: ${steward1.userId} | Location: Rayagada`);
    console.log(`- Priya Dash       | Email: priya@moseva.in    | ID: ${steward2.userId} | Location: Tikiri`);
    console.log('==================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding crashed with error:', error);
    process.exit(1);
  }
}

seed();
