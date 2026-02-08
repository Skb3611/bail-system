import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const uri = process.env.MONGO_URL;
let client;
let db;

async function connectDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('bailRecognizerDB');
    
    // Initialize default data
    await initializeDefaultData();
  }
  return db;
}

async function initializeDefaultData() {
  const usersCollection = db.collection('users');
  const rulesCollection = db.collection('legalRules');
  
  // Create default admin if not exists
  const adminExists = await usersCollection.findOne({ email: 'admin@bailsystem.com' });
  if (!adminExists) {
    await usersCollection.insertOne({
      name: 'System Admin',
      email: 'admin@bailsystem.com',
      password: hashPassword('admin123'),
      role: 'Admin',
      active: true,
      createdAt: new Date()
    });
  }
  
  // Create legal rules if not exists
  const rulesCount = await rulesCollection.countDocuments();
  if (rulesCount === 0) {
    await rulesCollection.insertMany([
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
    ]);
  }
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function getSession(request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  
  if (!sessionToken) return null;
  
  const db = await connectDB();
  const sessionsCollection = db.collection('sessions');
  const session = await sessionsCollection.findOne({ token: sessionToken });
  
  if (!session || session.expiresAt < new Date()) {
    return null;
  }
  
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ _id: new ObjectId(session.userId) });
  
  return user;
}

async function createAuditLog(userId, action, details = {}) {
  const db = await connectDB();
  const auditCollection = db.collection('auditLogs');
  
  await auditCollection.insertOne({
    userId,
    action,
    details,
    timestamp: new Date()
  });
}

// Helper function to parse sections from text
function parseSections(text) {
  if (!text) return [];
  // Match patterns like "302", "IPC 302", "379, 420"
  const matches = text.match(/\d+/g);
  return matches ? [...new Set(matches)] : [];
}

// Bail eligibility logic
async function evaluateBailEligibility(caseData, legalAnalysis) {
  const { age, offenseType } = caseData;
  const { categories, maxRiskLevel } = legalAnalysis;
  
  // Rule 1: If all sections are bailable -> Eligible
  if (categories.every(cat => cat === 'Bailable')) {
    return {
      eligibility: 'Eligible',
      recommendation: 'Bail Recommended',
      conditions: ['Personal bond required', 'Appear before court as required'],
      reasoning: 'All offenses are bailable in nature'
    };
  }
  
  // Rule 2: If any non-bailable + high risk -> Not Eligible
  if (categories.includes('Non-Bailable') && maxRiskLevel === 'High') {
    return {
      eligibility: 'Not Eligible',
      recommendation: 'Bail Not Recommended',
      conditions: [],
      reasoning: 'Offense involves serious crime with high risk to society'
    };
  }
  
  // Rule 3: Senior citizen consideration (age > 60)
  if (age && parseInt(age) > 60) {
    return {
      eligibility: 'Conditional',
      recommendation: 'Conditional Bail Recommended',
      conditions: ['Surety of Rs. 50,000 required', 'Surrender passport', 'Report to police station weekly', 'Cannot leave city without permission'],
      reasoning: 'Accused is senior citizen, eligible for conditional bail'
    };
  }
  
  // Rule 4: Non-bailable but medium/low risk -> Conditional
  if (categories.includes('Non-Bailable') && maxRiskLevel !== 'High') {
    return {
      eligibility: 'Conditional',
      recommendation: 'Conditional Bail Recommended',
      conditions: ['Surety of Rs. 1,00,000 required', 'Report to police station bi-weekly', 'Travel restriction within district', 'Cooperate with investigation'],
      reasoning: 'Non-bailable offense but risk level permits conditional bail'
    };
  }
  
  // Rule 5: Mixed bailable/non-bailable -> Conditional
  return {
    eligibility: 'Conditional',
    recommendation: 'Conditional Bail Recommended',
    conditions: ['Personal bond with surety', 'Regular reporting', 'No tampering with evidence'],
    reasoning: 'Case involves mixed offenses, conditional bail may be granted'
  };
}

