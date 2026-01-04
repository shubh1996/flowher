using FlowHerAPI.Models;

namespace FlowHerAPI.Services;

public interface IJwtService
{
    string GenerateToken(User user);
}
