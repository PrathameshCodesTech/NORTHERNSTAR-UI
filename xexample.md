Perfect! Let's systematically test Phase 2 - Template Management APIs. Here's a comprehensive testing plan for all the endpoints you've listed.

***

# 🧪 Phase 2: Template Management API Testing Plan

***

## **Prerequisites**

1. ✅ Django server running
2. ✅ Database migrated and seeded
3. ✅ Superuser created and logged in
4. ✅ Get JWT access token for superuser

***

## **Get Superuser Token First**

```
POST http://localhost:8000/api/v2/auth/login/
{
  "username": "admin",
  "password": "your_password"
}

Response:
{
  "tokens": {
    "access": "eyJ0eXAi...",
    "refresh": "eyJ0eXAi..."
  }
}
```

Use the `access` token in all subsequent requests:
```
Headers:
Authorization: Bearer <access_token>
```

***

## **Test Sequence**

### **1. Framework Categories** 📁

#### **1.1 List Categories**
```
GET /api/v1/templates/framework-categories/
Expected: List of 5 seeded categories (FIN, SEC, PRIV, HEALTH, IND)
```

#### **1.2 Create New Category**
```
POST /api/v1/templates/framework-categories/
{
  "name": "Environmental Compliance",
  "code": "ENV",
  "description": "Environmental regulations",
  "icon": "leaf",
  "color": "#22C55E",
  "sort_order": 6
}
Expected: 201 Created
```

***

### **2. Frameworks** 🏗️

#### **2.1 List Frameworks**
```
GET /api/v1/templates/frameworks/
Expected: List of frameworks (may include SOX if created earlier)
```

#### **2.2 Create Framework**
```
POST /api/v1/templates/frameworks/
{
  "name": "SOX",
  "full_name": "Sarbanes-Oxley Act",
  "description": "US federal law for financial reporting",
  "version": "2024.1",
  "status": "ACTIVE",
  "category": "<fin-category-uuid>",
  "applicable_industries": ["Finance", "Public Companies"],
  "applicable_regions": ["US"],
  "compliance_authority": "SEC",
  "is_current_version": true
}
Expected: 201 Created
```

#### **2.3 Get Framework Details**
```
GET /api/v1/templates/frameworks/<framework-id>/
Expected: Framework details
```

#### **2.4 Get Framework with Deep Data**
```
GET /api/v1/templates/frameworks/<framework-id>/?deep=true
Expected: Framework with nested domains, categories, subcategories, controls
```

#### **2.5 Get Framework Stats**
```
GET /api/v1/templates/frameworks/<framework-id>/stats/
Expected: Counts of domains, categories, controls, breakdown by type
```

#### **2.6 Validate Framework**
```
GET /api/v1/templates/frameworks/<framework-id>/validate/
Expected: Validation results showing completeness
```

#### **2.7 Clone Framework**
```
POST /api/v1/templates/frameworks/<framework-id>/clone/
{
  "version": "2025.1",
  "name": "SOX_2025"
}
Expected: 201 Created with new framework
```

***

### **3. Domains** 📂

#### **3.1 Create Unlinked Domain**
```
POST /api/v1/templates/domains/
{
  "name": "IT General Controls",
  "code": "ITGC",
  "description": "Controls over IT infrastructure",
  "sort_order": 1
}
Expected: 201 Created (domain created without framework link)
```

#### **3.2 Link Domain to Framework**
```
POST /api/v1/templates/domains/<domain-id>/link_framework/
{
  "framework_id": "<sox-framework-uuid>"
}
Expected: 200 OK with success message
```

#### **3.3 Get Domain Details**
```
GET /api/v1/templates/domains/<domain-id>/
Expected: Domain with framework_id populated
```

#### **3.4 Get Domain with Deep Data**
```
GET /api/v1/templates/domains/<domain-id>/?deep=true
Expected: Domain with nested categories, subcategories, controls
```

#### **3.5 Get Categories for Domain**
```
GET /api/v1/templates/domains/<domain-id>/categories/
Expected: List of categories under this domain
```

#### **3.6 Unlink Domain from Framework**
```
POST /api/v1/templates/domains/<domain-id>/unlink_framework/
Expected: 200 OK, framework_id becomes null
```

***

### **4. Categories** 🗂️

