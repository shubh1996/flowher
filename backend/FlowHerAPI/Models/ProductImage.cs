namespace FlowHerAPI.Models;

public class ProductImage
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int Order { get; set; }

    public Product Product { get; set; } = null!;
}
