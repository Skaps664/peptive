# WSL → Windows Firewall Fix

## Problem
WSL (Linux) cannot connect to Local by Flywheel (Windows) despite firewall rule being created.

## Current Status
- ✅ Firewall rule created
- ✅ .env.local updated to use IP: `http://172.21.96.1`
- ✅ All API clients configured with `Host: peptivepeptides.local` header
- ❌ Connection still timing out

---

## Solution 1: Enhanced Firewall Rules (RECOMMENDED)

Open **Windows PowerShell as Administrator** and run:

```powershell
# Remove old rule
Remove-NetFirewallRule -DisplayName "Local for WSL" -ErrorAction SilentlyContinue

# Allow all TCP from WSL subnet
New-NetFirewallRule -DisplayName "WSL to Windows" -Direction Inbound -Action Allow -RemoteAddress 172.16.0.0/12 -Protocol TCP -Enabled True

# Specifically allow HTTP/HTTPS
New-NetFirewallRule -DisplayName "HTTP from WSL" -Direction Inbound -LocalPort 80,443 -Action Allow -Protocol TCP -Enabled True

# Allow from specific WSL IP
New-NetFirewallRule -DisplayName "WSL Direct" -Direction Inbound -Action Allow -RemoteAddress 172.21.96.0/24 -Protocol TCP -Enabled True
```

**After running these:**
1. Restart Local by Flywheel (stop and start the site)
2. In WSL, restart your Next.js dev server (`npm run dev`)
3. Visit http://localhost:3000/api-test

---

## Solution 2: Local by Flywheel Network Exposure

1. Open **Local by Flywheel** on Windows
2. Click your site **"peptivepeptides"**
3. Look for settings/preferences
4. Enable **"Expose to network"** or **"Allow external connections"**
5. Note any new URL or IP it provides
6. Update `.env.local` if needed

---

## Solution 3: Use Windows localhost Directly

Local by Flywheel might be accessible on `localhost` from Windows but not from WSL. Try:

1. In Windows PowerShell, run:
   ```powershell
   netsh interface portproxy add v4tov4 listenport=8080 listenaddress=172.21.96.1 connectport=80 connectaddress=127.0.0.1
   ```

2. In WSL `.env.local`, change to:
   ```
   NEXT_PUBLIC_WOOCOMMERCE_URL=http://172.21.96.1:8080
   ```

3. Restart Next.js: `npm run dev`

**To remove this port proxy later:**
```powershell
netsh interface portproxy delete v4tov4 listenport=8080 listenaddress=172.21.96.1
```

---

## Solution 4: ngrok Tunnel (Quick Workaround)

**On Windows** (in PowerShell):

1. Download ngrok: https://ngrok.com/download
2. Run:
   ```powershell
   ngrok http 80 --host-header=peptivepeptides.local
   ```
3. Copy the `https://xxxx.ngrok.io` URL it gives you
4. In WSL `.env.local`:
   ```
   NEXT_PUBLIC_WOOCOMMERCE_URL=https://xxxx.ngrok.io
   ```
5. Remove the `Host:` header from API clients (ngrok handles it)

---

## Solution 5: Disable Windows Firewall (NOT RECOMMENDED)

**Only for testing**, in Windows PowerShell (Admin):
```powershell
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False
```

**Re-enable after testing:**
```powershell
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

---

## Testing Commands

After trying any solution, test with these commands in WSL:

```bash
# Test basic connection
curl -H "Host: peptivepeptides.local" http://172.21.96.1/wp-json/

# Test Store API
curl -H "Host: peptivepeptides.local" http://172.21.96.1/wp-json/wc/store/v1/products

# If using port proxy (Solution 3)
curl -H "Host: peptivepeptides.local" http://172.21.96.1:8080/wp-json/
```

Expected success response: JSON starting with `{"namespace":"wc/store/v1"...`

---

## Current Configuration

**Files already updated:**
- `.env.local` → `NEXT_PUBLIC_WOOCOMMERCE_URL=http://172.21.96.1`
- `lib/woocommerce.ts` → Has `Host: peptivepeptides.local` header
- `lib/wordpress.ts` → Has `Host: peptivepeptides.local` header
- `lib/store-api.ts` → Has `Host: peptivepeptides.local` header
- `lib/auth.ts` → Has `Host: peptivepeptides.local` header
- `/etc/hosts` → Clean, only has `172.21.96.1 peptivepeptides.local`

**Next Steps:**
1. Try Solution 1 (Enhanced firewall rules)
2. If that fails, try Solution 3 (Port proxy)
3. If still failing, try Solution 4 (ngrok)