#### **4.1 Create Unlinked Category**
```
POST /api/v1/templates/categories/
{
  "name": "Access Controls",
  "code": "AC",
  "description": "Controls related to user access",
  "sort_order": 1
}
Expected: 201 Created
```

#### **4.2 Link Category to Domain**
```
POST /api/v1/templates/categories/<category-id>/link_domain/
{
  "domain_id": "<itgc-domain-uuid>"
}
Expected: 200 OK
```

#### **4.3 Get Category Details**
```
GET /api/v1/templates/categories/<category-id>/
Expected: Category with domain_id populated
```

#### **4.4 Get Subcategories for Category**
```
GET /api/v1/templates/categories/<category-id>/subcategories/
Expected: List of subcategories
```

#### **4.5 Unlink Category from Domain**
```
POST /api/v1/templates/categories/<category-id>/unlink_domain/
Expected: 200 OK
```

***

### **5. Subcategories** 📑

#### **5.1 Create Unlinked Subcategory**
```
POST /api/v1/templates/subcategories/
{
  "name": "User Access Management",
  "code": "UAM",
  "description": "Controls for managing user access",
  "sort_order": 1
}
Expected: 201 Created
```

#### **5.2 Link Subcategory to Category**
```
POST /api/v1/templates/subcategories/<subcategory-id>/link_category/
{
  "category_id": "<ac-category-uuid>"
}
Expected: 200 OK
```

#### **5.3 Get Subcategory Details**
```
GET /api/v1/templates/subcategories/<subcategory-id>/
Expected: Subcategory with category_id populated
```

#### **5.4 Get Controls for Subcategory**
```
GET /api/v1/templates/subcategories/<subcategory-id>/controls/
Expected: List of controls
```

#### **5.5 Unlink Subcategory from Category**
```
POST /api/v1/templates/subcategories/<subcategory-id>/unlink_category/
Expected: 200 OK
```

***

### **6. Controls** 🎯

#### **6.1 Create Control**
```
POST /api/v1/templates/controls/
{
  "subcategory": "<uam-subcategory-uuid>",
  "control_code": "AC-001",
  "title": "User Access Provisioning",
  "description": "Ensure users are provisioned following approved procedures",
  "objective": "Prevent unauthorized access",
  "control_type": "PREVENTIVE",
  "frequency": "CONTINUOUS",
  "risk_level": "HIGH",
  "sort_order": 1
}
Expected: 201 Created
```

#### **6.2 Get Control Details**
```
GET /api/v1/templates/controls/<control-id>/
Expected: Control details
```

#### **6.3 Get Control with Deep Data**
```
GET /api/v1/templates/controls/<control-id>/?deep=true
Expected: Control with assessment questions and evidence requirements
```

#### **6.4 Search Controls**
```
GET /api/v1/templates/controls/search/?q=password&framework=SOX&risk_level=HIGH
Expected: Filtered list of controls
```

#### **6.5 Get Assessment Questions**
```
GET /api/v1/templates/controls/<control-id>/questions/
Expected: List of questions for this control
```

#### **6.6 Get Evidence Requirements**
```
GET /api/v1/templates/controls/<control-id>/evidence/
Expected: List of evidence requirements
```

#### **6.7 Add Assessment Question**
```
POST /api/v1/templates/controls/<control-id>/add_question/
{
  "question_type": "YES_NO",
  "question": "Is there a formal user access request process?",
  "is_mandatory": true,
  "sort_order": 1
}
Expected: 201 Created
```

#### **6.8 Add Evidence Requirement**
```
POST /api/v1/templates/controls/<control-id>/add_evidence/
{
  "title": "User Access Request Forms",
  "description": "Approved access request forms",
  "evidence_type": "DOCUMENT",
  "is_mandatory": true,
  "file_format": "PDF, DOC",
  "sort_order": 1
}
Expected: 201 Created
```

***

### **7. Assessment Questions** ❓

#### **7.1 List Questions**
```
GET /api/v1/templates/questions/
Expected: List of all questions
```

#### **7.2 Create Question Directly**
```
POST /api/v1/templates/questions/
{
  "control": "<control-uuid>",
  "question": "Are access approvals documented?",
  "question_type": "YES_NO",
  "is_mandatory": true,
  "sort_order": 2
}
Expected: 201 Created
```

***

### **8. Evidence Requirements** 📎

#### **8.1 List Evidence Requirements**
```
GET /api/v1/templates/evidence/
Expected: List of all evidence requirements
```

