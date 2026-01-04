namespace FlowHerAPI.Models;

public class QuantityOption
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int Stems { get; set; }
    public decimal PriceModifier { get; set; }

    public Product Product { get; set; } = null!;
}
