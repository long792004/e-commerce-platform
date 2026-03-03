# Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore
COPY ["e-commerce-platform-BE.csproj", "./"]
RUN dotnet restore "e-commerce-platform-BE.csproj"

# Copy everything else and build
COPY . .
RUN dotnet publish "e-commerce-platform-BE.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "e-commerce-platform-BE.dll"]
