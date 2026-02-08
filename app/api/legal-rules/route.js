import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGO_URL;

export async function GET() {
  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db('bailRecognizerDB');
    const rulesCollection = db.collection('legalRules');
    
    const rules = await rulesCollection.find({}).toArray();
    
    return NextResponse.json(rules);
  } catch (error) {
    console.error('Error fetching legal rules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch legal rules' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
