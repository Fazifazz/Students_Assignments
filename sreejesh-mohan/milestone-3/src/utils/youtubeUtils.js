// src/utils/youtubeUtils.js

/**
 * Extracts a YouTube Video ID from various YouTube URL formats.
 */
export const extractYoutubeId = (urlOrId) => {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();

  // If already an 11-character YouTube video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex for youtube URL formats (watch, share, embed)
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regex);
  return match ? match[1] : trimmed;
};

/**
 * Extracts all unique YouTube Video IDs from any block of text or list of URLs.
 */
export const extractAllYoutubeIds = (text) => {
  if (!text) return [];
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/gi;
  const matches = [...text.matchAll(regex)];
  const uniqueIds = [];
  const seen = new Set();
  for (const m of matches) {
    const id = m[1];
    if (id && !seen.has(id)) {
      seen.add(id);
      uniqueIds.push(id);
    }
  }
  return uniqueIds;
};

/**
 * Extracts a YouTube Playlist ID from a URL (e.g. ?list=PL...) or raw playlist ID string.
 */
export const extractPlaylistId = (url) => {
  if (!url) return '';
  const trimmed = url.trim();

  // If already a playlist ID like PL..., UU..., OLAK...
  if (/^(?:PL|UU|FL|RD|OLAK5uy_)[a-zA-Z0-9_-]{10,}$/i.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const listParam = parsed.searchParams.get('list');
    if (listParam) return listParam;
  } catch {
    // Fall back to regex
  }

  const match = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/i);
  return match ? match[1] : '';
};

/**
 * Returns a privacy-enhanced YouTube embed URL for either a single video or an entire playlist.
 */
export const getYoutubeEmbedUrl = (urlOrId, playlistUrlOrId = null) => {
  const videoId = extractYoutubeId(urlOrId);
  const playlistId = extractPlaylistId(playlistUrlOrId || urlOrId);

  // If a playlist ID exists and no specific video ID
  if (playlistId && (!videoId || videoId.startsWith('PL'))) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`;
  }

  if (videoId) {
    if (playlistId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?list=${playlistId}&rel=0&modestbranding=1`;
    }
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
  }

  return '';
};

/**
 * Returns the default high-resolution YouTube video thumbnail.
 */
