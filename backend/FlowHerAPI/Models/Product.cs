namespace FlowHerAPI.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public string Category { get; set; } = string.Empty;
    public bool EcoFriendly { get; set; }
    public string? SustainabilityInfo { get; set; }
    public bool InStock { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<ComboOption> ComboOptions { get; set; } = new List<ComboOption>();
    public ICollection<QuantityOption> QuantityOptions { get; set; } = new List<QuantityOption>();
}
