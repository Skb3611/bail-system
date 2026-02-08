# Dummy Data Summary

This document lists all the dummy data that has been added to the Bail Recognizer System for testing and demonstration purposes.

## 📊 Statistics Overview

- **Total Users**: 5 (1 existing + 4 new)
- **Total Cases**: 13 (3 existing + 10 new)
- **Total Audit Logs**: 15+
- **Analyzed Cases**: 11 cases with bail recommendations

## 👥 Users Added

### 1. Rahul Sharma
- **Email**: rahul.sharma@bailsystem.com
- **Password**: officer123
- **Role**: Legal Officer
- **Status**: Active
- **Created**: January 15, 2024

### 2. Priya Patel
- **Email**: priya.patel@bailsystem.com
- **Password**: officer123
- **Role**: Legal Officer
- **Status**: Active
- **Created**: January 20, 2024

### 3. Amit Kumar
- **Email**: amit.kumar@bailsystem.com
- **Password**: admin123
- **Role**: Admin
- **Status**: Active
- **Created**: January 10, 2024

### 4. Sneha Reddy (Disabled)
- **Email**: sneha.reddy@bailsystem.com
- **Password**: officer123
- **Role**: Legal Officer
- **Status**: Inactive
- **Created**: December 1, 2023

## 📁 Cases Added

### 1. Domestic Violence Case
- **FIR**: FIR/2024/004
- **Police Station**: Women Police Station
- **Accused**: Rajesh Verma (Male, 42)
- **IPC Sections**: 498A, 323
- **Status**: Under Review
- **Bail Recommendation**: ✅ **Bail Recommended** (IPC 323 matched - Bailable offense)

### 2. Cheating and Forgery Case
- **FIR**: FIR/2024/005
- **Police Station**: Economic Offences Wing
- **Accused**: Suresh Malhotra (Male, 38)
- **IPC Sections**: 420, 406, 468
- **Amount Involved**: Rs. 25 lakhs
- **Status**: Registered
- **Bail Recommendation**: ✅ **Bail Recommended** (All bailable offenses)

### 3. Armed Robbery at Jewelry Store
- **FIR**: FIR/2024/006
- **Police Station**: City Central Police Station
- **Accused**: Vikram Singh (Male, 29)
- **IPC Sections**: 392, 397, 120B
- **Value Stolen**: Rs. 50 lakhs
- **Status**: Registered
- **Bail Recommendation**: ❌ **Bail Not Recommended** (Non-bailable, High Risk)

### 4. Simple Theft - Mobile Phone
- **FIR**: FIR/2024/007
- **Police Station**: Railway Police Station
- **Accused**: Ramesh Yadav (Male, 24)
- **IPC Sections**: 379
- **Status**: Registered
- **Note**: First-time offender
- **Bail Recommendation**: ✅ **Bail Recommended** (Bailable offense, Low Risk)

### 5. Assault Case - Senior Citizen
- **FIR**: FIR/2024/008
- **Police Station**: North Zone Police Station
- **Accused**: Mahendra Gupta (Male, 67) - **Senior Citizen**
- **IPC Sections**: 323, 341
- **Status**: Registered
- **Note**: Land dispute, no prior criminal record
- **Bail Recommendation**: ✅ **Bail Recommended** (All bailable offenses)

### 6. Molestation Case
- **FIR**: FIR/2024/009
- **Police Station**: Women Police Station
- **Accused**: Karan Malhotra (Male, 31)
- **IPC Sections**: 354, 509
- **Status**: Under Review
- **Bail Recommendation**: ⚠️ **Conditional Bail Recommended** (Non-bailable but Medium Risk)

### 7. Culpable Homicide Case
- **FIR**: FIR/2024/010
- **Police Station**: Highway Police Station
- **Accused**: Deepak Chauhan (Male, 35)
- **IPC Sections**: 304, 279, 338
- **Status**: Registered
- **Note**: Rash driving under influence, 2 deaths
- **Bail Recommendation**: ❌ **Bail Not Recommended** (Non-bailable, High Risk)

### 8. Criminal Trespass and Intimidation
- **FIR**: FIR/2023/145
- **Police Station**: South Police Station
- **Accused**: Naveen Kumar (Male, 28)
- **IPC Sections**: 447, 506
- **Status**: Bail Recommended
- **Note**: Property dispute case

