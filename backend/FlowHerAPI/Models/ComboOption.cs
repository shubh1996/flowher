namespace FlowHerAPI.Models;

public class ComboOption
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public string Category { get; set; } = "accessory";

    public Product Product { get; set; } = null!;
}