#### **8.2 Create Evidence Requirement Directly**
```
POST /api/v1/templates/evidence/
{
  "control": "<control-uuid>",
  "title": "Access Approval Emails",
  "description": "Email approvals from managers",
  "evidence_type": "SCREENSHOT",
  "is_mandatory": true,
  "file_format": "PNG, JPG, PDF",
  "sort_order": 2
}
Expected: 201 Created
```

***

## **Testing Order (Recommended)**

1. Create Framework Category
2. Create Framework
3. Create Domain (unlinked)
4. Link Domain to Framework
5. Create Category (unlinked)
6. Link Category to Domain
7. Create Subcategory (unlinked)
8. Link Subcategory to Category
9. Create Control
10. Add Questions to Control
11. Add Evidence to Control
12. Test Deep Queries
13. Test Validation
14. Test Clone

***

Would you like me to prepare a **Postman collection JSON** with all these requests pre-configured? Or should we start testing one by one and I'll guide you through each step?



Here are SQL queries to verify tables and data inside `acmecorp_schema` to confirm framework distribution:

---

## **1. List All Tables in `acmecorp_schema`**

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'acmecorp_schema'
ORDER BY table_name;
```

**Expected Output:** List of tenant-specific company compliance tables like `company_frameworks`, `company_controls`, `company_domains`, etc.[1][2]

***

## **2. Count Records in Key Tables**

Check if framework data has been distributed:

```sql
-- Count frameworks
SELECT COUNT(*) as framework_count FROM acmecorp_schema.company_frameworks;

-- Count domains
SELECT COUNT(*) as domain_count FROM acmecorp_schema.company_domains;

-- Count categories
SELECT COUNT(*) as category_count FROM acmecorp_schema.company_categories;

-- Count subcategories
SELECT COUNT(*) as subcategory_count FROM acmecorp_schema.company_subcategories;

-- Count controls
SELECT COUNT(*) as control_count FROM acmecorp_schema.company_controls;

-- Count assessment questions
SELECT COUNT(*) as question_count FROM acmecorp_schema.company_assessment_questions;

-- Count evidence requirements
SELECT COUNT(*) as evidence_count FROM acmecorp_schema.company_evidence_requirements;
```

**Expected Result:** Non-zero counts indicating framework distribution was successful.[3][4]

***

## **3. View Distributed Framework Details**

```sql
SELECT id, name, version, status, customization_level
FROM acmecorp_schema.company_frameworks;
```

**Expected:** Shows SOX framework (or whatever you subscribed to) with proper customization level.

***

## **4. View Distributed Controls Sample**

```sql
SELECT control_code, title, control_type, risk_level
FROM acmecorp_schema.company_controls
LIMIT 10;
```

**Expected:** Shows controls distributed from the template framework.[5]

***

## **5. Verify Foreign Key Relationships**

Check hierarchy is intact:

```sql
SELECT 
    cf.name as framework_name,
    cd.name as domain_name,
    cc.name as category_name,
    cs.name as subcategory_name,
    COUNT(co.id) as control_count
FROM acmecorp_schema.company_frameworks cf
LEFT JOIN acmecorp_schema.company_domains cd ON cd.framework_id = cf.id
LEFT JOIN acmecorp_schema.company_categories cc ON cc.domain_id = cd.id
LEFT JOIN acmecorp_schema.company_subcategories cs ON cs.category_id = cc.id
LEFT JOIN acmecorp_schema.company_controls co ON co.subcategory_id = cs.id
GROUP BY cf.name, cd.name, cc.name, cs.name;
```

**Expected:** Shows framework hierarchy with controls distributed properly.[6][5]

***

Run these queries in your `psql` shell connected to `main_compliance_system_db` to confirm framework distribution into the tenant schema!






















#!SECTION
Phase 3: Test Tenant Management 🏢
Provision tenants using management command or API

Verify tenant schema/database creation and isolation

Understand tenant database info storage

Phase 4: Test User Management 👥
Register tenant admin and other users

Verify TenantMembership linking users to tenants and roles

Test authentication (login, logout)

Test user invitation and acceptance flows

See how roles and permissions from seed data are assigned and enforced

Phase 5: Test Company Compliance Operations 📊
Subscribe tenants to compliance frameworks

Assign controls to users

Create and manage assessment campaigns and responses

Upload and verify evidence

Generate and publish reports

Enforce permissions dynamically in these operations

