# Fly.io SQLite Deployment

## 1. Create persistent volume for SQLite database

```bash
fly volumes create data --region dfw --size 1
```

This creates a 1GB persistent volume named "data" in the Dallas region.

## 2. Set environment variables

```bash
fly secrets set RESEND_API_KEY="your_resend_api_key_here"
fly secrets set HOST="https://hyperwave.fly.dev"
fly secrets set EMAIL_FROM="noreply@hyperwave.fly.dev"
```

## 3. Deploy the application

```bash
fly deploy
```

## 4. Verify deployment

```bash
fly status
fly logs
```

## Database persistence

The SQLite database will be stored at `/data/app.db` inside the container, which is mounted to the persistent volume. This ensures your data survives deployments and machine restarts.

## Volume management

```bash
# List volumes
fly volumes list

# Show volume details
fly volumes show data

# Backup database (optional)
fly ssh console -C "cp /data/app.db /tmp/backup.db"
```
