# Prisma Database Guide

## 🎯 **Prisma Studio Basics**

### **Starting Prisma Studio**
```bash
cd C:/Users/leeak/navada_robotics
npx prisma studio
```
- Opens on **http://localhost:5555** (or 5556 if 5555 is busy)
- **No server needed** - it's a standalone database viewer
- Works directly with your SQLite database file

### **Current Database Setup**
Your app has **ONE SQLite database** located at:
```
C:/Users/leeak/navada_robotics/prisma/dev.db
```

## 📊 **What's Currently in Your Database**

Looking at your schema, you have **8 tables**:

1. **`email_subscribers`** ✨ (New - for email collection)
2. **`users`** (User accounts)
3. **`accounts`** (OAuth accounts)
4. **`sessions`** (User sessions)
5. **`courses`** (Learning courses)
6. **`lessons`** (Course lessons)
7. **`user_progress`** (Learning progress)
8. **`lesson_progress`** (Individual lesson progress)

## 🔧 **Managing Data in Prisma Studio**

### **Viewing Data**
- Click any table name to see records
- **Browse**, **filter**, and **search** records
- **Real-time updates** - refresh to see new data

### **Adding Data**
- Click **"Add record"** button
- Fill in the fields
- Click **"Save 1 change"**

### **Editing Data**
- Click on any field to edit
- Modify the value
- Click **"Save changes"**

### **Deleting Data**
- Select record(s) with checkboxes
- Click **"Delete X records"**
- Confirm deletion

## 💾 **Types of Data You Can Store**

Based on your current schema, you can store:

### **Email Subscribers** (email_subscribers)
```
id: 1
email: "user@example.com"
source: "learning-page"
subscribedAt: "2025-09-15T02:43:55.739Z"
isActive: true
```

### **Users** (users)
```
id: "user_123"
email: "john@example.com"
name: "John Doe"
subscriptionTier: "premium"
subscriptionStatus: "active"
```

### **Courses** (courses)
```
id: "course_ai_basics"
title: "AI Fundamentals"
description: "Learn AI basics"
difficulty: "beginner"
isFreeTier: true
```

### **And More...**
- User progress tracking
- Lesson completion data
- OAuth account data
- Session management

## ⚡ **Quick Management Commands**

### **Database Commands**
```bash
# View database in browser
npx prisma studio

# Generate Prisma client (after schema changes)
npx prisma generate

# Apply schema changes
npx prisma db push

# Reset database (⚠️ deletes all data)
npx prisma db push --force-reset

# See database schema
npx prisma db pull
```

### **Common Tasks**

**View Email Subscribers:**
1. Open http://localhost:5556
2. Click **"email_subscribers"** table
3. See all collected emails

**Delete an Email:**
1. Find the email record
2. Check the checkbox
3. Click **"Delete 1 record"**
4. Confirm

**Add Test Data:**
1. Click **"Add record"**
2. Fill: email="test@test.com", source="manual"
3. Save

## 🚨 **Important Notes**

### **This is Your ONLY Database**
- **SQLite file**: `prisma/dev.db`
- **All app data** is in this one database
- **Backup important**: Copy `dev.db` file to backup

### **Production Considerations**
- SQLite is great for development
- For production, consider PostgreSQL/MySQL
- Current setup handles thousands of records easily

### **Admin Access**
- **Prisma Studio**: Full database access
- **Your app's admin**: http://localhost:3000/admin/emails
- **Admin key**: `navada_admin_2024`

## 🎯 **Try It Now!**

1. **Open Prisma Studio:**
   ```bash
   npx prisma studio
   ```

2. **Check your emails:**
   - Go to http://localhost:5556
   - Click "email_subscribers"
   - See the test email we added

3. **Explore other tables:**
   - Click "users" to see user accounts
   - Click "courses" to see learning content

**Prisma Studio is your visual database admin panel - like phpMyAdmin but modern and beautiful!** ✨