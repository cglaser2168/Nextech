namespace Nextech.Server.Models;

public record StoryDisplayDto
{
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;

}

public record StoryPayloadDto
{
    public int RecordCount { get; set; }
    public List<StoryDisplayDto> Stories { get; set; } = new();
}