# 🔍 Article Page Internal Server Error - Debugging Guide

## 🎯 Most Likely Causes

### 1. **Missing Environment Variable**
The `NEXT_PUBLIC_API_URL` environment variable is not set correctly.

**Check:**
```bash
# In your deployment environment, verify:
echo $NEXT_PUBLIC_API_URL
```

**Should be:**
```
NEXT_PUBLIC_API_URL=https://q8130q5lpd.execute-api.us-east-1.amazonaws.com/prod
```

### 2. **API Gateway CORS Issues**
The AWS API Gateway might not be configured to allow requests from your frontend domain.

### 3. **Lambda Function Errors**
The backend Lambda function might be throwing errors when fetching articles.

## 🔧 Debugging Steps

### Step 1: Check Environment Variables
In your deployment platform (Vercel/Netlify/etc.), ensure:

```env
NEXT_PUBLIC_API_URL=https://q8130q5lpd.execute-api.us-east-1.amazonaws.com/prod
```

### Step 2: Test API Directly
Try accessing the API directly in your browser:

```
https://q8130q5lpd.execute-api.us-east-1.amazonaws.com/prod/public/articles
```

### Step 3: Check Server Logs
Look for these error messages in your deployment logs:

```
❌ NEXT_PUBLIC_API_URL environment variable is not configured
❌ Article API error: [status] [statusText] for slug: [slug]
💥 Error fetching article by slug [slug]: [error]
```

### Step 4: Test with a Known Article
Try accessing an article that you know exists in your database.

## 🚀 Quick Fixes

### Fix 1: Set Environment Variable
In your deployment platform:

1. Go to Environment Variables settings
2. Add: `NEXT_PUBLIC_API_URL` = `https://q8130q5lpd.execute-api.us-east-1.amazonaws.com/prod`
3. Redeploy the application

### Fix 2: Verify API Endpoint
Check if your API Gateway is working:

```bash
curl -X GET "https://q8130q5lpd.execute-api.us-east-1.amazonaws.com/prod/public/articles" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"
```

### Fix 3: Check Lambda Logs
In AWS CloudWatch, check the logs for:
- `transfersdaily-public-articles` Lambda function
- Look for errors when fetching articles by slug

## 📊 Expected API Response Format

The API should return:

```json
{
  "success": true,
  "data": {
    "article": {
      "id": "123",
      "title": "Article Title",
      "content": "Article content...",
      "slug": "article-slug",
      "published_at": "2025-01-01T00:00:00Z",
      "league": "Premier League",
      "player_name": "Player Name",
      // ... other fields
    }
  }
}
```

## 🔍 Error Patterns

### Pattern 1: Environment Variable Missing
```
❌ NEXT_PUBLIC_API_URL environment variable is not configured
Error: API configuration missing
```

**Solution:** Set the environment variable and redeploy.

### Pattern 2: API Gateway Error
```
❌ Article API error: 403 Forbidden for slug: some-article
❌ Error details: {"message":"Forbidden"}
```

**Solution:** Check API Gateway CORS and permissions.

### Pattern 3: Lambda Function Error
```
❌ Article API error: 500 Internal Server Error for slug: some-article
❌ Error details: {"errorMessage":"..."}
```

**Solution:** Check Lambda function logs in CloudWatch.

### Pattern 4: Network/Timeout Error
```
💥 Error fetching article by slug some-article: TypeError: fetch failed
💥 Error details: { name: 'TypeError', message: 'fetch failed' }
```

**Solution:** Check network connectivity and API availability.

## ✅ Verification Checklist

- [ ] `NEXT_PUBLIC_API_URL` environment variable is set
- [ ] API Gateway endpoint is accessible
- [ ] Lambda function is deployed and working
- [ ] CORS is configured correctly
- [ ] Article exists in the database
- [ ] Slug format matches database records

## 🎯 Next Steps

1. **Check environment variables first** - This is the most common issue
2. **Test API directly** - Verify the backend is working
3. **Check deployment logs** - Look for specific error messages
4. **Verify article exists** - Make sure the slug corresponds to a real article

The error is most likely due to missing environment configuration rather than code issues.