export const getYoutubeThumbnail = (urlOrId) => {
  const videoId = extractYoutubeId(urlOrId);
  if (!videoId || videoId.startsWith('PL')) return '';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

/**
 * Automatically infers course category based on title & description
 */
export const inferCategoryFromTitle = (title = '', description = '') => {
  const text = `${title} ${description}`.toLowerCase();
  if (text.match(/react|vue|angular|javascript|typescript|next\.?js|node|html|css|tailwind|web|frontend|fullstack|php|laravel|django|express|graphql|api/)) {
    return 'Web Development';
  }
  if (text.match(/python|machine learning|data science|deep learning|artificial intelligence|ai|pandas|numpy|nlp|neural|data analysis|sql/)) {
    return 'Data Science & AI';
  }
  if (text.match(/figma|ui|ux|design|user experience|interface|wireframe|prototype|photoshop|illustrator/)) {
    return 'UI/UX Design';
  }
  if (text.match(/aws|cloud|docker|kubernetes|devops|azure|gcp|linux|terraform|ci\/cd|git/)) {
    return 'Cloud & DevOps';
  }
  if (text.match(/flutter|react native|swift|ios|android|kotlin|mobile app/)) {
    return 'Mobile Apps';
  }
  if (text.match(/cyber|security|ethical hacking|penetration|network security|infosec|bug bounty/)) {
    return 'Cybersecurity';
  }
  return 'Web Development';
};

/**
 * Automatically infers difficulty level based on title
 */
export const inferLevelFromTitle = (title = '') => {
  const text = title.toLowerCase();
  if (text.match(/advanced|expert|mastery|pro\b|architecture/)) return 'Advanced';
  if (text.match(/intermediate|deep dive|full course/)) return 'Intermediate';
  return 'Beginner';
};

// Catalog of high-value tech keywords for classification
export const TECH_KEYWORDS = [
  // Web Development & Fullstack
  'React', 'Next.js', 'Vue', 'Nuxt', 'Angular', 'Svelte', 'JavaScript', 'TypeScript',
  'HTML5', 'CSS3', 'Tailwind', 'Bootstrap', 'Node.js', 'Express', 'Django', 'Flask',
  'FastAPI', 'Spring Boot', 'PHP', 'Laravel', 'ASP.NET', 'GraphQL', 'REST API',
  'Frontend', 'Backend', 'Full-Stack', 'Web Development', 'Redux', 'Zustand', 'Prisma', 'PostgreSQL',
  'MongoDB', 'MySQL', 'Firebase', 'Supabase', 'SQL',
  // Data Science & AI
  'Python', 'Machine Learning', 'Deep Learning', 'Data Science', 'Artificial Intelligence',
  'AI', 'Data Analysis', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Scikit-Learn',
  'Computer Vision', 'NLP', 'LLM', 'LangChain', 'OpenAI', 'Neural Networks',
  // Cloud & DevOps
  'DevOps', 'AWS', 'Docker', 'Kubernetes', 'Cloud', 'Azure', 'GCP', 'Google Cloud',
  'Linux', 'Git', 'GitHub', 'CI/CD', 'Terraform', 'Microservices', 'Bash',
  // Mobile
  'Flutter', 'React Native', 'Swift', 'iOS', 'Android', 'Kotlin', 'Mobile Development',
  // Design
  'Figma', 'UI/UX', 'UI Design', 'UX Design', 'User Experience', 'Wireframing', 'Prototyping',
  // Cybersecurity
  'Cybersecurity', 'Ethical Hacking', 'Penetration Testing', 'Network Security', 'Bug Bounty', 'Cryptography'
];

/**
 * Extracts relevant keywords and tech stack tags from playlist title, description, and lessons
 */
export const extractKeywordsFromPlaylist = (title = '', description = '', lessons = [], explicitTags = []) => {
  const combinedText = `${title} ${description} ${(lessons || []).map((l) => l.title).join(' ')}`.toLowerCase();
  const matchedKeywords = new Set();

  // 1. Check explicit tags
  if (Array.isArray(explicitTags)) {
    for (const tag of explicitTags) {
      if (typeof tag === 'string' && tag.trim().length > 1 && tag.trim().length < 25) {
        matchedKeywords.add(tag.trim());
      }
    }
  }

  // 2. Match catalog of tech keywords
  for (const kw of TECH_KEYWORDS) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9+#.])${escaped}([^a-zA-Z0-9+#.]|$)`, 'i');
    if (regex.test(combinedText)) {
      matchedKeywords.add(kw);
    }
  }

  // 3. Fallback: Extract meaningful capitalized words from title
  if (matchedKeywords.size < 2 && title) {
    const stopWords = new Set([
      'the', 'and', 'for', 'with', 'from', 'complete', 'course', 'tutorial',
      'masterclass', 'bootcamp', 'beginner', 'advanced', 'guide', 'learn',
      '2024', '2025', '2026', 'full', 'in', 'hindi', 'english', 'free', 'playlist'
    ]);
    const words = title.split(/[\s,:\-_|/]+/);
    for (const w of words) {
      const clean = w.replace(/[^a-zA-Z0-9+#.]/g, '');
      if (clean.length > 2 && !stopWords.has(clean.toLowerCase())) {
        matchedKeywords.add(clean);
      }
    }
  }

  return Array.from(matchedKeywords).slice(0, 8);
};

/**
 * Centralized builder to generate course metadata with auto-categorized section & extracted keywords
 */
export const buildCoursePayloadFromExtraction = ({
  title = 'YouTube Course Playlist',
  instructor = 'YouTube Instructor',
  thumbnail = '',
  playlistId = '',
  playlistUrl = '',
  description = '',
  videos = [],
  rawTags = []
}) => {
  const keywords = extractKeywordsFromPlaylist(title, description, videos, rawTags);
  const category = inferCategoryFromTitle(title, `${description} ${keywords.join(' ')}`);
  const level = inferLevelFromTitle(title);
  const totalMins = (videos || []).reduce((acc, v) => acc + (Number(v.durationMinutes) || 20), 0);
  const totalEstimatedHours = Math.max(1, Math.ceil(totalMins / 60));

  return {
    title,
    instructor,
    thumbnail,
    playlistId,
    playlistUrl: playlistUrl || (playlistId ? `https://www.youtube.com/playlist?list=${playlistId}` : ''),
    category, // Section / Course Type
    courseType: category,
    keywords, // Extracted Keywords/Tags: e.g. ['React', 'Next.js', 'Frontend']
    level,
    description: description || `Complete ${category} course with ${videos.length} video lessons by ${instructor}.`,
    totalEstimatedHours,
    lessons: videos
  };
};

/**
 * Automatically fetches the video/playlist Title, Author/Channel, and Thumbnail
 * from YouTube's public oEmbed & noembed endpoints without needing any API key!
 */
export const fetchYoutubeMetadata = async (url) => {
  if (!url) return null;
  const cleanUrl = url.trim();

  // 1. Try noembed endpoint (universal CORS support)
  try {
    const noembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(cleanUrl)}`;
    const res = await fetch(noembedUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        return {
          title: data.title || '',
          author: data.author_name || '',
          thumbnail: data.thumbnail_url || '',
          type: 'video'
        };
      }
    }
  } catch {
    // Ignore and fallback
  }

  // 2. Try YouTube official oEmbed endpoint
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`;
    const res = await fetch(oembedUrl);
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.title || '',
        author: data.author_name || '',
        thumbnail: data.thumbnail_url || '',
        type: data.type || 'video',
        html: data.html || ''
      };
    }
  } catch {
    // Fall back
  }

  // 3. Fallback: If it's a valid video ID, return thumbnail
  const videoId = extractYoutubeId(cleanUrl);
  if (videoId && !videoId.startsWith('PL')) {
    return {
      title: '',
      author: '',
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      type: 'video'
    };
  }

  return null;
};

