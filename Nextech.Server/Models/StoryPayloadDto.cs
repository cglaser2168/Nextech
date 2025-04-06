namespace Nextech.Server.Models;

public record StoryPayloadDto
{
    public int RecordCount { get; set; }
    public bool IsReset { get; set; }
    public List<StoryDisplayDto> Stories { get; set; } = new();
}
