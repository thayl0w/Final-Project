const fallbackQuotes = [
  { content: 'Small progress each day adds up to big results.', author: 'Unknown' },
  { content: 'Do something now that your future self will thank you for.', author: 'Unknown' },
  { content: 'Focus on effort, not only outcome.', author: 'Study Reminder' }
];

export async function fetchQuote() {
  try {
    const response = await fetch('https://api.quotable.io/random', { method: 'GET' });

    if (!response.ok) {
      throw new Error('Quote request failed.');
    }

    const data = await response.json();
    return {
      content: data.content,
      author: data.author || 'Unknown'
    };
  } catch {
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }
}

export async function searchYouTubeVideos(query, apiKey) {
  if (!apiKey) {
    return {
      warning: 'No API key provided. Showing a direct YouTube search link instead.',
      items: [
        {
          id: 'search-link',
          title: `Search YouTube for: ${query}`,
          channel: 'YouTube',
          thumbnail: '',
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
        }
      ]
    };
  }

  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('maxResults', '6');
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'video');
  url.searchParams.set('key', apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('YouTube API request failed. Check API key and quota.');
  }

  const data = await response.json();

  const items = (data.items || []).map((item) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails?.medium?.url || '',
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`
  }));

  return { items };
}