// Helper: fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeoutMs = 4500) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

/**
 * Fetch all videos and metadata for a YouTube Playlist.
 * Cascades through:
 * 1. Optional YouTube Data API v3 (if user has API key in localStorage or arg)
 * 2. Public Invidious instances (zero API key required)
 * 3. Public Piped instances (zero API key required)
 * 4. Web scraping via CORS proxy (parses ytInitialData playlistVideoListRenderer)
 * 5. Fallback oEmbed metadata
 */
export const fetchFullPlaylistData = async (playlistUrlOrId, customApiKey = null) => {
  const playlistId = extractPlaylistId(playlistUrlOrId);
  const startingVideoId = extractYoutubeId(playlistUrlOrId);

  if (!playlistId && !startingVideoId) {
    throw new Error('Please enter a valid YouTube playlist link, video link, or playlist ID.');
  }

  // Check for saved API key
  const apiKey = customApiKey || (typeof window !== 'undefined' ? localStorage.getItem('edutrack_yt_api_key') : null);

  // 1. YouTube Data API v3 (if API key available)
  if (apiKey && playlistId) {
    try {
      const metaRes = await fetchWithTimeout(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`
      );
      if (metaRes.ok) {
        const metaJson = await metaRes.json();
        const snippet = metaJson.items?.[0]?.snippet;
        if (snippet) {
          const itemsRes = await fetchWithTimeout(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`
          );
          if (itemsRes.ok) {
            const itemsJson = await itemsRes.json();
            const videos = (itemsJson.items || [])
              .map((it, idx) => {
                const vidId = it.contentDetails?.videoId || it.snippet?.resourceId?.videoId;
                const vTitle = it.snippet?.title || `Lesson ${idx + 1}`;
                return {
                  videoId: vidId,
                  title: vTitle,
                  durationMinutes: 20,
                  thumbnail: it.snippet?.thumbnails?.medium?.url || getYoutubeThumbnail(vidId)
                };
              })
              .filter((v) => v.videoId && v.title !== 'Private video' && v.title !== 'Deleted video');

            if (videos.length > 0) {
              return buildCoursePayloadFromExtraction({
                title: snippet.title || 'YouTube Course Playlist',
                instructor: snippet.channelTitle || 'YouTube Instructor',
                thumbnail:
                  snippet.thumbnails?.maxres?.url ||
                  snippet.thumbnails?.high?.url ||
                  snippet.thumbnails?.medium?.url ||
                  videos[0]?.thumbnail ||
                  '',
                playlistId,
                description: snippet.description || '',
                videos,
                rawTags: snippet.tags || []
              });
            }
          }
        }
      }
    } catch {
      // Continue to free public providers
    }
  }

  // 2. Try Invidious instances
  if (playlistId) {
    const invidiousInstances = [
      'https://invidious.nerdvpn.de',
      'https://inv.nadeko.net',
      'https://invidious.private.coffee',
      'https://invidious.protokolla.fi',
      'https://yt.artemislena.eu',
      'https://invidious.drgns.space'
    ];

    for (const inst of invidiousInstances) {
      try {
        const res = await fetchWithTimeout(`${inst}/api/v1/playlists/${playlistId}`, {}, 3500);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.videos) && data.videos.length > 0) {
            const videos = data.videos
              .map((v, idx) => ({
                videoId: v.videoId,
                title: v.title || `Lesson ${idx + 1}`,
                durationMinutes: Math.max(1, Math.round((Number(v.lengthSeconds) || 1200) / 60)),
                thumbnail: v.videoThumbnails?.[0]?.url || getYoutubeThumbnail(v.videoId)
              }))
              .filter((v) => v.videoId);

            if (videos.length > 0) {
              return buildCoursePayloadFromExtraction({
                title: data.title || 'YouTube Playlist Course',
                instructor: data.author || 'YouTube Instructor',
                thumbnail:
                  data.playlistThumbnail ||
                  videos[0]?.thumbnail ||
                  getYoutubeThumbnail(videos[0]?.videoId) ||
                  '',
                playlistId,
                description: data.description || '',
                videos,
                rawTags: data.keywords || []
              });
            }
          }
        }
      } catch {
        // Try next instance
      }
    }
  }

  // 3. Try Piped instances
  if (playlistId) {
    const pipedInstances = [
      'https://pipedapi.kavin.rocks',
      'https://api.piped.privacydev.net',
      'https://piped-api.garudalinux.org'
    ];

    for (const inst of pipedInstances) {
      try {
        const res = await fetchWithTimeout(`${inst}/playlists/${playlistId}`, {}, 3500);
        if (res.ok) {
          const data = await res.json();
          const streams = data.relatedStreams || [];
          if (Array.isArray(streams) && streams.length > 0) {
            const videos = streams
              .map((s, idx) => {
                const vidId = s.url?.replace('/watch?v=', '') || extractYoutubeId(s.url);
                return {
                  videoId: vidId,
                  title: s.title || `Lesson ${idx + 1}`,
                  durationMinutes: Math.max(1, Math.round((Number(s.duration) || 1200) / 60)),
                  thumbnail: s.thumbnail || getYoutubeThumbnail(vidId)
                };
              })
              .filter((v) => v.videoId);

            if (videos.length > 0) {
              return buildCoursePayloadFromExtraction({
                title: data.name || 'YouTube Playlist Course',
                instructor: data.uploader || 'YouTube Instructor',
                thumbnail: data.thumbnailUrl || videos[0]?.thumbnail || '',
                playlistId,
                description: data.description || '',
                videos
              });
            }
          }
        }
      } catch {
        // Try next
      }
    }
  }

  // 4. Try parsing YouTube HTML via CORS Proxies (allorigins / corsproxy)
  if (playlistId) {
    const targetUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
    const proxyUrls = [
      `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`
    ];

    for (const pUrl of proxyUrls) {
      try {
        const res = await fetchWithTimeout(pUrl, {}, 5000);
        if (res.ok) {
          const html = await res.text();
          // Extract ytInitialData
          const match = html.match(/ytInitialData\s*=\s*({.+?});(?:<\/script>|\n)/s);
          if (match && match[1]) {
            const ytData = JSON.parse(match[1]);

            // Walk JSON tree to extract playlistVideoRenderer items
            const extractedVideos = [];
            const walk = (obj) => {
              if (!obj || typeof obj !== 'object') return;
              if (obj.playlistVideoRenderer) {
                const pvr = obj.playlistVideoRenderer;
                if (pvr.videoId) {
                  let duration = 20;
                  if (pvr.lengthSeconds) {
                    duration = Math.max(1, Math.round(Number(pvr.lengthSeconds) / 60));
                  } else if (pvr.lengthText?.simpleText) {
                    const parts = pvr.lengthText.simpleText.split(':').map(Number);
                    if (parts.length === 2) duration = Math.max(1, Math.round(parts[0] + parts[1] / 60));
                    if (parts.length === 3) duration = Math.max(1, Math.round(parts[0] * 60 + parts[1] + parts[2] / 60));
                  }
                  extractedVideos.push({
                    videoId: pvr.videoId,
                    title: pvr.title?.runs?.[0]?.text || `Lesson ${extractedVideos.length + 1}`,
                    durationMinutes: duration,
                    thumbnail: pvr.thumbnail?.thumbnails?.slice(-1)[0]?.url || getYoutubeThumbnail(pvr.videoId)
                  });
                }
              }
              for (const k of Object.keys(obj)) {
                if (typeof obj[k] === 'object') walk(obj[k]);
              }
            };
            walk(ytData);

            if (extractedVideos.length > 0) {
              const title =
                ytData.metadata?.playlistMetadataRenderer?.title ||
                ytData.header?.playlistHeaderRenderer?.title?.runs?.[0]?.text ||
                'YouTube Playlist Course';
              const instructor =
                ytData.header?.playlistHeaderRenderer?.ownerText?.runs?.[0]?.text ||
                ytData.sidebar?.playlistSidebarRenderer?.items?.[1]?.playlistSidebarSecondaryInfoRenderer?.videoOwner?.videoOwnerRenderer?.title?.runs?.[0]?.text ||
                'YouTube Instructor';
              const thumbnail =
                extractedVideos[0]?.thumbnail ||
                getYoutubeThumbnail(extractedVideos[0]?.videoId) ||
                '';

              return buildCoursePayloadFromExtraction({
                title,
                instructor,
                thumbnail,
                playlistId,
                playlistUrl: targetUrl,
                description: `Complete course with ${extractedVideos.length} video lessons from ${instructor}.`,
                videos: extractedVideos
              });
            }
          }
        }
      } catch {
        // Try next
      }
    }
  }

  // 5. Fallback: Fetch metadata via oEmbed/noembed
  const fullTargetUrl = playlistId
    ? `https://www.youtube.com/playlist?list=${playlistId}`
    : `https://www.youtube.com/watch?v=${startingVideoId}`;

  const meta = await fetchYoutubeMetadata(fullTargetUrl);

  if (meta && meta.title) {
    const title = meta.title;
    const instructor = meta.author || 'YouTube Instructor';
    const thumbnail =
      meta.thumbnail ||
      (startingVideoId ? getYoutubeThumbnail(startingVideoId) : '');

    // If single video was provided
    if (!playlistId && startingVideoId) {
      return buildCoursePayloadFromExtraction({
        title,
        instructor,
        thumbnail,
        playlistId: '',
        playlistUrl: fullTargetUrl,
        description: `Full video course by ${instructor}.`,
        videos: [
          {
            videoId: startingVideoId,
            title: title,
            durationMinutes: 45,
            thumbnail
          }
        ]
      });
    }

    // Playlist metadata succeeded but video extraction was blocked by proxies
    const partialPayload = buildCoursePayloadFromExtraction({
      title,
      instructor,
      thumbnail,
      playlistId,
      playlistUrl: fullTargetUrl,
      description: `Complete playlist course by ${instructor}.`,
      videos: []
    });

    return {
      ...partialPayload,
      needsManualLessons: true
    };
  }

  throw new Error(
    'Unable to fetch playlist data. Please verify the link or check your internet connection.'
  );
};

