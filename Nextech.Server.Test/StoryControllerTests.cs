using Microsoft.Extensions.Caching.Memory;
using Moq;
using Moq.Protected;
using Newtonsoft.Json;
using Nextech.Server.Controllers;
using Nextech.Server.Models;

namespace Nextech.Server.Test;

public class StoryControllerTests
{
    private readonly TestData _testData;
    private readonly IMemoryCache _cache;

    public StoryControllerTests()
    {
        _testData = new TestData();
        _cache = new MemoryCache(new MemoryCacheOptions());
    }

    [Fact]
    public void FetchStoriesFromApi_NoInitialResponse_Throws()
    {
        var httpHandler = new Mock<HttpMessageHandler>();

        httpHandler.Protected().Setup<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.IsAny<HttpRequestMessage>(),
            ItExpr.IsAny<CancellationToken>()
        ).ReturnsAsync(new HttpResponseMessage());

        var clientMock = new HttpClient(httpHandler.Object);

        var sut = new StoryController(_cache, clientMock);

        var error = Assert.ThrowsAnyAsync<Exception>(async () => await sut.FetchStoriesFromApi());
    }

    [Fact]
    public async Task FetchStoriesFromApi_ValidResponse_SavesData()
    {
        var expected = _testData.SingleStory;

        var httpHandler = new Mock<HttpMessageHandler>();
        httpHandler.Protected().SetupSequence<Task<HttpResponseMessage>>(
            "SendAsync",
            ItExpr.IsAny<HttpRequestMessage>(),
            ItExpr.IsAny<CancellationToken>()
        ).ReturnsAsync(new HttpResponseMessage() { Content = new StringContent(JsonConvert.SerializeObject(new List<int>() { 123 })) })
        .ReturnsAsync(new HttpResponseMessage() { Content = new StringContent(JsonConvert.SerializeObject(expected.First()))});

        var clientMock = new HttpClient(httpHandler.Object);

        var sut = new StoryController(new MemoryCache(new MemoryCacheOptions()), clientMock);
        var results = await sut.FetchStoriesFromApi();

        Assert.Equivalent(_testData.SingleStory, results);
    }

    [Fact]
    public void GetNewStories_Cached_ReturnsCachedStories()
    {
        object stories = _testData.Stories;
        var expected = new StoryPayloadDto() { RecordCount = _testData.Stories.Count, Stories = _testData.Stories };

        var mockCache = new Mock<IMemoryCache>();
        mockCache.Setup(t => t.TryGetValue(It.IsAny<string>(), out stories))
            .Returns(true);

        var httpHandler = new Mock<HttpMessageHandler>();
        var clientMock = new HttpClient(httpHandler.Object);

        var sut = new Mock<StoryController>(mockCache.Object, clientMock);

        var result = sut.Object.GetNewStories();

        Assert.Equivalent(expected, result.Result);
    }

    [Fact]
    public void GetNewStories_NotCached_ReturnsFreshData()
    {
        object output = new List<StoryDisplayDto>();
        var expected = new StoryPayloadDto() { RecordCount = _testData.Stories.Count, Stories = _testData.Stories };

        var httpHandler = new Mock<HttpMessageHandler>();
        var clientMock = new HttpClient(httpHandler.Object);

        var sut = new Mock<StoryController>(_cache, clientMock);
        sut.Setup(t => t.FetchStoriesFromApi()).ReturnsAsync(_testData.Stories);

        var result = sut.Object.GetNewStories();

        Assert.Equivalent(expected, result.Result);
    }

    [Fact]
    public async Task GetPagedStories_NoSearch_ReturnsBaseData()
    {
        object stories = _testData.Stories;
        var expected = new StoryPayloadDto() { RecordCount = _testData.Stories.Count, Stories = _testData.Stories, IsReset = true };

        var mockCache = new Mock<IMemoryCache>();
        mockCache.Setup(t => t.TryGetValue(It.IsAny<string>(), out stories))
            .Returns(true);

        var httpHandler = new Mock<HttpMessageHandler>();
        var clientMock = new HttpClient(httpHandler.Object);

        var sut = new StoryController(mockCache.Object, clientMock);

        var result = await sut.GetPagedStories(1, 20);

        Assert.Equivalent(expected, result);
    }

    [Fact]
    public async Task GetPagedStories_SearchFilter_ReturnsFilteredData()
    {
        object stories = _testData.Stories;
        var expected = new StoryPayloadDto() { RecordCount = _testData.FilteredStories.Count, Stories = _testData.FilteredStories, IsReset = true };

        var mockCache = new Mock<IMemoryCache>();
        mockCache.Setup(t => t.TryGetValue(It.IsAny<string>(), out stories))
            .Returns(true);

        var httpHandler = new Mock<HttpMessageHandler>();
        var clientMock = new HttpClient(httpHandler.Object);

        var sut = new StoryController(mockCache.Object, clientMock);

        var result = await sut.GetPagedStories(1, 20, "test");

        Assert.Equivalent(expected, result);
    }

    [Fact]
    public async Task GetPagedStories_SearchFilter_DoesNotResetPage()
    {
        object stories = _testData.SingleStory;
        var expected = new StoryPayloadDto() { RecordCount = _testData.SingleStory.Count, Stories = _testData.SingleStory, IsReset = false };

        var mockCache = new Mock<IMemoryCache>();
        mockCache.Setup(t => t.TryGetValue(It.IsAny<string>(), out stories))
            .Returns(true);

        var httpHandler = new Mock<HttpMessageHandler>();
        var clientMock = new HttpClient(httpHandler.Object);

        var sut = new StoryController(mockCache.Object, clientMock);

        var result = await sut.GetPagedStories(1, 1, "test");

        Assert.Equivalent(expected, result);
    }
}