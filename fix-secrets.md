# How to Fix GitHub Push Protection Issues

GitHub has detected sensitive information in your repository and is blocking pushes. Here's how to fix it:

## Option 1: Use GitHub's Unblock URL (Easiest)

1. Go to the URL provided in the error message:
   ```
   https://github.com/Eshwar187/constructhub-ai/security/secret-scanning/unblock-secret/2vYabzifxKDaPrHfMhJZ8Ei5rvc
   ```

2. Click "I understand the risk, allow this secret" to unblock the push.

## Option 2: Remove the Secret from Git History (More Secure)

If you want to completely remove the secret from your Git history:

1. Install BFG Repo-Cleaner:
   ```
   # Download BFG Jar file
   curl -o bfg.jar https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar
   ```

2. Create a file named `secrets.txt` with the sensitive information:
   ```
   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
   mongodb+srv://eshwar2005:Eshwar123@cluster0.1zjx9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

3. Run BFG to remove the secrets:
   ```
   java -jar bfg.jar --replace-text secrets.txt constructhub-ai.git
   ```

4. Clean up and push:
   ```
   cd constructhub-ai.git
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force
   ```

## Option 3: Create a New Repository (Clean Start)

If you're having trouble with the above methods:

1. Create a new repository on GitHub
2. Push your current code (with secrets removed) to the new repository:
   ```
   git remote remove origin
   git remote add origin https://github.com/Eshwar187/new-constructhub-ai.git
   git push -u origin main
   ```

## Important Notes

1. **Rotate Your Credentials**: Even after removing secrets from Git history, consider the exposed credentials compromised and rotate them.

2. **Use Environment Variables**: Always use environment variables for sensitive information instead of hardcoding them.

3. **Add to .gitignore**: Make sure `.env.local` and other files with secrets are in your `.gitignore` file.
