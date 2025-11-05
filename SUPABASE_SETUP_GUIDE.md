# 🚀 SUPABASE DATABASE SETUP FOR TAXSAGE

## STEP 1: CREATE SUPABASE ACCOUNT

1. **Go to [supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up with GitHub** (recommended - connects to your repo)
4. **Verify your email**

## STEP 2: CREATE NEW PROJECT

1. **Click "New Project"**
2. **Fill in project details:**
   ```
   Organization: Personal (or create new)
   Name: TaxSage-CA-Advisor
   Database Password: [Generate strong password - SAVE THIS!]
   Region: Southeast Asia (closest to India)
   Pricing Plan: Free (perfect for development)
   ```
3. **Click "Create new project"**
4. **Wait 2-3 minutes for setup**

## STEP 3: SET UP DATABASE SCHEMA

1. **Go to SQL Editor** (left sidebar)
2. **Click "New Query"**
3. **Copy and paste the SQL script below**
4. **Click "RUN" to execute**

## STEP 4: GET CONNECTION DETAILS

1. **Go to Settings → Database**
2. **Copy these values:**
   ```
   Host: db.[your-project-ref].supabase.co
   Database name: postgres
   Port: 5432
   User: postgres
   Password: [your database password]
   ```

3. **Connection String Format:**
   ```
   postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   ```

## STEP 5: CONFIGURE VERCEL ENVIRONMENT VARIABLES

1. **Go to your Vercel dashboard**
2. **Select your TaxSage project**
3. **Go to Settings → Environment Variables**
4. **Add these variables:**

   ```bash
   # Database Connection
   DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   
   # Supabase Details (optional, for direct client usage)
   NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
   SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
   
   # OpenAI API Key (if not already added)
   OPENAI_API_KEY=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
   ```

## STEP 6: REDEPLOY VERCEL

1. **Go to Vercel → Deployments**
2. **Click "Redeploy" on latest deployment**
3. **Or push any change to trigger auto-deployment**

---

## 📋 QUICK CHECKLIST

- [ ] Created Supabase account
- [ ] Created TaxSage project
- [ ] Executed database schema SQL
- [ ] Copied connection details
- [ ] Added environment variables to Vercel
- [ ] Redeployed Vercel app
- [ ] Tested database connection

## 🔑 IMPORTANT DETAILS TO SAVE

After setup, save these details securely:

```
Supabase Project URL: https://[project-ref].supabase.co
Database Password: [your-generated-password]
Connection String: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
Anon Key: [anon-key]
Service Role Key: [service-role-key]
```

## 🧪 TESTING

After setup, test your deployment:
1. Go to your Vercel URL
2. Try creating an account
3. Check if data appears in Supabase dashboard

## 🆘 TROUBLESHOOTING

**Connection Issues:**
- Verify environment variables in Vercel
- Check database password is correct
- Ensure DATABASE_URL format is exact

**Schema Issues:**
- Re-run the SQL script in Supabase SQL Editor
- Check table creation in Supabase Table Editor

**Authentication Issues:**
- Verify OpenAI API key is set
- Check Vercel deployment logs for errors