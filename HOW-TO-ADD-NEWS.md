# How to Add News Articles

## Quick Steps

1. **Open the news file**: `lib/static-news.json`
2. **Add your new article** at the top of the array (for newest first)
3. **Save the file** - changes appear instantly

## News Article Format

```json
{
  "title": "Your Article Title",
  "link": "https://source-website.com/article-url",
  "isoDate": "2024-01-15T10:00:00.000Z",
  "source": "Source Name",
  "summary": "Brief description of the article content (200 chars max recommended)",
  "author": "Author Name"
}
```

## Example: Adding a New Article

1. Open `lib/static-news.json`
2. Add your article at the beginning of the array:

```json
[
  {
    "title": "New AI Breakthrough in Robotics",
    "link": "https://example.com/ai-robotics-breakthrough",
    "isoDate": "2024-01-20T14:30:00.000Z",
    "source": "Tech News",
    "summary": "Scientists develop new AI algorithm that improves robot learning speed by 300%.",
    "author": "Dr. Jane Smith"
  },
  // ... existing articles below
]
```

## Field Guidelines

- **title**: Clear, descriptive headline
- **link**: Full URL to the original article
- **isoDate**: Use current date/time in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
- **source**: Publication/website name (appears as colored badge)
- **summary**: 1-2 sentences, keep under 200 characters
- **author**: Writer's name or "null" if unknown

## Source Badge Colors

The app automatically colors source badges:
- **Raspberry Pi**: Red
- **IEEE Spectrum**: Blue
- **Hackster.io**: Green
- **OpenAI**: Purple
- **NVIDIA**: Emerald
- **arXiv**: Yellow
- **Others**: Gray

## Date Format Tool

Get current ISO date: Run this in browser console:
```javascript
new Date().toISOString()
```

## Tips

- ✅ Add newest articles at the top
- ✅ Keep summaries concise and engaging
- ✅ Use real URLs that work
- ✅ Check JSON syntax (commas, quotes)
- ✅ Articles appear instantly after saving

That's it! Your news page updates automatically.