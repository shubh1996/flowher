namespace FlowHerAPI.DTOs;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public List<string> Images { get; set; } = new();
    public string Category { get; set; } = string.Empty;
    public bool EcoFriendly { get; set; }
    public string? SustainabilityInfo { get; set; }
    public List<ComboOptionDto> ComboOptions { get; set; } = new();
    public List<QuantityOptionDto> QuantityOptions { get; set; } = new();
    public bool InStock { get; set; }
}

public class ComboOptionDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? Image { get; set; }
    public string Category { get; set; } = string.Empty;
}

public class QuantityOptionDto
{
    public int Stems { get; set; }
    public decimal PriceModifier { get; set; }
}
