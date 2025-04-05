namespace Nextech.Server.Models;

public record StoryDto
{
    public int Id { get; set; }
    public bool Deleted { get; set; }
    public bool Dead { get; set; }
    public string By { get; set; } = string.Empty;
    public int Time { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public int Score { get; set; }
    public string Title { get; set; } = string.Empty;
    public List<int> Kids { get; set; } = new();
    public int Descendants { get; set; }
}