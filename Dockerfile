# 1. الـ Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

# 2. الـ SDK عشان الـ Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# نسخ ملفات الـ .csproj
COPY ["CourtBookingSystem.API/CourtBookingSystem.API.csproj", "CourtBookingSystem.API/"]
COPY ["CourtBookingSystem.Application/CourtBookingSystem.Application.csproj", "CourtBookingSystem.Application/"]
COPY ["CourtBookingSystem.Infrastructure/CourtBookingSystem.Infrastructure.csproj", "CourtBookingSystem.Infrastructure/"]
COPY ["CourtBookingSystem.Domain/CourtBookingSystem.Domain.csproj", "CourtBookingSystem.Domain/"]

RUN dotnet restore "CourtBookingSystem.API/CourtBookingSystem.API.csproj"

# نسخ بقية الكود وعمل الـ Publish
COPY . .
WORKDIR "/src/CourtBookingSystem.API"
# 🎯 التعديل هنا: زودنا AS publish في السطر اللي جاي ده عشان الدوكر يلقطها صح
FROM build AS publish
RUN dotnet publish "CourtBookingSystem.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 3. النسخة النهائية الفاينال
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CourtBookingSystem.API.dll"]