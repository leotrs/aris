# AI Copilot Setup Guide

## Quick Start (Local Development)

1. **Get your Anthropic API key**:
   - Go to https://console.anthropic.com/
   - Sign in with your Claude account
   - Navigate to "API Keys" → "Create Key"
   - Copy the key (starts with `sk-ant-`)

2. **Configure locally**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and add your API key:
   # ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

3. **Start the backend**:
   ```bash
   uvicorn main:app --reload
   ```

4. **Test in frontend**:
   - Open the AI chat panel
   - Send a message
   - You should get real Claude responses instead of "mock response"

## Production Deployment

### Environment Variables to Set

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `COPILOT_PROVIDER` | Optional | Force provider selection (defaults to auto-detect) |

### Platform-Specific Instructions

#### Heroku
```bash
heroku config:set ANTHROPIC_API_KEY=sk-ant-your-key-here
```

#### Railway
```bash
railway variables set ANTHROPIC_API_KEY=sk-ant-your-key-here
```

#### Docker
```yaml
# docker-compose.yml
environment:
  - ANTHROPIC_API_KEY=sk-ant-your-key-here
```

#### GitHub Actions (CI/CD)
1. Go to repo Settings → Secrets and variables → Actions
2. Add secret: `ANTHROPIC_API_KEY`
3. Reference in workflow: `${{ secrets.ANTHROPIC_API_KEY }}`

## Verification

### Test API Key Works
```bash
# In backend directory
uv run python -c "
import asyncio
import os
from aris.services.copilot.factory import ProviderFactory

async def test():
    provider = await ProviderFactory.create_available_provider()
    print(f'Active provider: {provider.name}')
    print(f'Available: {await provider.is_available()}')

asyncio.run(test())
"
```

Expected output:
```
Active provider: anthropic
Available: True
```

### Test End-to-End
1. Start backend: `uvicorn main:app --reload`
2. Open frontend AI chat
3. Send message: "Hello, can you help me with scientific writing?"
4. Should receive real Claude response

## Cost Management

- **Monitor usage** at https://console.anthropic.com/
- **Set billing alerts** in your Anthropic account
- **Consider rate limiting** for production (see usage tracking docs)

## Troubleshooting

### "Provider not available" error
- Check API key is correctly set in environment
- Verify key starts with `sk-ant-`
- Check Anthropic console for key status

### Still getting mock responses
- Restart backend after setting environment variable
- Check logs for provider initialization messages
- Verify environment variable is being read

### Rate limit errors
- Check your Anthropic usage limits
- Consider implementing user rate limiting
- Monitor costs in Anthropic console