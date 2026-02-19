const { MongoClient, ObjectId } = require("mongodb");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.MONGO_URL || "mongodb://localhost:27017";

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function populateDummyData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✓ Connected to MongoDB");

    const db = client.db("bailRecognizerDB");

    console.log("🧹 Clearing existing data...");
    await db.collection("users").deleteMany({});
    await db.collection("cases").deleteMany({});
    await db.collection("auditLogs").deleteMany({});
    await db.collection("legalRules").deleteMany({});
    console.log("✓ Existing data cleared");

    // Add dummy legal rules
    const rulesCollection = db.collection("legalRules");
    const ipcSections = [
      {
        section: "34",
        type: "IPC",
        offense: "Common intention",
        category: "Depends on main offense",
        riskLevel: "Variable",
        description:
          "Acts done by several persons in furtherance of common intention",
        punishment: "Punishment same as main offense",
      },
      {
        section: "120B",
        type: "IPC",
        offense: "Criminal conspiracy",
        category: "Depends",
        riskLevel: "Medium",
        description: "Punishment for criminal conspiracy",
        punishment: "Up to life imprisonment depending on conspiracy",
      },
      {
        section: "141",
        type: "IPC",
        offense: "Unlawful assembly",
        category: "Bailable",
        riskLevel: "Low",
        description: "Assembly of five or more persons with unlawful object",
        punishment: "Up to 6 months or fine or both",
      },
      {
        section: "147",
        type: "IPC",
        offense: "Rioting",
        category: "Bailable",
        riskLevel: "Medium",
        description: "Punishment for rioting",
        punishment: "Up to 2 years or fine or both",
      },
      {
        section: "148",
        type: "IPC",
        offense: "Rioting with deadly weapon",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Rioting armed with deadly weapon",
        punishment: "Up to 3 years or fine or both",
      },
      {
        section: "149",
        type: "IPC",
        offense: "Unlawful assembly offense",
        category: "Depends",
        riskLevel: "Variable",
        description:
          "Every member guilty of offense committed in prosecution of common object",
        punishment: "Same as principal offense",
      },
      {
        section: "186",
        type: "IPC",
        offense: "Obstructing public servant",
        category: "Bailable",
        riskLevel: "Low",
        description: "Obstructing public servant in discharge of duties",
        punishment: "Up to 3 months or fine or both",
      },
      {
        section: "188",
        type: "IPC",
        offense: "Disobedience to order promulgated by public servant",
        category: "Bailable",
        riskLevel: "Low",
        description: "Violation of public order",
        punishment: "Up to 6 months or fine or both",
      },
      {
        section: "201",
        type: "IPC",
        offense: "Causing disappearance of evidence",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Destroying evidence to screen offender",
        punishment: "Up to 7 years and fine",
      },
      {
        section: "211",
        type: "IPC",
        offense: "False charge",
        category: "Non-Bailable",
        riskLevel: "Medium",
        description: "False charge with intent to injure",
        punishment: "Up to 2 years or fine",
      },

      {
        section: "279",
        type: "IPC",
        offense: "Rash driving",
        category: "Bailable",
        riskLevel: "Low",
        description: "Rash driving on public way",
        punishment: "Up to 6 months or fine or both",
      },
      {
        section: "284",
        type: "IPC",
        offense: "Negligent conduct with fire",
        category: "Bailable",
        riskLevel: "Low",
        description: "Negligent conduct with combustible matter",
        punishment: "Up to 6 months or fine or both",
      },
      {
        section: "290",
        type: "IPC",
        offense: "Public nuisance",
        category: "Bailable",
        riskLevel: "Low",
        description: "Punishment for public nuisance",
        punishment: "Fine up to 200 rupees",
      },
      {
        section: "292",
        type: "IPC",
        offense: "Sale of obscene books",
        category: "Bailable",
        riskLevel: "Medium",
        description: "Sale of obscene material",
        punishment: "Up to 2 years and fine",
      },
      {
        section: "295A",
        type: "IPC",
        offense: "Outraging religious feelings",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Deliberate acts to outrage religious feelings",
        punishment: "Up to 3 years or fine or both",
      },

      {
        section: "299",
        type: "IPC",
        offense: "Culpable homicide",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Definition of culpable homicide",
        punishment: "Punished under Section 304",
      },
      {
        section: "300",
        type: "IPC",
        offense: "Murder definition",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Definition of murder",
        punishment: "Punished under Section 302",
      },
      {
        section: "302",
        type: "IPC",
        offense: "Murder",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Punishment for murder",
        punishment: "Death or life imprisonment and fine",
      },
      {
        section: "304",
        type: "IPC",
        offense: "Culpable homicide not amounting to murder",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Punishment for culpable homicide",
        punishment: "Life imprisonment or up to 10 years and fine",
      },
      {
        section: "306",
        type: "IPC",
        offense: "Abetment of suicide",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Abetting suicide",
        punishment: "Up to 10 years and fine",
      },
      {
        section: "307",
        type: "IPC",
        offense: "Attempt to murder",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Attempt to commit murder",
        punishment: "Up to 10 years or life and fine",
      },
      {
        section: "308",
        type: "IPC",
        offense: "Attempt to culpable homicide",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Attempt to commit culpable homicide",
        punishment: "Up to 7 years or fine or both",
      },

      {
        section: "323",
        type: "IPC",
        offense: "Voluntarily causing hurt",
        category: "Bailable",
        riskLevel: "Low",
        description: "Simple hurt",
        punishment: "Up to 1 year or fine or both",
      },
      {
        section: "324",
        type: "IPC",
        offense: "Hurt by dangerous weapons",
        category: "Non-Bailable",
        riskLevel: "Medium",
        description: "Hurt using dangerous weapons",
        punishment: "Up to 3 years or fine or both",
      },
      {
        section: "325",
        type: "IPC",
        offense: "Grievous hurt",
        category: "Non-Bailable",
        riskLevel: "Medium",
        description: "Voluntarily causing grievous hurt",
        punishment: "Up to 7 years and fine",
      },
      {
        section: "326",
        type: "IPC",
        offense: "Grievous hurt by dangerous weapon",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Grievous hurt using dangerous weapon",
        punishment: "Up to 10 years and fine",
      },

      {
        section: "341",
        type: "IPC",
        offense: "Wrongful restraint",
        category: "Bailable",
        riskLevel: "Low",
        description: "Restraining person unlawfully",
        punishment: "Up to 1 month or fine or both",
      },
      {
        section: "342",
        type: "IPC",
        offense: "Wrongful confinement",
        category: "Bailable",
        riskLevel: "Low",
        description: "Wrongful confinement",
        punishment: "Up to 1 year or fine or both",
      },

      {
        section: "354",
        type: "IPC",
        offense: "Assault on woman",
        category: "Non-Bailable",
        riskLevel: "Medium",
        description: "Outraging modesty of woman",
        punishment: "1 to 5 years and fine",
      },
      {
        section: "354A",
        type: "IPC",
        offense: "Sexual harassment",
        category: "Non-Bailable",
        riskLevel: "Medium",
        description: "Sexual harassment offense",
        punishment: "Up to 3 years and fine",
      },
      {
        section: "354B",
        type: "IPC",
        offense: "Assault with intent to disrobe",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Disrobing woman",
        punishment: "3 to 7 years and fine",
      },
      {
        section: "375",
        type: "IPC",
        offense: "Rape definition",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Definition of rape",
        punishment: "Punished under Section 376",
      },
      {
        section: "376",
        type: "IPC",
        offense: "Rape",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Punishment for rape",
        punishment: "10 years to life imprisonment",
      },

      {
        section: "378",
        type: "IPC",
        offense: "Theft definition",
        category: "Bailable",
        riskLevel: "Low",
        description: "Definition of theft",
        punishment: "Punished under Section 379",
      },
      {
        section: "379",
        type: "IPC",
        offense: "Theft",
        category: "Bailable",
        riskLevel: "Low",
        description: "Punishment for theft",
        punishment: "Up to 3 years or fine or both",
      },
      {
        section: "380",
        type: "IPC",
        offense: "Theft in dwelling",
        category: "Non-Bailable",
        riskLevel: "Medium",
        description: "Theft in house",
        punishment: "Up to 7 years and fine",
      },
      {
        section: "392",
        type: "IPC",
        offense: "Robbery",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Punishment for robbery",
        punishment: "Up to 10 years and fine",
      },
      {
        section: "395",
        type: "IPC",
        offense: "Dacoity",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Dacoity by five or more persons",
        punishment: "Life imprisonment or up to 10 years and fine",
      },

      {
        section: "406",
        type: "IPC",
        offense: "Criminal breach of trust",
        category: "Bailable",
        riskLevel: "Medium",
        description: "Criminal breach of trust",
        punishment: "Up to 3 years or fine or both",
      },
      {
        section: "409",
        type: "IPC",
        offense: "Breach of trust by public servant",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Public servant breach of trust",
        punishment: "Life imprisonment or up to 10 years and fine",
      },

      {
        section: "415",
        type: "IPC",
        offense: "Cheating definition",
        category: "Bailable",
        riskLevel: "Medium",
        description: "Definition of cheating",
        punishment: "Punished under Section 420",
      },
      {
        section: "420",
        type: "IPC",
        offense: "Cheating",
        category: "Bailable",
        riskLevel: "Medium",
        description: "Cheating and dishonestly inducing delivery of property",
        punishment: "Up to 7 years and fine",
      },

      {
        section: "425",
        type: "IPC",
        offense: "Mischief",
        category: "Bailable",
        riskLevel: "Low",
        description: "Mischief causing damage",
        punishment: "Up to 2 years or fine or both",
      },

      {
        section: "441",
        type: "IPC",
        offense: "Criminal trespass",
        category: "Bailable",
        riskLevel: "Low",
        description: "Criminal trespass definition",
        punishment: "Up to 3 months or fine or both",
      },
      {
        section: "447",
        type: "IPC",
        offense: "Criminal trespass punishment",
        category: "Bailable",
        riskLevel: "Low",
        description: "Punishment for trespass",
        punishment: "Up to 3 months or fine or both",
      },

      {
        section: "463",
        type: "IPC",
        offense: "Forgery definition",
        category: "Non-Bailable",
        riskLevel: "Medium",
        description: "Definition of forgery",
        punishment: "Punished under Section 465",
      },
      {
        section: "465",
        type: "IPC",
        offense: "Forgery",
        category: "Non-Bailable",
        riskLevel: "Medium",
        description: "Punishment for forgery",
        punishment: "Up to 2 years or fine or both",
      },
      {
        section: "468",
        type: "IPC",
        offense: "Forgery for cheating",
        category: "Non-Bailable",
        riskLevel: "High",
        description: "Forgery for purpose of cheating",
        punishment: "Up to 7 years and fine",
      },
      {
        section: "471",
        type: "IPC",
        offense: "Using forged document",
        category: "Non-Bailable",
        riskLevel: "Medium",
        description: "Using forged document as genuine",
        punishment: "Same as forgery offense",
      },

      {
        section: "494",
        type: "IPC",
        offense: "Bigamy",
        category: "Non-Bailable",
        riskLevel: "Medium",
        description: "Marrying again during lifetime of spouse",
        punishment: "Up to 7 years and fine",
      },
      {
        section: "498A",
        type: "IPC",
        offense: "Cruelty by husband",
        category: "Non-Bailable",
        riskLevel: "Medium",
        description: "Cruelty to married woman",
        punishment: "Up to 3 years and fine",
      },

      {
        section: "499",
        type: "IPC",
        offense: "Defamation definition",
        category: "Bailable",
        riskLevel: "Low",
        description: "Definition of defamation",
        punishment: "Punished under Section 500",
      },
      {
        section: "500",
        type: "IPC",
        offense: "Defamation",
        category: "Bailable",
        riskLevel: "Low",
        description: "Punishment for defamation",
        punishment: "Up to 2 years or fine or both",
      },

      {
        section: "503",
        type: "IPC",
        offense: "Criminal intimidation",
        category: "Bailable",
        riskLevel: "Low",
        description: "Threatening another",
        punishment: "Up to 2 years or fine or both",
      },
      {
        section: "506",
        type: "IPC",
        offense: "Criminal intimidation punishment",
        category: "Bailable",
        riskLevel: "Low",
        description: "Punishment for criminal intimidation",
        punishment: "Up to 2 years or 7 years in serious cases",
      },

      {
        section: "509",
        type: "IPC",
        offense: "Insulting modesty of woman",
        category: "Bailable",
        riskLevel: "Low",
        description: "Insult to modesty of woman",
        punishment: "Up to 3 years and fine",
      },

      {
        section: "511",
        type: "IPC",
        offense: "Attempt to commit offenses",
        category: "Depends",
        riskLevel: "Variable",
        description: "Punishment for attempting offense",
        punishment: "Half of maximum punishment of main offense",
      },
    ];

    await rulesCollection.insertMany(ipcSections);
    console.log(`✓ Created ${ipcSections.length} legal rules`);

    // Add dummy users
    const usersCollection = db.collection("users");
    const dummyUsers = [
      {
        name: "System Admin",
        email: "admin@bailsystem.com",
        password: hashPassword("admin123"),
        role: "Admin",
        active: true,
        createdAt: new Date("2024-01-01"),
      },
      {
        name: "Rahul Sharma",
        email: "rahul.sharma@bailsystem.com",
        password: hashPassword("officer123"),
        role: "Legal Officer",
        active: true,
        createdAt: new Date("2024-01-15"),
      },
      {
        name: "Priya Patel",
        email: "priya.patel@bailsystem.com",
        password: hashPassword("officer123"),
        role: "Legal Officer",
        active: true,
        createdAt: new Date("2024-01-20"),
      },
      {
        name: "Amit Kumar",
        email: "amit.kumar@bailsystem.com",
        password: hashPassword("admin123"),
        role: "Admin",
        active: true,
        createdAt: new Date("2024-01-10"),
      },
      {
        name: "Sneha Reddy",
        email: "sneha.reddy@bailsystem.com",
        password: hashPassword("officer123"),
        role: "Legal Officer",
        active: false,
        createdAt: new Date("2023-12-01"),
      },
    ];

    for (const user of dummyUsers) {
      const exists = await usersCollection.findOne({ email: user.email });
      if (!exists) {
        await usersCollection.insertOne(user);
        console.log(`✓ Created user: ${user.name}`);
      }
    }

    // Get admin user for case creation
    const adminUser = await usersCollection.findOne({
      email: "admin@bailsystem.com",
    });
    const officerUser = await usersCollection.findOne({
      email: "rahul.sharma@bailsystem.com",
    });
    console.log(adminUser);
    // Add dummy cases
    const casesCollection = db.collection("cases");

    const dummyCases = [
      {
        firNumber: "FIR/2024/004",
        caseTitle: "Domestic Violence Case",
        policeStation: "Women Police Station",
        accusedName: "Rajesh Verma",
        age: "42",
        gender: "Male",
        ipcSections: "498A, 323",
        crpcSections: "41, 154",
        offenseType: "Non-Bailable",
        caseDescription:
          "Accused allegedly subjected his wife to physical and mental cruelty. Multiple complaints registered over the past year.",
        arrestDate: "2024-01-20",
        status: "Under Review",
        createdBy: adminUser._id.toString(),
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-22"),
      },
      {
        firNumber: "FIR/2024/005",
        caseTitle: "Cheating and Forgery Case",
        policeStation: "Economic Offences Wing",
        accusedName: "Suresh Malhotra",
        age: "38",
        gender: "Male",
        ipcSections: "420, 406, 468",
        crpcSections: "156, 173",
        offenseType: "Bailable",
        caseDescription:
          "Accused cheated multiple investors through fraudulent investment scheme. Total amount involved: Rs. 25 lakhs.",
        arrestDate: "2024-01-25",
        status: "Registered",
        createdBy: officerUser
          ? officerUser._id.toString()
          : adminUser._id.toString(),
        createdAt: new Date("2024-01-25"),
        updatedAt: new Date("2024-01-25"),
      },
      {
        firNumber: "FIR/2024/006",
        caseTitle: "Armed Robbery at Jewelry Store",
        policeStation: "City Central Police Station",
        accusedName: "Vikram Singh",
        age: "29",
        gender: "Male",
        ipcSections: "392, 397, 120B",
        crpcSections: "41",
        offenseType: "Non-Bailable",
        caseDescription:
          "Gang of three persons robbed jewelry store at gunpoint. Accused is one of the gang members. Jewelry worth Rs. 50 lakhs stolen.",
        arrestDate: "2024-02-01",
        status: "Registered",
        createdBy: adminUser._id.toString(),
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-01"),
      },
      {
        firNumber: "FIR/2024/007",
        caseTitle: "Simple Theft - Mobile Phone",
        policeStation: "Railway Police Station",
        accusedName: "Ramesh Yadav",
        age: "24",
        gender: "Male",
        ipcSections: "379",
        crpcSections: "154",
        offenseType: "Bailable",
        caseDescription:
          "Accused stole mobile phone from passenger in railway compartment. First-time offender.",
        arrestDate: "2024-02-03",
        status: "Registered",
        createdBy: officerUser
          ? officerUser._id.toString()
          : adminUser._id.toString(),
        createdAt: new Date("2024-02-03"),
        updatedAt: new Date("2024-02-03"),
      },
      {
        firNumber: "FIR/2024/008",
        caseTitle: "Assault Case - Senior Citizen",
        policeStation: "North Zone Police Station",
        accusedName: "Mahendra Gupta",
        age: "67",
        gender: "Male",
        ipcSections: "323, 341",
        crpcSections: "41",
        offenseType: "Bailable",
        caseDescription:
          "Land dispute between neighbors resulted in physical altercation. Accused is a senior citizen with no prior criminal record.",
        arrestDate: "2024-02-05",
        status: "Registered",
        createdBy: adminUser._id.toString(),
        createdAt: new Date("2024-02-05"),
        updatedAt: new Date("2024-02-05"),
      },
      {
        firNumber: "FIR/2024/009",
        caseTitle: "Molestation Case",
        policeStation: "Women Police Station",
        accusedName: "Karan Malhotra",
        age: "31",
        gender: "Male",
        ipcSections: "354, 509",
        crpcSections: "41, 154",
        offenseType: "Non-Bailable",
        caseDescription:
          "Accused allegedly molested a woman in public place. Victim has provided statement and medical examination completed.",
        arrestDate: "2024-02-06",
        status: "Under Review",
        createdBy: officerUser
          ? officerUser._id.toString()
          : adminUser._id.toString(),
        createdAt: new Date("2024-02-06"),
        updatedAt: new Date("2024-02-07"),
      },
      {
        firNumber: "FIR/2024/010",
        caseTitle: "Culpable Homicide Case",
        policeStation: "Highway Police Station",
        accusedName: "Deepak Chauhan",
        age: "35",
        gender: "Male",
        ipcSections: "304, 279, 338",
        crpcSections: "41",
        offenseType: "Non-Bailable",
        caseDescription:
          "Rash and negligent driving resulted in death of two persons. Accused was driving under influence of alcohol.",
        arrestDate: "2024-02-07",
        status: "Registered",
        createdBy: adminUser._id.toString(),
        createdAt: new Date("2024-02-07"),
        updatedAt: new Date("2024-02-07"),
      },
      {
        firNumber: "FIR/2023/145",
        caseTitle: "Criminal Trespass and Intimidation",
        policeStation: "South Police Station",
        accusedName: "Naveen Kumar",
        age: "28",
        gender: "Male",
        ipcSections: "447, 506",
        crpcSections: "154",
        offenseType: "Bailable",
        caseDescription:
          "Accused trespassed into complainants property and threatened them. Property dispute case.",
        arrestDate: "2023-12-15",
        status: "Bail Recommended",
        createdBy: adminUser._id.toString(),
        createdAt: new Date("2023-12-15"),
        updatedAt: new Date("2023-12-20"),
      },
      {
        firNumber: "FIR/2023/158",
        caseTitle: "Attempt to Murder - Stabbing",
        policeStation: "East Zone Police Station",
        accusedName: "Sanjay Rana",
        age: "33",
        gender: "Male",
        ipcSections: "307, 324",
        crpcSections: "41",
        offenseType: "Non-Bailable",
        caseDescription:
          "Personal enmity led to stabbing incident. Victim hospitalized with serious injuries. Accused has previous criminal record.",
        arrestDate: "2023-12-22",
        status: "Bail Rejected",
        createdBy: officerUser
          ? officerUser._id.toString()
          : adminUser._id.toString(),
        createdAt: new Date("2023-12-22"),
        updatedAt: new Date("2023-12-28"),
      },
      {
        firNumber: "FIR/2024/011",
        caseTitle: "House Burglary",
        policeStation: "West Zone Police Station",
        accusedName: "Ajay Thakur",
        age: "26",
        gender: "Male",
        ipcSections: "380, 457",
        crpcSections: "41, 154",
        offenseType: "Non-Bailable",
        caseDescription:
          "Accused broke into house during night time and stole valuables worth Rs. 2 lakhs. Fingerprints matched at crime scene.",
        arrestDate: "2024-02-08",
        status: "Registered",
        createdBy: adminUser._id.toString(),
        createdAt: new Date("2024-02-08"),
        updatedAt: new Date("2024-02-08"),
      },
    ];

    let casesInserted = 0;
    for (const caseData of dummyCases) {
      const exists = await casesCollection.findOne({
        firNumber: caseData.firNumber,
      });
      if (!exists) {
        await casesCollection.insertOne(caseData);
        console.log(
          `✓ Created case: ${caseData.firNumber} - ${caseData.caseTitle}`,
        );
        casesInserted++;
      }
    }

    // Add audit logs for dummy data
    const auditCollection = db.collection("auditLogs");

    const dummyAuditLogs = [
      {
        userId: adminUser._id.toString(),
        action: "Login",
        details: { email: "admin@bailsystem.com" },
        timestamp: new Date("2024-02-08T08:00:00"),
      },
      {
        userId: officerUser
          ? officerUser._id.toString()
          : adminUser._id.toString(),
        action: "Login",
        details: { email: "rahul.sharma@bailsystem.com" },
        timestamp: new Date("2024-02-08T08:30:00"),
      },
      {
        userId: adminUser._id.toString(),
        action: "User Created",
        details: {
          email: "rahul.sharma@bailsystem.com",
          role: "Legal Officer",
        },
        timestamp: new Date("2024-01-15T10:00:00"),
      },
      {
        userId: officerUser
          ? officerUser._id.toString()
          : adminUser._id.toString(),
        action: "Case Created",
        details: { firNumber: "FIR/2024/005", caseId: "dummy-id-1" },
        timestamp: new Date("2024-01-25T11:30:00"),
      },
    ];

    for (const log of dummyAuditLogs) {
      await auditCollection.insertOne(log);
    }
    console.log(`✓ Created ${dummyAuditLogs.length} audit log entries`);

    console.log("\n✅ Dummy data population completed!");
    console.log(`   - Users: 4 new users added`);
    console.log(`   - Cases: ${casesInserted} new cases added`);
    console.log(`   - Audit Logs: ${dummyAuditLogs.length} entries added`);
    console.log("\n📊 Summary:");
    console.log(`   Total Users: ${await usersCollection.countDocuments()}`);
    console.log(`   Total Cases: ${await casesCollection.countDocuments()}`);
    console.log(
      `   Total Audit Logs: ${await auditCollection.countDocuments()}`,
    );
  } catch (error) {
    console.error("❌ Error populating dummy data:", error);
  } finally {
    await client.close();
  }
}

populateDummyData();
