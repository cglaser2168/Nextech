using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Nextech.Server.Models;

namespace Nextech.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StoryController : ControllerBase
    {
        private readonly IMemoryCache _cache;
        private readonly HttpClient _client;

        public StoryController(IMemoryCache cache, HttpClient client)
        {
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _client = client ?? throw new ArgumentNullException(nameof(client));
        }

        private readonly string BASE_URL = "https://hacker-news.firebaseio.com/v0/";
        private readonly string BASE_SUFFIX = ".json?print=pretty";
        private readonly string CACHE_KEY = "NewStories";

        /// <summary>
        /// Gets and caches the new stories.
        /// </summary>
        /// <returns>The initial page of stories.</returns>
        [HttpGet("NewStories")]
        public async Task<StoryPayloadDto> GetNewStories()
        {
            var stories = await GetStoriesBasedOnCache();
            return new StoryPayloadDto() { RecordCount = stories.Count, Stories = stories.Take(20).ToList(), IsReset = false };
        }

        /// <summary>
        /// Gets a page of stories.
        /// </summary>
        /// <param name="pageNumber">The number of the page being requested.</param>
        /// <param name="pageSize">The size of the page.</param>
        /// <returns>The correct page if </returns>
        [HttpPost("PagedStories/{pageNumber}/{pageSize}")]
        public async Task<StoryPayloadDto> GetPagedStories(int pageNumber, int pageSize, [FromForm] string searchText = "")
        {
            var stories = await GetStoriesBasedOnCache();

            var test = stories.Where(t => t.Title.Contains(searchText) ||
                        t.Url.ToLower().Contains(searchText)).ToList();

            if (!string.IsNullOrWhiteSpace(searchText))
            {
                stories = stories.Where(t =>
                    t.Title.Contains(searchText) ||
                    t.Url.ToLower().Contains(searchText)).ToList();
            }

            if (stories.Count < pageNumber * pageSize)
            {
                return new StoryPayloadDto()
                {
                    RecordCount = stories.Count,
                    Stories = stories.Take(pageSize).ToList(),
                    IsReset = true
                };
            }

            return new StoryPayloadDto()
            {
                RecordCount = stories.Count,
                IsReset = false,
                Stories = stories.Skip((pageNumber - 1) * pageSize)
                .Take(pageSize).ToList()
            };
        }

        public async Task<List<StoryDisplayDto>> GetStoriesBasedOnCache()
        {
            bool isCached = _cache.TryGetValue(CACHE_KEY, out List<StoryDisplayDto>? cachedStories);
            return isCached ? cachedStories! : await FetchStoriesFromApi();
        }

        // Making this virtual lets me mock it.
        public virtual async Task<List<StoryDisplayDto>> FetchStoriesFromApi()
        {
            var response = await _client.GetAsync($"{BASE_URL}newstories{BASE_SUFFIX}");
            response.EnsureSuccessStatusCode();

            var storyIds = await response.Content.ReadFromJsonAsync<List<int>>();

            if (storyIds == null)
                throw new Exception("Could not get stories.");

            List<StoryDisplayDto> stories = new();
            await Parallel.ForEachAsync(storyIds, async (id, token) =>
            {
                var storyResponse = await _client.GetAsync($"{BASE_URL}item/{id + BASE_SUFFIX}");
                storyResponse.EnsureSuccessStatusCode();

                var storyContent = await storyResponse.Content.ReadFromJsonAsync<StoryDto>();

                if (storyContent != null)
                    stories.Add(new() { Title = storyContent.Title, Url = storyContent.Url ?? string.Empty });
            });

            return _cache.Set(CACHE_KEY, stories);
        }
    }
}