### 9. Attempt to Murder - Stabbing
- **FIR**: FIR/2023/158
- **Police Station**: East Zone Police Station
- **Accused**: Sanjay Rana (Male, 33)
- **IPC Sections**: 307, 324
- **Status**: Bail Rejected
- **Note**: Previous criminal record

### 10. House Burglary
- **FIR**: FIR/2024/011
- **Police Station**: West Zone Police Station
- **Accused**: Ajay Thakur (Male, 26)
- **IPC Sections**: 380, 457
- **Value Stolen**: Rs. 2 lakhs
- **Status**: Registered
- **Note**: Fingerprints matched at crime scene
- **Bail Recommendation**: ⚠️ **Conditional Bail Recommended** (Non-bailable but Medium Risk)

## 📈 Dashboard Statistics

After adding dummy data, the dashboard shows:

- **Total Cases**: 13
- **Under Review**: 2
- **Bail Recommended**: 5
- **Bail Rejected**: 3

## 🎯 Bail Recommendation Breakdown

### ✅ Bail Recommended (5 cases)
1. Minor Theft Case (379, 420)
2. Domestic Violence (498A, 323)
3. Cheating and Forgery (420, 406)
4. Simple Theft (379)
5. Senior Citizen Assault (323, 341)

### ❌ Bail Not Recommended (3 cases)
1. Test Murder Case (302, 307)
2. Armed Robbery (392, 397)
3. Culpable Homicide (304, 279, 338)

### ⚠️ Conditional Bail Recommended (3 cases)
1. Senior Citizen Case (324) - Age consideration
2. Molestation Case (354, 509)
3. House Burglary (380, 457)

## 🔐 Login Credentials

### Admin Accounts
```
Email: admin@bailsystem.com
Password: admin123

Email: amit.kumar@bailsystem.com
Password: admin123
```

### Legal Officer Accounts
```
Email: rahul.sharma@bailsystem.com
Password: officer123

Email: priya.patel@bailsystem.com
Password: officer123
```

### Disabled Account (for testing)
```
Email: sneha.reddy@bailsystem.com
Password: officer123
Status: Cannot login (disabled)
```

## 🧪 Testing Scenarios

### Role-Based Access Testing
1. **Admin Login**: Has access to Dashboard, Cases, Users, Audit Logs
2. **Officer Login**: Has access to Dashboard and Cases only (no Users/Audit Logs menu)
3. **Disabled User**: Cannot login

### Case Operations Testing
1. View all cases
2. View case details
3. Update case information
4. Change case status
5. Run bail analysis
6. Generate reports

### User Management Testing (Admin only)
1. Create new users
2. Edit user details
3. Change user roles
4. Disable users
5. View all users

### Audit Log Testing (Admin only)
1. View all system activities
2. Track user logins
3. Monitor case operations
4. Review bail evaluations

## 📝 Sample Case Scenarios

### Scenario 1: Simple Bailable Offense
- **Case**: Simple Theft - Mobile Phone
- **Logic**: All sections bailable → Bail Recommended
- **Conditions**: Personal bond, Court appearance

### Scenario 2: Serious Non-Bailable Offense
- **Case**: Armed Robbery
- **Logic**: Non-bailable + High Risk → Bail Not Recommended
- **Reason**: Serious crime with high risk to society

### Scenario 3: Senior Citizen Consideration
- **Case**: Senior Citizen Assault (Age 67)
- **Logic**: Non-bailable but Age > 60 → Conditional Bail
- **Conditions**: Surety Rs. 50,000, Weekly reporting, Travel restriction

### Scenario 4: Non-Bailable with Medium Risk
- **Case**: House Burglary (IPC 380)
- **Logic**: Non-bailable + Medium Risk → Conditional Bail
- **Conditions**: Surety Rs. 1,00,000, Bi-weekly reporting, District restriction

## 🎨 UI Features Demonstrated

1. **Dashboard Cards**: Live statistics with color coding
2. **Case Cards**: Badges showing bail recommendations
3. **User Cards**: Role and status badges
4. **Audit Logs**: Timeline view with action details
5. **Forms**: Comprehensive validation
6. **Reports**: Print-ready professional format
7. **Role-based Menus**: Different navigation for Admin vs Officer

## 📊 Database Collections

All data is stored in MongoDB database: `bailRecognizerDB`

**Collections:**
- `users`: 5 documents
- `cases`: 13 documents
- `legalRules`: 16 documents (IPC sections)
- `auditLogs`: 15+ documents
- `sessions`: Active user sessions

---

**Note**: This is test data for demonstration purposes. In production, use real case data and secure password management.
