import { supabase } from './supabase';

interface ScrapedData {
  title: string;
  content: string;
  url: string;
  timestamp: Date;
}

export async function scrapeWebData(query: string): Promise<string> {
  try {
    // Convert query to search-friendly format
    const searchQuery = encodeURIComponent(query);
    
    // Use browser-compatible fetch API
    const urls = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.google.com/search?q=${searchQuery}`)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.reddit.com/search.json?q=${searchQuery}`)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.twitter.com/2/tweets/search/recent?query=${searchQuery}`)}`
    ];

    const scrapedData: ScrapedData[] = [];

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) continue;

        const data = await response.json();

        if (url.includes('google.com')) {
          // Parse Google search results
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, 'text/html');
          doc.querySelectorAll('.g').forEach(element => {
            const title = element.querySelector('h3')?.textContent;
            const content = element.querySelector('.VwiC3b')?.textContent;
            if (title && content) {
              scrapedData.push({
                title,
                content,
                url,
                timestamp: new Date()
              });
            }
          });
        } else if (url.includes('reddit.com')) {
          // Parse Reddit API response
          data.data.children.forEach(post => {
            scrapedData.push({
              title: post.data.title,
              content: post.data.selftext,
              url: `https://reddit.com${post.data.permalink}`,
              timestamp: new Date(post.data.created_utc * 1000)
            });
          });
        } else if (url.includes('twitter.com')) {
          // Parse Twitter API response
          data.data?.forEach(tweet => {
            scrapedData.push({
              title: 'Tweet',
              content: tweet.text,
              url: `https://twitter.com/i/web/status/${tweet.id}`,
              timestamp: new Date(tweet.created_at)
            });
          });
        }
      } catch (error) {
        console.warn(`Error fetching ${url}:`, error);
        continue;
      }
    }

    // Store scraped data in Supabase for future reference
    const { error } = await supabase
      .from('scraped_data')
      .insert(scrapedData.map(data => ({
        title: data.title,
        content: data.content,
        url: data.url,
        query: query,
        scraped_at: data.timestamp
      })));

    if (error) {
      console.warn('Error storing scraped data:', error);
    }

    // Format scraped data
    return scrapedData
      .map(data => `${data.title}\n${data.content}`)
      .join('\n\n');
  } catch (error) {
    console.error('Scraping error:', error);
    return '';
  }
}