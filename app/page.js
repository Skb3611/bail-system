'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scale, Users, FileText, LogOut, Menu, X, BarChart3, AlertCircle, CheckCircle, XCircle, Clock, Printer, Shield, FileCheck, Book } from 'lucide-react';
import { LegalRules } from '@/components/LegalRules';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Forms and data
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dashboard stats
  const [stats, setStats] = useState({ totalCases: 0, underReview: 0, bailRecommended: 0, bailRejected: 0 });
  
  // Cases
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseForm, setCaseForm] = useState({
    firNumber: '',
    caseTitle: '',
    policeStation: '',
    accusedName: '',
    age: '',
    gender: '',
    ipcSections: '',
    crpcSections: '',
    offenseType: 'Unknown',
    caseDescription: '',
    arrestDate: ''
  });
  
  // Users
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'Legal Officer' });
  const [editingUser, setEditingUser] = useState(null);
  
  // Audit logs
  const [auditLogs, setAuditLogs] = useState([]);
  
  useEffect(() => {
    checkSession();
  }, []);
  
  useEffect(() => {
    if (user && currentPage === 'dashboard') {
      loadDashboardStats();
    }
  }, [user, currentPage]);
  
  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          setCurrentPage('dashboard');
        }
      }
    } catch (err) {
      console.error('Session check failed:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setCurrentPage('dashboard');
        setLoginForm({ email: '', password: '' });
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };
  
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setCurrentPage('login');
  };
  
  const loadDashboardStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };
  
  const loadCases = async () => {
    try {
      const res = await fetch('/api/cases');
      if (res.ok) {
        const data = await res.json();
        setCases(data);
      }
    } catch (err) {
      console.error('Failed to load cases:', err);
    }
  };
  
  const loadCase = async (caseId) => {
    try {
      const res = await fetch(`/api/cases/${caseId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedCase(data);
        setCaseForm(data);
      }
    } catch (err) {
      console.error('Failed to load case:', err);
    }
  };
  
  const handleCreateCase = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseForm)
      });
      
      const data = await res.json();
      if (res.ok) {
        setSuccess('Case registered successfully!');
        setCaseForm({
          firNumber: '',
          caseTitle: '',
          policeStation: '',
          accusedName: '',
          age: '',
          gender: '',
          ipcSections: '',
          crpcSections: '',
          offenseType: 'Unknown',
          caseDescription: '',
          arrestDate: ''
        });
        setTimeout(() => {
          setCurrentPage('cases');
          loadCases();
        }, 1500);
      } else {
        setError(data.error || 'Failed to create case');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };
  
  const handleUpdateCase = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/cases/${selectedCase.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseForm)
      });
      
      if (res.ok) {
        setSuccess('Case updated successfully!');
        await loadCase(selectedCase.id);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update case');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };
  
  const analyzeCase = async (caseId) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/cases/${caseId}/analyze`);
      if (res.ok) {
        const data = await res.json();
        setSuccess('Bail eligibility analysis completed!');
        await loadCase(caseId);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };
  
  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };
  
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });
      
      const data = await res.json();
      if (res.ok) {
        setSuccess('User created successfully!');
        setUserForm({ name: '', email: '', password: '', role: 'Legal Officer' });
        loadUsers();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to create user');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };
  
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const updateData = { ...userForm };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      if (res.ok) {
        setSuccess('User updated successfully!');
        setEditingUser(null);
        setUserForm({ name: '', email: '', password: '', role: 'Legal Officer' });
        loadUsers();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update user');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };
  
  const handleDisableUser = async (userId) => {
    if (!confirm('Are you sure you want to disable this user?')) return;
    
    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('User disabled successfully!');
        loadUsers();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to disable user');
    }
  };

  const handleEnableUser = async (userId) => {
    if (!confirm('Are you sure you want to enable this user?')) return;
    
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: true })
      });
      
      if (res.ok) {
        setSuccess('User enabled successfully!');
        loadUsers();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to enable user');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const handleBatchAnalyze = async () => {
    if (!confirm('This will re-analyze ALL cases. Continue?')) return;
    
    setError('');
    setSuccess('Starting batch analysis...');
    
    try {
      const res = await fetch('/api/cases/analyze-all', {
        method: 'POST'
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(`Batch analysis completed! Analyzed ${data.count} cases.`);
        if (currentPage === 'dashboard') loadDashboardStats();
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.error || 'Batch analysis failed');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const loadAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit/logs');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    }
  };
  
  const navigateTo = (page) => {
    setCurrentPage(page);
    setError('');
    setSuccess('');
    
    if (page === 'cases') loadCases();
    if (page === 'users') loadUsers();
    if (page === 'audit') loadAuditLogs();
    if (page === 'dashboard') loadDashboardStats();
    // if (page === 'legal-rules') window.location.href = '/legal-rules';
  };
  
  const openReport = (caseData) => {
    setSelectedCase(caseData);
    setCurrentPage('report');
  };
  
  const printReport = () => {
    window.print();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Scale className="w-16 h-16 mx-auto mb-4 text-slate-700 animate-pulse" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Login Page
  if (currentPage === 'login' || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="bg-slate-900 p-4 rounded-full">
                <Scale className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Bail Recognizer System</CardTitle>
            <CardDescription>Sign in to manage legal cases</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@bailsystem.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              
              <div className="text-xs text-center text-slate-500 mt-4">
                <p>Default credentials:</p>
                <p className="font-mono mt-1">admin@bailsystem.com / admin123</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Main Dashboard Layout
  return (
    <div className="max-h-screen h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-slate-900 text-white transition-all duration-300 overflow-hidden print:hidden h-full`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <Scale className="w-8 h-8" />
            <div>
              <h1 className="font-bold text-lg">Bail Recognizer</h1>
              <p className="text-xs text-slate-400">Legal System</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            <button
              onClick={() => navigateTo('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => navigateTo('cases')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'cases' || currentPage === 'case-new' || currentPage === 'case-detail' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Cases</span>
            </button>

            <button
              onClick={() => navigateTo('legal-rules')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'legal-rules' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Book className="w-5 h-5" />
              <span>Legal Rules</span>
            </button>
            
            {user.role === 'Admin' && (
              <>
                <button
                  onClick={() => navigateTo('users')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === 'users' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>Users</span>
                </button>
                
                <button
                  onClick={() => navigateTo('audit')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === 'audit' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span>Audit Logs</span>
                </button>
              </>
            )}
          </nav>
          
          <div className="mt-auto pt-8 border-t border-slate-800">
            <div className="mb-4">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
            <Button onClick={handleLogout} variant="destructive" className="w-full" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex items-center gap-4 print:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <h2 className="text-xl font-semibold text-slate-800">
            {currentPage === 'dashboard' && 'Dashboard'}
            {currentPage === 'cases' && 'Cases'}
            {currentPage === 'case-new' && 'Register New Case'}
            {currentPage === 'case-detail' && 'Case Details'}
            {currentPage === 'users' && 'User Management'}
            {currentPage === 'audit' && 'Audit Logs'}
            {currentPage === 'report' && 'Bail Recommendation Report'}
            {currentPage === 'legal-rules' && 'Legal Rules Database'}
          </h2>
        </header>
        
        <div className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}
          
          {/* Dashboard */}
          {currentPage === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">Total Cases</CardTitle>
                    <FileText className="w-4 h-4 text-slate-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalCases}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">Under Review</CardTitle>
                    <Clock className="w-4 h-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-600">{stats.underReview}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">Bail Recommended</CardTitle>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{stats.bailRecommended}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">Bail Rejected</CardTitle>
                    <XCircle className="w-4 h-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">{stats.bailRejected}</div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks for case management</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <Button onClick={() => navigateTo('case-new')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Register New Case
                  </Button>
                  <Button variant="outline" onClick={() => navigateTo('cases')}>
                    View All Cases
                  </Button>
                  <Button variant="outline" onClick={handleBatchAnalyze}>
                    <Scale className="w-4 h-4 mr-2" />
                    Analyze All Cases
                  </Button>
                  {user.role === 'Admin' && (
                    <Button variant="outline" onClick={() => navigateTo('users')}>
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Cases List */}
          {currentPage === 'cases' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">All Cases</h3>
                <Button onClick={() => navigateTo('case-new')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Register New Case
                </Button>
              </div>
              
              <div className="grid gap-4">
                {cases.map((c) => (
                  <Card key={c.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
                    loadCase(c.id);
                    setCurrentPage('case-detail');
                  }}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{c.caseTitle}</CardTitle>
                          <CardDescription className="mt-1">
                            FIR: {c.firNumber} | {c.policeStation}
                          </CardDescription>
                        </div>
                        <Badge variant={c.status === 'Registered' ? 'secondary' : c.status === 'Under Review' ? 'default' : c.status === 'Closed' ? 'outline' : 'default'}>
                          {c.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Accused:</p>
                          <p className="font-medium">{c.accusedName}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">IPC Sections:</p>
                          <p className="font-medium">{c.ipcSections || 'N/A'}</p>
                        </div>
                      </div>
                      {c.bailEvaluation && (
                        <div className="mt-4 pt-4 border-t">
                          <Badge variant={c.bailEvaluation.eligibility === 'Eligible' ? 'default' : c.bailEvaluation.eligibility === 'Not Eligible' ? 'destructive' : 'secondary'}>
                            {c.bailEvaluation.recommendation}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {cases.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-600">No cases registered yet</p>
                      <Button className="mt-4" onClick={() => navigateTo('case-new')}>Register First Case</Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
          
          {/* New Case Form */}
          {currentPage === 'case-new' && (
            <Card>
              <CardHeader>
                <CardTitle>Register New Case</CardTitle>
                <CardDescription>Enter case details and legal sections</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCase} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firNumber">FIR Number *</Label>
                      <Input
                        id="firNumber"
                        value={caseForm.firNumber}
                        onChange={(e) => setCaseForm({ ...caseForm, firNumber: e.target.value })}
                        required
                        placeholder="e.g., FIR/2024/001"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="policeStation">Police Station *</Label>
                      <Input
                        id="policeStation"
                        value={caseForm.policeStation}
                        onChange={(e) => setCaseForm({ ...caseForm, policeStation: e.target.value })}
                        required
                        placeholder="e.g., Central Police Station"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="caseTitle">Case Title *</Label>
                    <Input
                      id="caseTitle"
                      value={caseForm.caseTitle}
                      onChange={(e) => setCaseForm({ ...caseForm, caseTitle: e.target.value })}
                      required
                      placeholder="Brief title of the case"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accusedName">Accused Name *</Label>
                      <Input
                        id="accusedName"
                        value={caseForm.accusedName}
                        onChange={(e) => setCaseForm({ ...caseForm, accusedName: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={caseForm.age}
                        onChange={(e) => setCaseForm({ ...caseForm, age: e.target.value })}
                        placeholder="e.g., 35"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={caseForm.gender} onValueChange={(value) => setCaseForm({ ...caseForm, gender: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ipcSections">IPC Sections *</Label>
                      <Input
                        id="ipcSections"
                        value={caseForm.ipcSections}
                        onChange={(e) => setCaseForm({ ...caseForm, ipcSections: e.target.value })}
                        required
                        placeholder="e.g., 302, 307, 120B"
                      />
                      <p className="text-xs text-slate-500">Separate multiple sections with commas</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="crpcSections">CrPC Sections</Label>
                      <Input
                        id="crpcSections"
                        value={caseForm.crpcSections}
                        onChange={(e) => setCaseForm({ ...caseForm, crpcSections: e.target.value })}
                        placeholder="e.g., 41, 154"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="offenseType">Offense Type</Label>
                      <Select value={caseForm.offenseType} onValueChange={(value) => setCaseForm({ ...caseForm, offenseType: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bailable">Bailable</SelectItem>
                          <SelectItem value="Non-Bailable">Non-Bailable</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="arrestDate">Arrest Date</Label>
                      <Input
                        id="arrestDate"
                        type="date"
                        value={caseForm.arrestDate}
                        onChange={(e) => setCaseForm({ ...caseForm, arrestDate: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="caseDescription">Case Description</Label>
                    <Textarea
                      id="caseDescription"
                      value={caseForm.caseDescription}
                      onChange={(e) => setCaseForm({ ...caseForm, caseDescription: e.target.value })}
                      rows={4}
                      placeholder="Detailed description of the case..."
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <Button type="submit">
                      Register Case
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigateTo('cases')}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          
          {/* Case Detail */}
          {currentPage === 'case-detail' && selectedCase && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigateTo('cases')}>
                  ← Back to Cases
                </Button>
                <Button variant="outline" onClick={() => analyzeCase(selectedCase.id)}>
                  <Scale className="w-4 h-4 mr-2" />
                  Run Bail Analysis
                </Button>
                {selectedCase.bailEvaluation && (
                  <Button variant="outline" onClick={() => openReport(selectedCase)}>
                    <Printer className="w-4 h-4 mr-2" />
                    View Report
                  </Button>
                )}
              </div>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedCase.caseTitle}</CardTitle>
                      <CardDescription>FIR: {selectedCase.firNumber}</CardDescription>
                    </div>
                    <Badge>{selectedCase.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateCase} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Police Station</Label>
                        <Input
                          value={caseForm.policeStation}
                          onChange={(e) => setCaseForm({ ...caseForm, policeStation: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={caseForm.status} onValueChange={(value) => setCaseForm({ ...caseForm, status: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Registered">Registered</SelectItem>
                            <SelectItem value="Under Review">Under Review</SelectItem>
                            <SelectItem value="Bail Recommended">Bail Recommended</SelectItem>
                            <SelectItem value="Bail Rejected">Bail Rejected</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Accused Name</Label>
                        <Input
                          value={caseForm.accusedName}
                          onChange={(e) => setCaseForm({ ...caseForm, accusedName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Age</Label>
                        <Input
                          value={caseForm.age}
                          onChange={(e) => setCaseForm({ ...caseForm, age: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Input
                          value={caseForm.gender}
                          onChange={(e) => setCaseForm({ ...caseForm, gender: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>IPC Sections</Label>
                        <Input
                          value={caseForm.ipcSections}
                          onChange={(e) => setCaseForm({ ...caseForm, ipcSections: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>CrPC Sections</Label>
                        <Input
                          value={caseForm.crpcSections}
                          onChange={(e) => setCaseForm({ ...caseForm, crpcSections: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Case Description</Label>
                      <Textarea
                        value={caseForm.caseDescription}
                        onChange={(e) => setCaseForm({ ...caseForm, caseDescription: e.target.value })}
                        rows={4}
                      />
                    </div>
                    
                    <Button type="submit">Update Case</Button>
                  </form>
                </CardContent>
              </Card>
              
              {/* Legal Analysis Results */}
              {selectedCase.legalAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>Legal Section Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-600 mb-2">Identified IPC Sections:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedCase.legalAnalysis.ipcSections.map((sec) => (
                            <Badge key={sec} variant="outline">IPC {sec}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-slate-600 mb-2">Matched Rules:</p>
                        <div className="space-y-2">
                          {selectedCase.legalAnalysis.matchedRules.map((rule, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div>
                                <p className="font-medium">IPC {rule.section} - {rule.offense}</p>
                                <p className="text-sm text-slate-600">{rule.description}</p>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant={rule.category === 'Bailable' ? 'default' : 'destructive'}>
                                  {rule.category}
                                </Badge>
                                <Badge variant="outline">
                                  {rule.riskLevel} Risk
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-slate-100 rounded-lg">
                        <p className="text-sm font-medium mb-1">Overall Risk Assessment</p>
                        <Badge variant={selectedCase.legalAnalysis.maxRiskLevel === 'High' ? 'destructive' : selectedCase.legalAnalysis.maxRiskLevel === 'Medium' ? 'default' : 'secondary'}>
                          {selectedCase.legalAnalysis.maxRiskLevel} Risk Level
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Bail Evaluation */}
              {selectedCase.bailEvaluation && (
                <Card>
                  <CardHeader>
                    <CardTitle>Bail Eligibility Evaluation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600 mb-2">Eligibility Status:</p>
                        <Badge 
                          variant={selectedCase.bailEvaluation.eligibility === 'Eligible' ? 'default' : selectedCase.bailEvaluation.eligibility === 'Not Eligible' ? 'destructive' : 'secondary'}
                          className="text-lg px-4 py-2"
                        >
                          {selectedCase.bailEvaluation.eligibility}
                        </Badge>
                      </div>
                      
                      <div className="p-4 border-2 rounded-lg border-slate-200">
                        <p className="text-sm text-slate-600 mb-2">Recommendation:</p>
                        <p className="text-xl font-semibold text-slate-800">{selectedCase.bailEvaluation.recommendation}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-slate-600 mb-2">Reasoning:</p>
                        <p className="text-slate-700">{selectedCase.bailEvaluation.reasoning}</p>
                      </div>
                      
                      {selectedCase.bailEvaluation.conditions.length > 0 && (
                        <div>
                          <p className="text-sm text-slate-600 mb-2">Conditions (if bail granted):</p>
                          <ul className="list-disc list-inside space-y-1">
                            {selectedCase.bailEvaluation.conditions.map((condition, idx) => (
                              <li key={idx} className="text-slate-700">{condition}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          {/* Report Page */}
          {currentPage === 'report' && selectedCase && (
            <div className="bg-white">
              <div className="print:hidden mb-4 flex gap-4">
                <Button variant="outline" onClick={() => navigateTo('case-detail')}>
                  ← Back to Case
                </Button>
                <Button onClick={printReport}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Report
                </Button>
              </div>
              
              <Card className="max-w-4xl mx-auto">
                <CardHeader className="text-center border-b-2 border-slate-900 pb-6">
                  <div className="flex justify-center mb-4">
                    <Scale className="w-16 h-16 text-slate-900" />
                  </div>
                  <CardTitle className="text-3xl mb-2">BAIL RECOMMENDATION REPORT</CardTitle>
                  <CardDescription className="text-base">Bail Recognizer System</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3 border-b pb-2">Case Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">FIR Number:</p>
                        <p className="font-medium">{selectedCase.firNumber}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Case Title:</p>
                        <p className="font-medium">{selectedCase.caseTitle}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Police Station:</p>
                        <p className="font-medium">{selectedCase.policeStation}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Status:</p>
                        <p className="font-medium">{selectedCase.status}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Accused Name:</p>
                        <p className="font-medium">{selectedCase.accusedName}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Age / Gender:</p>
                        <p className="font-medium">{selectedCase.age} / {selectedCase.gender}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">IPC Sections:</p>
                        <p className="font-medium">{selectedCase.ipcSections}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">CrPC Sections:</p>
                        <p className="font-medium">{selectedCase.crpcSections || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedCase.legalAnalysis && (
                    <div>
                      <h3 className="font-bold text-lg mb-3 border-b pb-2">Legal Analysis</h3>
                      <div className="space-y-3">
                        {selectedCase.legalAnalysis.matchedRules.map((rule, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded">
                            <p className="font-medium">IPC Section {rule.section} - {rule.offense}</p>
                            <p className="text-sm text-slate-600">{rule.description}</p>
                            <div className="flex gap-2 mt-2">
                              <span className="text-xs px-2 py-1 bg-slate-200 rounded">{rule.category}</span>
                              <span className="text-xs px-2 py-1 bg-slate-200 rounded">{rule.riskLevel} Risk</span>
                            </div>
                          </div>
                        ))}
                        <div className="p-3 bg-slate-100 rounded">
                          <p className="font-medium">Overall Risk Assessment: {selectedCase.legalAnalysis.maxRiskLevel}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedCase.bailEvaluation && (
                    <div>
                      <h3 className="font-bold text-lg mb-3 border-b pb-2">Bail Eligibility Evaluation</h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-slate-50 rounded">
                          <p className="text-sm text-slate-600">Eligibility Status:</p>
                          <p className="text-xl font-bold mt-1">{selectedCase.bailEvaluation.eligibility}</p>
                        </div>
                        
                        <div className="p-4 border-2 border-slate-900 rounded">
                          <p className="text-sm text-slate-600">Official Recommendation:</p>
                          <p className="text-2xl font-bold mt-1">{selectedCase.bailEvaluation.recommendation}</p>
                        </div>
                        
                        <div>
                          <p className="font-medium mb-2">Reasoning:</p>
                          <p className="text-slate-700">{selectedCase.bailEvaluation.reasoning}</p>
                        </div>
                        
                        {selectedCase.bailEvaluation.conditions.length > 0 && (
                          <div>
                            <p className="font-medium mb-2">Conditions for Bail:</p>
                            <ol className="list-decimal list-inside space-y-1">
                              {selectedCase.bailEvaluation.conditions.map((condition, idx) => (
                                <li key={idx} className="text-slate-700">{condition}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-6 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Report Generated By:</p>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-slate-600">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-600">Date:</p>
                        <p className="font-medium">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-slate-600">Time: {new Date().toLocaleTimeString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center text-xs text-slate-500 pt-4 border-t">
                    <p>This is a system-generated report from Bail Recognizer System</p>
                    <p className="mt-1">Report ID: {selectedCase.id}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Users Management */}
          {currentPage === 'users' && user.role === 'Admin' && (
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{editingUser ? 'Edit User' : 'Create New User'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={userForm.name}
                          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Password {editingUser && '(leave blank to keep current)'}</Label>
                        <Input
                          type="password"
                          value={userForm.password}
                          onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                          required={!editingUser}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select value={userForm.role} onValueChange={(value) => setUserForm({ ...userForm, role: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Legal Officer">Legal Officer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button type="submit">{editingUser ? 'Update User' : 'Create User'}</Button>
                      {editingUser && (
                        <Button type="button" variant="outline" onClick={() => {
                          setEditingUser(null);
                          setUserForm({ name: '', email: '', password: '', role: 'Legal Officer' });
                        }}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-sm text-slate-600">{u.email}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge>{u.role}</Badge>
                            <Badge variant={u.active ? 'default' : 'destructive'}>
                              {u.active ? 'Active' : 'Disabled'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => {
                            setEditingUser(u);
                            setUserForm({ name: u.name, email: u.email, password: '', role: u.role });
                          }}>
                            Edit
                          </Button>
                          {u.active && (
                            <Button size="sm" variant="destructive" onClick={() => handleDisableUser(u.id)}>
                              Disable
                            </Button>
                          )}
                          {!u.active && (
                            <Button size="sm" variant="default" onClick={() => handleEnableUser(u.id)}>
                              Enable
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Audit Logs */}
          {currentPage === 'audit' && user.role === 'Admin' && (
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>System activity and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-slate-600">By: {log.userName} ({log.userEmail})</p>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <p className="text-xs text-slate-500 mt-1">
                            {JSON.stringify(log.details)}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm text-slate-500">
                        <p>{new Date(log.timestamp).toLocaleDateString()}</p>
                        <p>{new Date(log.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                  
                  {auditLogs.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Shield className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>No audit logs yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          {currentPage === 'legal-rules' && (
            <LegalRules />
          )}
        </div>
      </main>
    </div>
  );
}