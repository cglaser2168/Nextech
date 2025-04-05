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
        private readonly MemoryCacheEntryOptions _options;

        public StoryController(IMemoryCache cache, HttpClient client)
        {
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _client = client ?? throw new ArgumentNullException(nameof(client));

            _options = new() { AbsoluteExpiration = DateTimeOffset.UtcNow.AddHours(2) };
        }

        private readonly string BASE_URL = "https://hacker-news.firebaseio.com/v0/";
        private readonly string BASE_SUFFIX = ".json?print=pretty";
        private readonly string ID_CACHE_KEY = "NewStoryIds";

        /// <summary>
        /// Gets the new stories.
        /// </summary>
        /// <returns>The initial page of stories.</returns>
        [HttpGet("NewStories")]
        public async Task<List<StoryDisplayDto>> GetNewStories()
        {
            bool isCached = _cache.TryGetValue(ID_CACHE_KEY, out List<int>? cachedIds);

            if (!isCached)
            {
                var response = await _client.GetAsync($"{BASE_URL}newstories{BASE_SUFFIX}");
                response.EnsureSuccessStatusCode();

                var storyIds = await response.Content.ReadFromJsonAsync<List<int>>();

                if (storyIds == null)
                    throw new Exception("Could not get stories.");

                _cache.Set(ID_CACHE_KEY, storyIds);
            }

            return await GetPagedStories(1, 20);
        }

        /// <summary>
        /// Gets a page of stories.
        /// </summary>
        /// <param name="pageNumber">The number of the page being requested.</param>
        /// <param name="pageSize">The size of the page.</param>
        /// <returns></returns>
        [HttpGet("PagedStories/{pageNumber}/{pageSize}")]
        public async Task<List<StoryDisplayDto>> GetPagedStories([FromQuery] int pageNumber, [FromQuery] int pageSize)
        {
            string pageKey = $"page-{pageNumber}-size-{pageSize}";
            var isPageCached = _cache.TryGetValue(pageKey, out List<StoryDisplayDto>? pageStories);

            if (isPageCached)
                return pageStories!;

            var storyIds = _cache.Get<List<int>>(ID_CACHE_KEY)!;
            var stories = await GetStoriesByIds(storyIds.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList());

            _cache.Set(pageKey, stories);

            return stories;
        }

        private async Task<List<StoryDisplayDto>> GetStoriesByIds(List<int> ids)
        {
            List<StoryDisplayDto> stories = new();
            await Parallel.ForEachAsync(ids, async (id, token) =>
            {
                var storyResponse = await _client.GetAsync($"{BASE_URL}item/{id + BASE_SUFFIX}");
                storyResponse.EnsureSuccessStatusCode();

                var storyContent = await storyResponse.Content.ReadFromJsonAsync<StoryDto>();

                if (storyContent != null)
                    stories.Add(new() { Title = storyContent.Title, Url = storyContent.Url ?? string.Empty });
            });

            return stories;
        }
    }
}
