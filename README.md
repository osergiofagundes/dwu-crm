# DWU CRM

```bash
# Para rodar o projeto

# Backend
cd api
dotnet restore
dotnet ef database update
dotnet run

# Frontend
cd web
npm install
npm run dev

# O banco de dados em PostgreSQL eu criei localmente e rodei as migrations
# Variaveis
Host=localhost;
Database=dwu-db;
Username=postgres;
Password=admin;
```
