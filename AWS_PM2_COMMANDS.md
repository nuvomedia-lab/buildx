# PM2 Log Commands for AWS

## View Live Logs

```bash
# View all app logs
pm2 logs

# View specific app logs
pm2 logs your-app-name

# Follow logs in real-time
pm2 logs --follow
```

## View Log History

```bash
# View last 100 lines
pm2 logs --lines 100

# View logs with timestamp
pm2 logs --timestamp
```

## Save Logs to File

```bash
# Save logs to file
pm2 logs --lines 1000 > logs.txt

# Or redirect output
pm2 logs --err --out --lines 2000 > deployment.log 2>&1
```

## Other Useful Commands

```bash
# List all processes
pm2 list

# Show detailed info
pm2 show your-app-name

# Restart app to see new logs
pm2 restart your-app-name

# Stop app
pm2 stop your-app-name

# View logs and restart after code update
pm2 logs your-app-name --lines 50
pm2 restart your-app-name
pm2 logs your-app-name --follow
```

## Troubleshooting Login

After deploying the new code with logging, run:

```bash
pm2 logs --lines 200
```

Then try to login and you'll see detailed logs showing:
- Email being searched
- User found or not
- isActive value
- Password validation result
- Exact error if any

