const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config()
const uri = process.env.MONGO_URL || 'mongodb://localhost:27017';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function populateDummyData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');
    
    const db = client.db('bailRecognizerDB');
    
    console.log('🧹 Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('cases').deleteMany({});
    await db.collection('auditLogs').deleteMany({});
    await db.collection('legalRules').deleteMany({});
    console.log('✓ Existing data cleared');

    // Add dummy legal rules
    const rulesCollection = db.collection('legalRules');
    const dummyRules = [
      { section: '302', type: 'IPC', offense: 'Murder', category: 'Non-Bailable', riskLevel: 'High', description: 'Punishment for murder' },
      { section: '304', type: 'IPC', offense: 'Culpable homicide', category: 'Non-Bailable', riskLevel: 'High', description: 'Culpable homicide not amounting to murder' },
      { section: '307', type: 'IPC', offense: 'Attempt to murder', category: 'Non-Bailable', riskLevel: 'High', description: 'Attempt to murder' },
      { section: '376', type: 'IPC', offense: 'Rape', category: 'Non-Bailable', riskLevel: 'High', description: 'Punishment for rape' },
      { section: '379', type: 'IPC', offense: 'Theft', category: 'Bailable', riskLevel: 'Low', description: 'Punishment for theft' },
      { section: '380', type: 'IPC', offense: 'Theft in dwelling', category: 'Non-Bailable', riskLevel: 'Medium', description: 'Theft in dwelling house' },
      { section: '392', type: 'IPC', offense: 'Robbery', category: 'Non-Bailable', riskLevel: 'High', description: 'Punishment for robbery' },
      { section: '420', type: 'IPC', offense: 'Cheating', category: 'Bailable', riskLevel: 'Medium', description: 'Cheating and dishonestly inducing delivery of property' },
      { section: '406', type: 'IPC', offense: 'Criminal breach of trust', category: 'Bailable', riskLevel: 'Medium', description: 'Punishment for criminal breach of trust' },
      { section: '498A', type: 'IPC', offense: 'Cruelty by husband', category: 'Non-Bailable', riskLevel: 'Medium', description: 'Husband or relative of husband subjecting woman to cruelty' },
      { section: '323', type: 'IPC', offense: 'Voluntarily causing hurt', category: 'Bailable', riskLevel: 'Low', description: 'Punishment for voluntarily causing hurt' },
      { section: '324', type: 'IPC', offense: 'Voluntarily causing hurt by dangerous weapons', category: 'Non-Bailable', riskLevel: 'Medium', description: 'Voluntarily causing hurt by dangerous weapons' },
      { section: '354', type: 'IPC', offense: 'Assault on woman', category: 'Non-Bailable', riskLevel: 'Medium', description: 'Assault or criminal force to woman with intent to outrage her modesty' },
      { section: '341', type: 'IPC', offense: 'Wrongful restraint', category: 'Bailable', riskLevel: 'Low', description: 'Punishment for wrongful restraint' },
      { section: '447', type: 'IPC', offense: 'Criminal trespass', category: 'Bailable', riskLevel: 'Low', description: 'Punishment for criminal trespass' },
      { section: '506', type: 'IPC', offense: 'Criminal intimidation', category: 'Bailable', riskLevel: 'Low', description: 'Punishment for criminal intimidation' }
    ];
    
    await rulesCollection.insertMany(dummyRules);
    console.log(`✓ Created ${dummyRules.length} legal rules`);

    // Add dummy users
    const usersCollection = db.collection('users');
    const dummyUsers = [
      {
        name: 'System Admin',
        email: 'admin@bailsystem.com',
        password: hashPassword('admin123'),
        role: 'Admin',
        active: true,
        createdAt: new Date('2024-01-01')
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@bailsystem.com',
        password: hashPassword('officer123'),
        role: 'Legal Officer',
        active: true,
        createdAt: new Date('2024-01-15')
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@bailsystem.com',
        password: hashPassword('officer123'),
        role: 'Legal Officer',
        active: true,
        createdAt: new Date('2024-01-20')
      },
      {
        name: 'Amit Kumar',
        email: 'amit.kumar@bailsystem.com',
        password: hashPassword('admin123'),
        role: 'Admin',
        active: true,
        createdAt: new Date('2024-01-10')
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@bailsystem.com',
        password: hashPassword('officer123'),
        role: 'Legal Officer',
        active: false,
        createdAt: new Date('2023-12-01')
      }
    ];
    
    for (const user of dummyUsers) {
      const exists = await usersCollection.findOne({ email: user.email });
      if (!exists) {
        await usersCollection.insertOne(user);
        console.log(`✓ Created user: ${user.name}`);
      }
    }
    
    // Get admin user for case creation
    const adminUser = await usersCollection.findOne({ email: 'admin@bailsystem.com' });
    const officerUser = await usersCollection.findOne({ email: 'rahul.sharma@bailsystem.com' });
    console.log(adminUser);
    // Add dummy cases
    const casesCollection = db.collection('cases');
    
    const dummyCases = [
      {
        firNumber: 'FIR/2024/004',
        caseTitle: 'Domestic Violence Case',
        policeStation: 'Women Police Station',
        accusedName: 'Rajesh Verma',
        age: '42',
        gender: 'Male',
        ipcSections: '498A, 323',
        crpcSections: '41, 154',
        offenseType: 'Non-Bailable',
        caseDescription: 'Accused allegedly subjected his wife to physical and mental cruelty. Multiple complaints registered over the past year.',
        arrestDate: '2024-01-20',
        status: 'Under Review',
        createdBy: adminUser._id.toString(),
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-22')
      },
      {
        firNumber: 'FIR/2024/005',
        caseTitle: 'Cheating and Forgery Case',
        policeStation: 'Economic Offences Wing',
        accusedName: 'Suresh Malhotra',
        age: '38',
        gender: 'Male',
        ipcSections: '420, 406, 468',
        crpcSections: '156, 173',
        offenseType: 'Bailable',
        caseDescription: 'Accused cheated multiple investors through fraudulent investment scheme. Total amount involved: Rs. 25 lakhs.',
        arrestDate: '2024-01-25',
        status: 'Registered',
        createdBy: officerUser ? officerUser._id.toString() : adminUser._id.toString(),
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25')
      },
      {
        firNumber: 'FIR/2024/006',
        caseTitle: 'Armed Robbery at Jewelry Store',
        policeStation: 'City Central Police Station',
        accusedName: 'Vikram Singh',
        age: '29',
        gender: 'Male',
        ipcSections: '392, 397, 120B',
        crpcSections: '41',
        offenseType: 'Non-Bailable',
        caseDescription: 'Gang of three persons robbed jewelry store at gunpoint. Accused is one of the gang members. Jewelry worth Rs. 50 lakhs stolen.',
        arrestDate: '2024-02-01',
        status: 'Registered',
        createdBy: adminUser._id.toString(),
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
      },
      {
        firNumber: 'FIR/2024/007',
        caseTitle: 'Simple Theft - Mobile Phone',
        policeStation: 'Railway Police Station',
        accusedName: 'Ramesh Yadav',
        age: '24',
        gender: 'Male',
        ipcSections: '379',
        crpcSections: '154',
        offenseType: 'Bailable',
        caseDescription: 'Accused stole mobile phone from passenger in railway compartment. First-time offender.',
        arrestDate: '2024-02-03',
        status: 'Registered',
        createdBy: officerUser ? officerUser._id.toString() : adminUser._id.toString(),
        createdAt: new Date('2024-02-03'),
        updatedAt: new Date('2024-02-03')
      },
      {
        firNumber: 'FIR/2024/008',
        caseTitle: 'Assault Case - Senior Citizen',
        policeStation: 'North Zone Police Station',
        accusedName: 'Mahendra Gupta',
        age: '67',
        gender: 'Male',
        ipcSections: '323, 341',
        crpcSections: '41',
        offenseType: 'Bailable',
        caseDescription: 'Land dispute between neighbors resulted in physical altercation. Accused is a senior citizen with no prior criminal record.',
        arrestDate: '2024-02-05',
        status: 'Registered',
        createdBy: adminUser._id.toString(),
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05')
      },
      {
        firNumber: 'FIR/2024/009',
        caseTitle: 'Molestation Case',
        policeStation: 'Women Police Station',
        accusedName: 'Karan Malhotra',
        age: '31',
        gender: 'Male',
        ipcSections: '354, 509',
        crpcSections: '41, 154',
        offenseType: 'Non-Bailable',
        caseDescription: 'Accused allegedly molested a woman in public place. Victim has provided statement and medical examination completed.',
        arrestDate: '2024-02-06',
        status: 'Under Review',
        createdBy: officerUser ? officerUser._id.toString() : adminUser._id.toString(),
        createdAt: new Date('2024-02-06'),
        updatedAt: new Date('2024-02-07')
      },
      {
        firNumber: 'FIR/2024/010',
        caseTitle: 'Culpable Homicide Case',
        policeStation: 'Highway Police Station',
        accusedName: 'Deepak Chauhan',
        age: '35',
        gender: 'Male',
        ipcSections: '304, 279, 338',
        crpcSections: '41',
        offenseType: 'Non-Bailable',
        caseDescription: 'Rash and negligent driving resulted in death of two persons. Accused was driving under influence of alcohol.',
        arrestDate: '2024-02-07',
        status: 'Registered',
        createdBy: adminUser._id.toString(),
        createdAt: new Date('2024-02-07'),
        updatedAt: new Date('2024-02-07')
      },
      {
        firNumber: 'FIR/2023/145',
        caseTitle: 'Criminal Trespass and Intimidation',
        policeStation: 'South Police Station',
        accusedName: 'Naveen Kumar',
        age: '28',
        gender: 'Male',
        ipcSections: '447, 506',
        crpcSections: '154',
        offenseType: 'Bailable',
        caseDescription: 'Accused trespassed into complainants property and threatened them. Property dispute case.',
        arrestDate: '2023-12-15',
        status: 'Bail Recommended',
        createdBy: adminUser._id.toString(),
        createdAt: new Date('2023-12-15'),
        updatedAt: new Date('2023-12-20')
      },
      {
        firNumber: 'FIR/2023/158',
        caseTitle: 'Attempt to Murder - Stabbing',
        policeStation: 'East Zone Police Station',
        accusedName: 'Sanjay Rana',
        age: '33',
        gender: 'Male',
        ipcSections: '307, 324',
        crpcSections: '41',
        offenseType: 'Non-Bailable',
        caseDescription: 'Personal enmity led to stabbing incident. Victim hospitalized with serious injuries. Accused has previous criminal record.',
        arrestDate: '2023-12-22',
        status: 'Bail Rejected',
        createdBy: officerUser ? officerUser._id.toString() : adminUser._id.toString(),
        createdAt: new Date('2023-12-22'),
        updatedAt: new Date('2023-12-28')
      },
      {
        firNumber: 'FIR/2024/011',
        caseTitle: 'House Burglary',
        policeStation: 'West Zone Police Station',
        accusedName: 'Ajay Thakur',
        age: '26',
        gender: 'Male',
        ipcSections: '380, 457',
        crpcSections: '41, 154',
        offenseType: 'Non-Bailable',
        caseDescription: 'Accused broke into house during night time and stole valuables worth Rs. 2 lakhs. Fingerprints matched at crime scene.',
        arrestDate: '2024-02-08',
        status: 'Registered',
        createdBy: adminUser._id.toString(),
        createdAt: new Date('2024-02-08'),
        updatedAt: new Date('2024-02-08')
      }
    ];
    
    let casesInserted = 0;
    for (const caseData of dummyCases) {
      const exists = await casesCollection.findOne({ firNumber: caseData.firNumber });
      if (!exists) {
        await casesCollection.insertOne(caseData);
        console.log(`✓ Created case: ${caseData.firNumber} - ${caseData.caseTitle}`);
        casesInserted++;
      }
    }
    
    // Add audit logs for dummy data
    const auditCollection = db.collection('auditLogs');
    
    const dummyAuditLogs = [
      {
        userId: adminUser._id.toString(),
        action: 'Login',
        details: { email: 'admin@bailsystem.com' },
        timestamp: new Date('2024-02-08T08:00:00')
      },
      {
        userId: officerUser ? officerUser._id.toString() : adminUser._id.toString(),
        action: 'Login',
        details: { email: 'rahul.sharma@bailsystem.com' },
        timestamp: new Date('2024-02-08T08:30:00')
      },
      {
        userId: adminUser._id.toString(),
        action: 'User Created',
        details: { email: 'rahul.sharma@bailsystem.com', role: 'Legal Officer' },
        timestamp: new Date('2024-01-15T10:00:00')
      },
      {
        userId: officerUser ? officerUser._id.toString() : adminUser._id.toString(),
        action: 'Case Created',
        details: { firNumber: 'FIR/2024/005', caseId: 'dummy-id-1' },
        timestamp: new Date('2024-01-25T11:30:00')
      }
    ];
    
    for (const log of dummyAuditLogs) {
      await auditCollection.insertOne(log);
    }
    console.log(`✓ Created ${dummyAuditLogs.length} audit log entries`);
    
    console.log('\n✅ Dummy data population completed!');
    console.log(`   - Users: 4 new users added`);
    console.log(`   - Cases: ${casesInserted} new cases added`);
    console.log(`   - Audit Logs: ${dummyAuditLogs.length} entries added`);
    console.log('\n📊 Summary:');
    console.log(`   Total Users: ${await usersCollection.countDocuments()}`);
    console.log(`   Total Cases: ${await casesCollection.countDocuments()}`);
    console.log(`   Total Audit Logs: ${await auditCollection.countDocuments()}`);
    
  } catch (error) {
    console.error('❌ Error populating dummy data:', error);
  } finally {
    await client.close();
  }
}

populateDummyData();