export async function GET(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  
  try {
    const db = await connectDB();
    
    // Auth check session
    if (path === '/auth/session') {
      const user = await getSession(request);
      if (user) {
        return NextResponse.json({ 
          authenticated: true, 
          user: { 
            id: user._id.toString(), 
            name: user.name, 
            email: user.email, 
            role: user.role 
          } 
        });
      }
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    // Get users list (Admin only)
    if (path === '/users') {
      const user = await getSession(request);
      if (!user || user.role !== 'Admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      
      const usersCollection = db.collection('users');
      const users = await usersCollection.find({}).toArray();
      const sanitizedUsers = users.map(u => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        active: u.active,
        createdAt: u.createdAt
      }));
      
      return NextResponse.json(sanitizedUsers);
    }
    
    // Get cases list
    if (path === '/cases') {
      const user = await getSession(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const casesCollection = db.collection('cases');
      const cases = await casesCollection.find({}).sort({ createdAt: -1 }).toArray();
      const sanitizedCases = cases.map(c => ({
        ...c,
        id: c._id.toString(),
        _id: c._id.toString()
      }));
      
      return NextResponse.json(sanitizedCases);
    }
    
    // Get single case
    if (path.startsWith('/cases/') && !path.includes('/analyze') && !path.includes('/report')) {
      const user = await getSession(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const caseId = path.split('/')[2];
      const casesCollection = db.collection('cases');
      const caseData = await casesCollection.findOne({ _id: new ObjectId(caseId) });
      
      if (!caseData) {
        return NextResponse.json({ error: 'Case not found' }, { status: 404 });
      }
      
      return NextResponse.json({
        ...caseData,
        id: caseData._id.toString(),
        _id: caseData._id.toString()
      });
    }
    
    // Analyze case for bail eligibility
    if (path.includes('/analyze')) {
      const user = await getSession(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const caseId = path.split('/')[2];
      const casesCollection = db.collection('cases');
      const rulesCollection = db.collection('legalRules');
      
      const caseData = await casesCollection.findOne({ _id: new ObjectId(caseId) });
      if (!caseData) {
        return NextResponse.json({ error: 'Case not found' }, { status: 404 });
      }
      
      // Parse IPC sections
      const ipcSections = parseSections(caseData.ipcSections);
      const crpcSections = parseSections(caseData.crpcSections);
      
      // Get rules for these sections
      const matchedRules = await rulesCollection.find({
        section: { $in: ipcSections }
      }).toArray();
      
      // Analyze
      const categories = matchedRules.map(r => r.category);
      const riskLevels = matchedRules.map(r => r.riskLevel);
      const maxRiskLevel = riskLevels.includes('High') ? 'High' : riskLevels.includes('Medium') ? 'Medium' : 'Low';
      
      const legalAnalysis = {
        matchedRules,
        categories,
        maxRiskLevel,
        ipcSections,
        crpcSections
      };
      
      // Evaluate bail eligibility
      const bailEvaluation = await evaluateBailEligibility(caseData, legalAnalysis);
      
      // Update case with analysis
      await casesCollection.updateOne(
        { _id: new ObjectId(caseId) },
        { 
          $set: { 
            legalAnalysis,
            bailEvaluation,
            analyzedAt: new Date()
          } 
        }
      );
      
      // Log audit
      await createAuditLog(user._id.toString(), 'Bail Evaluation Run', { caseId, firNumber: caseData.firNumber });
      
      return NextResponse.json({ legalAnalysis, bailEvaluation });
    }
    
    // Get case report data
    if (path.includes('/report')) {
      const user = await getSession(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const caseId = path.split('/')[2];
      const casesCollection = db.collection('cases');
      const caseData = await casesCollection.findOne({ _id: new ObjectId(caseId) });
      
      if (!caseData) {
        return NextResponse.json({ error: 'Case not found' }, { status: 404 });
      }
      
      // Log audit
      await createAuditLog(user._id.toString(), 'Report Generated', { caseId, firNumber: caseData.firNumber });
      
      return NextResponse.json({
        case: caseData,
        officer: user,
        generatedAt: new Date()
      });
    }
    
    // Get audit logs (Admin only)
    if (path === '/audit/logs') {
      const user = await getSession(request);
      if (!user || user.role !== 'Admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      
      const auditCollection = db.collection('auditLogs');
      const usersCollection = db.collection('users');
      
      const logs = await auditCollection.find({}).sort({ timestamp: -1 }).limit(100).toArray();
      
      // Enrich with user data
      const enrichedLogs = await Promise.all(logs.map(async (log) => {
        const user = await usersCollection.findOne({ _id: new ObjectId(log.userId) });
        return {
          ...log,
          id: log._id.toString(),
          userName: user ? user.name : 'Unknown',
          userEmail: user ? user.email : 'Unknown'
        };
      }));
      
      return NextResponse.json(enrichedLogs);
    }
    
    // Get dashboard stats
    if (path === '/dashboard/stats') {
      const user = await getSession(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const casesCollection = db.collection('cases');
      
      const totalCases = await casesCollection.countDocuments();
      const underReview = await casesCollection.countDocuments({ status: 'Under Review' });
      const bailRecommended = await casesCollection.countDocuments({ 
        'bailEvaluation.recommendation': 'Bail Recommended' 
      });
      const bailRejected = await casesCollection.countDocuments({ 
        'bailEvaluation.recommendation': 'Bail Not Recommended' 
      });
      
      return NextResponse.json({
        totalCases,
        underReview,
        bailRecommended,
        bailRejected
      });
    }
    
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  
  try {
    const db = await connectDB();
    const body = await request.json();
    
    // Login
    if (path === '/auth/login') {
      const { email, password } = body;
      const usersCollection = db.collection('users');
      const user = await usersCollection.findOne({ 
        email, 
        password: hashPassword(password),
        active: true 
      });
      
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      
      // Create session
      const sessionToken = generateSessionToken();
      const sessionsCollection = db.collection('sessions');
      
      await sessionsCollection.insertOne({
        token: sessionToken,
        userId: user._id.toString(),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });
      
      // Log audit
      await createAuditLog(user._id.toString(), 'Login', { email });
      
      const response = NextResponse.json({ 
        success: true, 
        user: { 
          id: user._id.toString(), 
          name: user.name, 
          email: user.email, 
          role: user.role 
        } 
      });
      
      response.cookies.set('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60,
        path: '/'
      });
      
      return response;
    }
    
    // Logout
    if (path === '/auth/logout') {
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get('session')?.value;
      
      if (sessionToken) {
        const sessionsCollection = db.collection('sessions');
        await sessionsCollection.deleteOne({ token: sessionToken });
      }
      
      const response = NextResponse.json({ success: true });
      response.cookies.delete('session');
      
      return response;
    }
    
    // Create user (Admin only)
    if (path === '/users') {
      const user = await getSession(request);
      if (!user || user.role !== 'Admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      
      const { name, email, password, role } = body;
      const usersCollection = db.collection('users');
      
      // Check if user exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }
      
      const newUser = {
        name,
        email,
        password: hashPassword(password),
        role: role || 'Legal Officer',
        active: true,
        createdAt: new Date()
      };
      
      const result = await usersCollection.insertOne(newUser);
      
      // Log audit
      await createAuditLog(user._id.toString(), 'User Created', { email, role: newUser.role });
      
      return NextResponse.json({ success: true, userId: result.insertedId.toString() });
    }
    
    // Create case
    if (path === '/cases') {
      const user = await getSession(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const caseData = {
        ...body,
        status: 'Registered',
        createdBy: user._id.toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const casesCollection = db.collection('cases');
      const result = await casesCollection.insertOne(caseData);
      
      // Log audit
      await createAuditLog(user._id.toString(), 'Case Created', { 
        caseId: result.insertedId.toString(), 
        firNumber: body.firNumber 
      });
      
      return NextResponse.json({ success: true, caseId: result.insertedId.toString() });
    }
    
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  
  try {
    const db = await connectDB();
    const body = await request.json();
    
    // Update user (Admin only)
    if (path.startsWith('/users/')) {
      const user = await getSession(request);
      if (!user || user.role !== 'Admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      
      const userId = path.split('/')[2];
      const usersCollection = db.collection('users');
      
      const updateData = { ...body };
      if (body.password) {
        updateData.password = hashPassword(body.password);
      }
      delete updateData.id;
      delete updateData._id;
      
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData }
      );
      
      // Log audit
      await createAuditLog(user._id.toString(), 'User Updated', { userId, email: body.email });
      
      return NextResponse.json({ success: true });
    }
    
    // Update case
    if (path.startsWith('/cases/')) {
      const user = await getSession(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const caseId = path.split('/')[2];
      const casesCollection = db.collection('cases');
      
      const updateData = { ...body, updatedAt: new Date() };
      delete updateData.id;
      delete updateData._id;
      
      await casesCollection.updateOne(
        { _id: new ObjectId(caseId) },
        { $set: updateData }
      );
      
      // Log audit
      await createAuditLog(user._id.toString(), 'Case Updated', { 
        caseId, 
        firNumber: body.firNumber,
        status: body.status 
      });
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  
  try {
    const db = await connectDB();
    
    // Soft delete user (Admin only)
    if (path.startsWith('/users/')) {
      const user = await getSession(request);
      if (!user || user.role !== 'Admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      
      const userId = path.split('/')[2];
      const usersCollection = db.collection('users');
      
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { active: false } }
      );
      
      // Log audit
      await createAuditLog(user._id.toString(), 'User Disabled', { userId });
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}