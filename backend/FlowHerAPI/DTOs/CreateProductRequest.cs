namespace FlowHerAPI.DTOs;

public class CreateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public string Category { get; set; } = string.Empty;
    public bool EcoFriendly { get; set; }
    public string? SustainabilityInfo { get; set; }
    public bool InStock { get; set; } = true;
    public List<ComboOptionDto> ComboOptions { get; set; } = new();
    public List<QuantityOptionDto> QuantityOptions { get; set; } = new();
}
