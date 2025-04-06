using Nextech.Server.Models;

namespace Nextech.Server.Test;

public class TestData
{
    public List<int> StoryIds = [123,234,345,456,567,678,789,890];

    public List<StoryDisplayDto> Stories =
    [
        new StoryDisplayDto(){ Title = "A test Title", Url = "hiip://beepboop.gov" },
        new StoryDisplayDto() { Title = "Not google", Url = "hiip://notgoogle.com" },
        new StoryDisplayDto() { Title = "Test of things :)", Url = "hiip://thingTest.com" },
    ];

    public List<StoryDisplayDto> FilteredStories = [
        new StoryDisplayDto(){ Title = "A test Title", Url = "hiip://beepboop.gov" },
        new StoryDisplayDto() { Title = "Test of things :)", Url = "hiip://thingTest.com" },
    ];

    public List<StoryDisplayDto> SingleStory = [ new StoryDisplayDto(){ Title = "A test Title", Url = "hiip://beepboop.gov" } ];
}
