# Use the official .NET SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY ["FlowHerAPI.csproj", "./"]
RUN dotnet restore "FlowHerAPI.csproj"

# Copy the rest of the source code
COPY . .
WORKDIR "/src/."

# Build and publish
RUN dotnet publish "FlowHerAPI.csproj" -c Release -o /app/publish

# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Configure for Render
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "FlowHerAPI.dll"]
