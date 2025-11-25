# NAVADA Robotics Website

## Temporary Changes

### Solutions Page - Temporarily Disabled (November 25, 2025)
The Solutions page navigation links have been temporarily commented out in the following files:
- `app/page.tsx` - Main homepage navigation (desktop and mobile)
- `app/about/page.tsx` - About page navigation (desktop and mobile)
- `app/contact/page.tsx` - Contact page navigation (desktop and mobile)

To re-enable the Solutions page:
1. Uncomment the Solutions navigation links in the above files
2. Search for `{/* <Link href="/solutions"` and remove the comment tags
3. The Solutions page and its subpages are still accessible via direct URL if needed

The Solutions page structure remains intact at:
- `/solutions` - Main solutions page
- `/solutions/events` - Events page
- `/solutions/predictions` - Predictions page
- `/solutions/resources` - Resources page
- `/solutions/projects` - Projects page